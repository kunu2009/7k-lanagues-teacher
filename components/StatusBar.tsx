
import React from 'react';
import { APP_STATUS } from '../constants';
import type { AppStatus } from '../types';

interface StatusBarProps {
  status: AppStatus;
  error: string | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, error }) => {
  const getStatusContent = () => {
    switch (status) {
      case APP_STATUS.IDLE:
        return <span className="text-slate-400">Press the mic to start</span>;
      case APP_STATUS.CONNECTING:
        return <span className="text-yellow-400">Connecting...</span>;
      case APP_STATUS.LISTENING:
        return <span className="text-green-400">Listening...</span>;
      case APP_STATUS.SPEAKING:
        return <span className="text-cyan-400">Speaking...</span>;
      case APP_STATUS.THINKING:
        return <span className="text-purple-400">Thinking...</span>;
      case APP_STATUS.ERROR:
        return <span className="text-red-400">Error: {error || 'Something went wrong.'}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-6 text-center font-medium">
      {getStatusContent()}
    </div>
  );
};

export default StatusBar;
