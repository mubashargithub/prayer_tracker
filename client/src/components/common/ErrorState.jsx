import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const ErrorState = ({ title = "Something went wrong", message, onRetry }) => {
  return (
    <Card className="p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-12 border-red-100 dark:border-red-900/30">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{message || "We couldn't load this data. Please try again."}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </Card>
  );
};

export default ErrorState;
