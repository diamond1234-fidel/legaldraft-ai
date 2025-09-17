import React, { useState, useRef, useEffect } from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import MenuIcon from './icons/MenuIcon';
import { Notification, Page } from '../types';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    notifications: Notification[];
    onMarkNotificationRead: (notificationId: string) => void;
    onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, setSidebarOpen, notifications, onMarkNotificationRead, onNavigate }) => {
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigateAndClose = (path: string) => {
        // This is a simplified navigation handler for notifications
        if (path.startsWith('cases/')) {
            // In a real app, you would fetch the matter and navigate
            onNavigate('cases');
        }
        setNotificationsOpen(false);
    }

  return (
    <header className="flex-shrink-0 bg-white dark:bg-slate-800/80 dark:backdrop-blur-lg shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Open sidebar"
            >
                <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <div ref={notificationRef} className="relative">
                    <button onClick={() => setNotificationsOpen(prev => !prev)} className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <span className="sr-only">View notifications</span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
                        {unreadCount > 0 && <span className="absolute top-1 right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                    </button>
                    {isNotificationsOpen && (
                        <NotificationsPanel 
                            notifications={notifications} 
                            onMarkAsRead={onMarkNotificationRead} 
                            onNavigate={handleNavigateAndClose}
                        />
                    )}
                </div>
                <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="sr-only">Toggle dark mode</span>
                    {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;