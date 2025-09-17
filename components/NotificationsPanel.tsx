import React from 'react';
import { Notification } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationsPanelProps {
    notifications: Notification[];
    onMarkAsRead: (notificationId: string) => void;
    onNavigate: (path: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkAsRead, onNavigate }) => {
    const { t } = useLanguage();
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }
        if (notification.link_to) {
            // A more robust navigation system would be needed for complex links
            const [page, id] = notification.link_to.split('/');
            // This is a simplified navigation handler
            console.log(`Navigating to ${page} with id ${id}`);
        }
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('notificationsTitle')}</h3>
                {unreadCount > 0 && <p className="text-xs text-slate-500 dark:text-slate-400">{t('notificationsUnread', { count: unreadCount })}</p>}
            </div>
            <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                {notifications.length > 0 ? notifications.map(n => (
                    <li key={n.id}>
                        <button onClick={() => handleNotificationClick(n)} className={`w-full text-left p-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${!n.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <p className={`text-slate-700 dark:text-slate-200 ${!n.is_read ? 'font-bold' : 'font-normal'}`}>{n.message}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                        </button>
                    </li>
                )) : (
                    <li className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">{t('notificationsNone')}</li>
                )}
            </ul>
        </div>
    );
};

export default NotificationsPanel;
