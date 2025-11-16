
import React from 'react';

const MicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5v3a7.5 7.5 0 01-15 0v-3m15 0a7.5 7.5 0 00-7.5-7.5h-1.5a7.5 7.5 0 00-7.5 7.5m15 0h.008v.008h-.008v-.008z"
    />
  </svg>
);

export default MicIcon;
