import React, { useState } from 'react';
// FIX: Import the `Profile` type.
import { UserProfile, UserRole, Profile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ErrorAlert from './ErrorAlert';

interface TeamManagementPageProps {
    user: UserProfile;
    onInviteUser: (email: string, role: UserRole) => Promise<void>;
}

const TeamManagementPage: React.FC<TeamManagementPageProps> = ({ user, onInviteUser }) => {
    const { t } = useLanguage();
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>('lawyer');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const teamMembers = user.teamMembers || [];
    
    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await onInviteUser(inviteEmail, inviteRole);
            setSuccessMessage(`Invitation sent to ${inviteEmail}.`);
            setInviteEmail('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('teamTitle')}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{t('teamSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('teamInviteNew')}</h2>
                        <form onSubmit={handleInvite} className="space-y-4">
                            {error && <ErrorAlert message={error} />}
                            {successMessage && <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-md text-sm">{successMessage}</div>}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('teamEmail')}</label>
                                <input type="email" id="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required className="w-full input-field" placeholder="name@firm.com" />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('teamRole')}</label>
                                <select id="role" value={inviteRole} onChange={e => setInviteRole(e.target.value as UserRole)} className="w-full input-field">
                                    <option value="lawyer">{t('teamRoleLawyer')}</option>
                                    <option value="paralegal">{t('teamRoleParalegal')}</option>
                                    <option value="admin">{t('teamRoleAdmin')}</option>
                                </select>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
                                {isLoading ? t('teamSending') : t('teamSendInvite')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                           <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('teamCurrentMembers')} ({teamMembers.length + 1})</h2>
                        </div>
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                           <TeamMemberListItem member={{...user, full_name: user.full_name || 'Me'}} />
                           {teamMembers.map(member => <TeamMemberListItem key={member.id} member={member} />)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamMemberListItem: React.FC<{member: UserProfile | Profile}> = ({ member }) => {
    // A simplified Profile type from Supabase might be passed for team members
    // FIX: Use truthiness check for `full_name` instead of `in` operator.
    // The `in` operator causes a TS error because `full_name` exists on both types in the union,
    // making the `else` branch unreachable and narrowing `member` to type `never`.
    const fullName = member.full_name || member.email;
    const email = member.email;
    const role = member.role;

    return (
        <li className="p-4 flex justify-between items-center">
            <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 mr-3 text-sm flex-shrink-0">
                    {(fullName?.[0] || email?.[0])?.toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{fullName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p>
                </div>
            </div>
             <span className="capitalize text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">{role}</span>
        </li>
    );
};

export default TeamManagementPage;