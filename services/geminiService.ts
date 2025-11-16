// FIX: Removed unexported LiveSession type.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { APP_STATUS } from '../constants';
import type { AppStatus } from '../types';

// FIX: Changed LiveSession to `any` as it is not an exported type.
let sessionPromise: Promise<any> | null = null;
let mediaStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let outputAudioContext: AudioContext | null = null;
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();

// --- Audio Decoding Helpers ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Audio Encoding Helpers ---
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


interface StartConversationParams {
  systemInstruction: string;
  onStatusChange: (status: AppStatus) => void;
  onTranscript: (isFinal: boolean, text: string, isUser: boolean) => void;
  onError: (error: Error) => void;
}

export const startConversation = async ({ systemInstruction, onStatusChange, onTranscript, onError }: StartConversationParams) => {
  if (sessionPromise) {
    console.log("Conversation already in progress.");
    return;
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  let currentInputTranscription = '';
  let currentOutputTranscription = '';

  outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  nextStartTime = 0;

  sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: systemInstruction,
      outputAudioTranscription: {},
      inputAudioTranscription: {},
    },
    callbacks: {
      onopen: async () => {
        onStatusChange(APP_STATUS.LISTENING);
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          const source = audioContext.createMediaStreamSource(mediaStream);
          scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            if (sessionPromise) {
                sessionPromise.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            }
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);

        } catch (err) {
          onError(err as Error);
          stopConversation();
        }
      },
      onmessage: async (message: LiveServerMessage) => {
        // Handle audio output
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio && outputAudioContext) {
          onStatusChange(APP_STATUS.SPEAKING);
          nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
          const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
          const source = outputAudioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputAudioContext.destination);
          source.addEventListener('ended', () => {
              sources.delete(source);
              if (sources.size === 0) {
                  onStatusChange(APP_STATUS.LISTENING);
              }
          });
          source.start(nextStartTime);
          nextStartTime += audioBuffer.duration;
          sources.add(source);
        }

        // FIX: The `isFinal` property doesn't exist on transcription objects.
        // Accumulate text and use `turnComplete` to determine when a transcript is final.
        if (message.serverContent?.inputTranscription) {
            currentInputTranscription += message.serverContent.inputTranscription.text;
            onTranscript(false, currentInputTranscription, true);
        }
        if (message.serverContent?.outputTranscription) {
            currentOutputTranscription += message.serverContent.outputTranscription.text;
            onTranscript(false, currentOutputTranscription, false);
        }
        if (message.serverContent?.turnComplete) {
            if (currentInputTranscription) {
                onTranscript(true, currentInputTranscription, true);
            }
            if (currentOutputTranscription) {
                onTranscript(true, currentOutputTranscription, false);
            }
            currentInputTranscription = '';
            currentOutputTranscription = '';
        }

        const interrupted = message.serverContent?.interrupted;
        if (interrupted) {
            for (const source of sources.values()) {
                source.stop();
            }
            sources.clear();
            nextStartTime = 0;
            onStatusChange(APP_STATUS.LISTENING);
        }
      },
      // FIX: Corrected onerror parameter type to ErrorEvent and created a new Error.
      onerror: (e: ErrorEvent) => {
        onError(new Error(e.message || 'Live connection error.'));
        stopConversation();
      },
      onclose: () => {
        stopConversation();
      },
    }
  });
};

export const stopConversation = () => {
  if (sessionPromise) {
    sessionPromise.then(session => session.close());
    sessionPromise = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }

  if (scriptProcessor) {
    scriptProcessor.disconnect();
    scriptProcessor = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  if (outputAudioContext) {
    for (const source of sources.values()) {
        source.stop();
    }
    sources.clear();
    outputAudioContext.close();
    outputAudioContext = null;
  }
};
