
import React, { useEffect } from 'react';
import { Notification } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '../constants';

interface NotificationToastProps {
    notification: Notification;
    onDismiss: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onDismiss]);

    const baseClasses = "flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800";
    
    const icons = {
        success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        error: <XCircleIcon className="w-6 h-6 text-red-500" />,
        info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
    };

    return (
        <div className={baseClasses} role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
                {icons[notification.type]}
            </div>
            <div className="ml-3 text-sm font-normal">{notification.message}</div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={onDismiss}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    );
};

export default NotificationToast;
