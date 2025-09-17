
import React from 'react';

interface ErrorAlertProps {
  message: string;
  title?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, title = "Error" }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 dark:bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded" role="alert">
      <p className="font-bold">{title}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;
