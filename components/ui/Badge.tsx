import React from 'react';
import { LeadStatus } from '../../types';

interface BadgeProps {
  status: LeadStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles = {
    [LeadStatus.New]: 'bg-blue-100 text-blue-800 border-blue-200',
    [LeadStatus.Contacted]: 'bg-amber-100 text-amber-800 border-amber-200',
    [LeadStatus.Converted]: 'bg-green-100 text-green-800 border-green-200',
    [LeadStatus.Lost]: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};
