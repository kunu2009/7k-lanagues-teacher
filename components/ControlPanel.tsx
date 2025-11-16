
import React from 'react';
import { APP_STATUS } from '../constants';
import type { AppStatus } from '../types';
import MicIcon from './icons/MicIcon';
import StopIcon from './icons/StopIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface ControlPanelProps {
  status: AppStatus;
  onToggleConversation: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ status, onToggleConversation }) => {
  const isRecording = status === APP_STATUS.LISTENING || status === APP_STATUS.SPEAKING || status === APP_STATUS.THINKING;
  const isConnecting = status === APP_STATUS.CONNECTING;

  const getButtonClass = () => {
    if (isConnecting) return 'bg-gray-500 cursor-not-allowed';
    if (isRecording) return 'bg-red-600 hover:bg-red-700';
    return 'bg-cyan-500 hover:bg-cyan-600';
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onToggleConversation}
        disabled={isConnecting}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 ${getButtonClass()} ${isRecording ? 'focus:ring-red-400' : 'focus:ring-cyan-300'}`}
        aria-label={isRecording ? 'Stop conversation' : 'Start conversation'}
      >
        {isConnecting ? (
          <SpinnerIcon className="w-10 h-10" />
        ) : isRecording ? (
          <StopIcon className="w-8 h-8" />
        ) : (
          <MicIcon className="w-10 h-10" />
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
