"use client"
import { X, RefreshCw, Clock, CheckCircle } from 'lucide-react';
const TimeSlotsUpdate = ({ 
  time, 
  status, 
  primaryAction, 
  primaryActionText,
  primaryActionColor = "bg-red-600 hover:bg-red-700",
  secondaryAction,
  secondaryActionText,
  secondaryActionColor = "bg-orange-500 hover:bg-orange-600"
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'cancelled':
        return {
          icon: <X className="w-4 h-4" />,
          text: 'Cancelled',
          textColor: 'text-red-600',
          iconColor: 'text-red-600'
        };
      case 'rescheduled':
        return {
          icon: <RefreshCw className="w-4 h-4" />,
          text: 'Rescheduled',
          textColor: 'text-orange-500',
          iconColor: 'text-orange-500'
        };
      case 'delayed':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Delayed',
          textColor: 'text-yellow-500',
          iconColor: 'text-yellow-500'
        };
      case 'available':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Available',
          textColor: 'text-green-600',
          iconColor: 'text-green-600'
        };
      default:
        return {
          icon: null,
          text: '',
          textColor: '',
          iconColor: ''
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3">
        <p className="text-sm text-gray-500 mb-1">Upcoming time slot</p>
        <h3 className="text-lg font-semibold text-gray-900">{time}</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={statusConfig.iconColor}>
            {statusConfig.icon}
          </span>
          <span className={`font-medium ${statusConfig.textColor}`}>
            {statusConfig.text}
          </span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {primaryAction && (
            <button 
              onClick={primaryAction}
              className={`px-4 py-2 rounded-md text-white font-medium text-sm transition-colors ${primaryActionColor}`}
            >
              {primaryActionText}
            </button>
          )}
          {secondaryAction && (
            <button 
              onClick={secondaryAction}
              className={`px-4 py-2 rounded-md text-white font-medium text-sm transition-colors ${secondaryActionColor}`}
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotsUpdate