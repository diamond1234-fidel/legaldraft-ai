import React, { useRef, useEffect } from 'react';
import { Page, UserProfile } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import { ROLES_PERMISSIONS } from '../permissions';
import XIcon from './icons/XIcon';

// Import icons for navigation links
import DashboardIcon from './icons/DashboardIcon';
import UsersIcon from './icons/UsersIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PencilIcon from './icons/PencilIcon';
import EyeIcon from './icons/EyeIcon';
import SearchIcon from './icons/SearchIcon';
import FolderIcon from './icons/FolderIcon';
import TemplateIcon from './icons/TemplateIcon';
import BillingIcon from './icons/BillingIcon';
import SupportIcon from './icons/SupportIcon';
import AdminIcon from './icons/AdminIcon';
import DatabaseIcon from './icons/DatabaseIcon';
import TasksIcon from './icons/TasksIcon';
import LibraryIcon from './icons/LibraryIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import CogIcon from './icons/CogIcon';
import { useLanguage } from '../contexts/LanguageContext';
import PaletteIcon from './icons/PaletteIcon';

interface SidebarProps {
    user: UserProfile;
    onLogout: () => void;
    onNavigate: (page: Page) => void;
    currentPage: Page;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    children: React.ReactNode;
    icon: React.ReactNode;
}> = ({ page, currentPage, onNavigate, children, icon }) => (
    <button 
        onClick={() => onNavigate(page)}
        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPage === page 
            ? 'bg-blue-600 text-white' 
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
        aria-current={currentPage === page ? 'page' : undefined}
    >
        <span className="mr-3">{icon}</span>
        {children}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onNavigate, currentPage, isSidebarOpen, setSidebarOpen }) => {
  const { t } = useLanguage();
  const userRole = user.role;
  const userPermissions = (userRole && userRole in ROLES_PERMISSIONS) ? ROLES_PERMISSIONS[userRole as keyof typeof ROLES_PERMISSIONS] : ROLES_PERMISSIONS['lawyer'];
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setSidebarOpen(false);
        }
    };
    if (isSidebarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, setSidebarOpen]);

  const navLinks = (
      <nav className="flex-grow px-4">
          <NavLink page="dashboard" currentPage={currentPage} onNavigate={onNavigate} icon={<DashboardIcon className="w-5 h-5" />}>{t('sidebarDashboard')}</NavLink>
          
          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('sidebarCaseManagement')}</p>
          <NavLink page="cases" currentPage={currentPage} onNavigate={onNavigate} icon={<BriefcaseIcon className="w-5 h-5" />}>{t('sidebarMatters')}</NavLink>
          {userPermissions.canManageClients && <NavLink page="clients" currentPage={currentPage} onNavigate={onNavigate} icon={<UsersIcon className="w-5 h-5" />}>{t('sidebarClients')}</NavLink>}
          {userPermissions.canPerformIntake && <NavLink page="intake" currentPage={currentPage} onNavigate={onNavigate} icon={<PencilIcon className="w-5 h-5" />}>{t('sidebarNewMatter')}</NavLink>}
          <NavLink page="tasks" currentPage={currentPage} onNavigate={onNavigate} icon={<TasksIcon className="w-5 h-5" />}>{t('sidebarTasks')}</NavLink>
          
          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('sidebarDocumentTools')}</p>
          <NavLink page="draft" currentPage={currentPage} onNavigate={onNavigate} icon={<PencilIcon className="w-5 h-5" />}>{t('sidebarDraft')}</NavLink>
          <NavLink page="review" currentPage={currentPage} onNavigate={onNavigate} icon={<EyeIcon className="w-5 h-5" />}>{t('sidebarReview')}</NavLink>
          <NavLink page="documents" currentPage={currentPage} onNavigate={onNavigate} icon={<FolderIcon className="w-5 h-5" />}>{t('sidebarAllDocuments')}</NavLink>
          <NavLink page="templates" currentPage={currentPage} onNavigate={onNavigate} icon={<TemplateIcon className="w-5 h-5" />}>{t('sidebarTemplates')}</NavLink>

          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('sidebarFirm')}</p>
          <NavLink page="research" currentPage={currentPage} onNavigate={onNavigate} icon={<SearchIcon className="w-5 h-5" />}>{t('sidebarResearch')}</NavLink>
          <NavLink page="advancedResearch" currentPage={currentPage} onNavigate={onNavigate} icon={<LibraryIcon className="w-5 h-5" />}>{t('sidebarAdvancedResearch')}</NavLink>
          {userPermissions.canAccessBilling && (
            <>
              <NavLink page="billing" currentPage={currentPage} onNavigate={onNavigate} icon={<BillingIcon className="w-5 h-5" />}>{t('sidebarBilling')}</NavLink>
              <NavLink page="paymentSettings" currentPage={currentPage} onNavigate={onNavigate} icon={<CogIcon className="w-5 h-5" />}>Payment Settings</NavLink>
              <NavLink page="invoiceSettings" currentPage={currentPage} onNavigate={onNavigate} icon={<PaletteIcon className="w-5 h-5" />}>Invoice Settings</NavLink>
            </>
          )}
          <NavLink page="support" currentPage={currentPage} onNavigate={onNavigate} icon={<SupportIcon className="w-5 h-5" />}>{t('sidebarSupport')}</NavLink>
          {userPermissions.canAccessAdmin && (
            <>
              <NavLink page="team" currentPage={currentPage} onNavigate={onNavigate} icon={<UserGroupIcon className="w-5 h-5" />}>{t('sidebarTeam')}</NavLink>
              <NavLink page="reports" currentPage={currentPage} onNavigate={onNavigate} icon={<ChartBarIcon className="w-5 h-5" />}>{t('sidebarReports')}</NavLink>
              <NavLink page="admin" currentPage={currentPage} onNavigate={onNavigate} icon={<AdminIcon className="w-5 h-5" />}>{t('sidebarAdmin')}</NavLink>
              <NavLink page="sqlEditor" currentPage={currentPage} onNavigate={onNavigate} icon={<DatabaseIcon className="w-5 h-5" />}>{t('sidebarSqlEditor')}</NavLink>
            </>
          )}
      </nav>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      <aside 
        ref={sidebarRef}
        className={`fixed lg:static lg:translate-x-0 inset-y-0 left-0 bg-slate-800 text-white w-64 flex-shrink-0 flex flex-col z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center">
                <DocumentIcon className="h-8 w-8 text-blue-500 mr-3" />
                <h1 className="text-xl font-bold tracking-tight">LegalDraft AI</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="flex-grow flex flex-col py-6 space-y-1 overflow-y-auto">
            {navLinks}
        </div>
        
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
            <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white mr-2 text-sm">
                    {(user.full_name?.[0] || user.email?.[0])?.toUpperCase()}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-100 truncate">{user.full_name || user.email}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full text-left mt-2 flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
            >
                {t('sidebarLogout')}
            </button>
        </div>
      </aside>
    </>
  );
};

// A new icon for the reports page
const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);


export default Sidebar;