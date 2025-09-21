
import React, { useRef, useEffect } from 'react';
import { Page, UserProfile } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import XIcon from './icons/XIcon';
import DashboardIcon from './icons/DashboardIcon';
import EyeIcon from './icons/EyeIcon';
import FolderIcon from './icons/FolderIcon';
import TemplateIcon from './icons/TemplateIcon';
import BillingIcon from './icons/BillingIcon';
import SupportIcon from './icons/SupportIcon';
import RoadmapIcon from './icons/RoadmapIcon';

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
      <nav className="flex-grow px-4 space-y-1">
          <NavLink page="dashboard" currentPage={currentPage} onNavigate={onNavigate} icon={<DashboardIcon className="w-5 h-5" />}>Dashboard</NavLink>
          
          <p className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis</p>
          <NavLink page="review" currentPage={currentPage} onNavigate={onNavigate} icon={<EyeIcon className="w-5 h-5" />}>Analyze Contract</NavLink>
          
          <p className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</p>
          <NavLink page="documents" currentPage={currentPage} onNavigate={onNavigate} icon={<FolderIcon className="w-5 h-5" />}>Saved Analyses</NavLink>
          <NavLink page="templates" currentPage={currentPage} onNavigate={onNavigate} icon={<TemplateIcon className="w-5 h-5" />}>Templates</NavLink>

          <p className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</p>
          <NavLink page="roadmap" currentPage={currentPage} onNavigate={onNavigate} icon={<RoadmapIcon className="w-5 h-5" />}>Roadmap</NavLink>

          <p className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
          <NavLink page="billing" currentPage={currentPage} onNavigate={onNavigate} icon={<BillingIcon className="w-5 h-5" />}>Billing</NavLink>
          <NavLink page="support" currentPage={currentPage} onNavigate={onNavigate} icon={<SupportIcon className="w-5 h-5" />}>Support</NavLink>
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
                <h1 className="text-xl font-bold tracking-tight">oddfalcon</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="flex-grow flex flex-col py-6 space-y-1 overflow-y-auto custom-scrollbar">
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
                Log Out
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
