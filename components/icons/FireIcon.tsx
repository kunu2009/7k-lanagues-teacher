import React from 'react';

const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path 
        fillRule="evenodd" 
        d="M12.963 2.286a.75.75 0 00-1.071 1.071 9.75 9.75 0 01-1.742 4.569 9.75 9.75 0 01-4.569 1.742.75.75 0 00-1.071 1.071 9.75 9.75 0 013.486 9.349.75.75 0 001.483-.211 7.5 7.5 0 00-2.35-8.599 7.5 7.5 0 008.599 2.35.75.75 0 00.211-1.483 9.75 9.75 0 01-9.349-3.486z" 
        clipRule="evenodd" 
    />
    <path 
        fillRule="evenodd" 
        d="M12.963 2.286a.75.75 0 00-1.071 1.071.75.75 0 001.071-1.071z" 
        clipRule="evenodd" 
    />
  </svg>
);

export default FireIcon;
