import React, { useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

declare const Chart: any;

interface ReportsPageProps {
    user: UserProfile;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ user }) => {
    const { t } = useLanguage();
    const caseStatusChartRef = useRef<HTMLCanvasElement>(null);
    const taskCompletionChartRef = useRef<HTMLCanvasElement>(null);
    const billableHoursChartRef = useRef<HTMLCanvasElement>(null);

    const reportsData = {
        openCases: user.matters.filter(m => m.status === 'open').length,
        closedCases: user.matters.filter(m => m.status === 'closed').length,
        pendingTasks: user.tasks.filter(t => t.status === 'pending').length,
        completedTasks: user.tasks.filter(t => t.status === 'completed').length,
        totalHoursLogged: user.timeEntries.reduce((acc, entry) => acc + entry.hours, 0),
    };

    useEffect(() => {
        let caseChart: any;
        let taskChart: any;
        let hoursChart: any;
        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.7)';
        const textColor = isDarkMode ? '#cbd5e1' : '#475569';

        if (caseStatusChartRef.current) {
            const ctx = caseStatusChartRef.current.getContext('2d');
            caseChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: [t('reportsOpenMatters'), t('reportsClosedMatters')],
                    datasets: [{
                        data: [reportsData.openCases, reportsData.closedCases],
                        backgroundColor: ['#3b82f6', '#16a34a'],
                        borderColor: isDarkMode ? '#1e293b' : '#ffffff',
                        borderWidth: 2,
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'top', labels: { color: textColor } } } }
            });
        }
        
        if (taskCompletionChartRef.current) {
            const ctx = taskCompletionChartRef.current.getContext('2d');
            taskChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [t('reportsPendingTasks'), t('reportsCompletedTasks')],
                    datasets: [{
                        label: t('reportsTaskStatus'),
                        data: [reportsData.pendingTasks, reportsData.completedTasks],
                        backgroundColor: ['#f59e0b', '#10b981'],
                    }]
                },
                options: { scales: { y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } }, x: { grid: { color: gridColor }, ticks: { color: textColor } } }, plugins: { legend: { display: false } } }
            });
        }

        if (billableHoursChartRef.current) {
            const ctx = billableHoursChartRef.current.getContext('2d');
            const hoursByMatter: {[key: string]: number} = user.timeEntries.reduce((acc, entry) => {
                const matterName = user.matters.find(m => m.id === entry.matter_id)?.matter_name || t('reportsUncategorized');
                acc[matterName] = (acc[matterName] || 0) + entry.hours;
                return acc;
            }, {} as {[key: string]: number});

            hoursChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(hoursByMatter),
                    datasets: [{
                        label: t('reportsHoursLogged'),
                        data: Object.values(hoursByMatter),
                        backgroundColor: '#6366f1',
                    }]
                },
                options: { indexAxis: 'y', scales: { x: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor } } }, plugins: { legend: { display: false } } }
            });
        }

        return () => {
            caseChart?.destroy();
            taskChart?.destroy();
            hoursChart?.destroy();
        };
    }, [user, t]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('reportsTitle')}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{t('reportsSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('reportsTotalMatters')} value={reportsData.openCases + reportsData.closedCases} />
                <StatCard title={t('reportsTotalTasks')} value={reportsData.pendingTasks + reportsData.completedTasks} />
                <StatCard title={t('reportsTotalHours')} value={reportsData.totalHoursLogged.toFixed(2)} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title={t('reportsCaseStatus')}>
                        <canvas ref={caseStatusChartRef}></canvas>
                    </ChartCard>
                </div>
                <div className="lg:col-span-3">
                    <ChartCard title={t('reportsTaskCompletion')}>
                        <canvas ref={taskCompletionChartRef}></canvas>
                    </ChartCard>
                </div>
            </div>
             <div className="grid grid-cols-1">
                <ChartCard title={t('reportsHoursByMatter')}>
                    <canvas ref={billableHoursChartRef}></canvas>
                </ChartCard>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
    </div>
);

const ChartCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">{title}</h2>
        <div>{children}</div>
    </div>
);

export default ReportsPage;