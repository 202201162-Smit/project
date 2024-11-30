import React from 'react';
import { Common_Card } from './Common_Card';

export const Rolechoice = () => {
  return (
    <div className="flex h-screen">
      <Common_Card role="college" className="w-1/2 bg-gradient-to-r from-blue-200 to-blue-500" />
      <Common_Card role="student" className="w-1/2 bg-gradient-to-r from-green-200 to-green-500" />
    </div>
  );
};
