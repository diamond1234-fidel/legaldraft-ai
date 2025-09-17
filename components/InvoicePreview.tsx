import React from 'react';
import { Invoice, InvoiceSettings, Client, UserProfile } from '../types';

interface InvoicePreviewProps {
    invoice: Invoice;
    settings: InvoiceSettings;
    client: Client;
    user: UserProfile;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, settings, client, user }) => {
    const hourlyRate = user.hourly_rate || 150;

    const templateStyles = {
        modern: {
            header: `p-8 text-white`,
            headerText: 'text-3xl font-bold',
            tableHeader: `p-2 font-semibold text-white/90 text-sm`,
            tableRow: `border-b border-slate-100 dark:border-slate-700`,
            tableCell: `p-3`,
        },
        classic: {
            header: `p-8 border-b-4`,
            headerText: 'text-3xl font-bold tracking-tight',
            tableHeader: `p-2 font-bold uppercase text-xs tracking-wider border-b-2`,
            tableRow: `border-b border-slate-200 dark:border-slate-700`,
            tableCell: `p-3`,
        },
        simple: {
            header: `p-8`,
            headerText: 'text-2xl font-semibold',
            tableHeader: `p-2 font-semibold text-sm border-b-2 border-slate-300 dark:border-slate-600`,
            tableRow: `border-b border-slate-200 dark:border-slate-700`,
            tableCell: `p-3`,
        }
    };

    const styles = templateStyles[settings.template];
    const accentColorStyle = {
        modern: { backgroundColor: settings.accentColor },
        classic: { borderColor: settings.accentColor, color: settings.accentColor },
        simple: { color: settings.accentColor }
    };
     const tableHeaderStyle = {
        modern: { backgroundColor: settings.accentColor },
        classic: { borderColor: settings.accentColor },
        simple: {}
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 font-sans text-slate-800 dark:text-slate-200">
            {/* Header */}
            <header className={styles.header} style={accentColorStyle[settings.template]}>
                <div className="flex justify-between items-start">
                    <div>
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt="Company Logo" className="h-16 w-auto mb-4" />
                        ) : (
                            <h1 className={styles.headerText} style={settings.template === 'classic' ? {} : accentColorStyle['simple']}>
                                {user.firm_name || user.full_name}
                            </h1>
                        )}
                        <div className="text-sm whitespace-pre-wrap">{settings.fromAddress}</div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold" style={accentColorStyle['simple']}>INVOICE</h2>
                        <p className="text-sm"># {invoice.id}</p>
                    </div>
                </div>
            </header>

            {/* Details Section */}
            <section className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="text-sm text-slate-500 dark:text-slate-400 font-semibold">BILLED TO</h4>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm whitespace-pre-wrap">{client.address}</p>
                </div>
                <div>
                    <h4 className="text-sm text-slate-500 dark:text-slate-400 font-semibold">ISSUE DATE</h4>
                    <p className="font-medium">{new Date(invoice.issuedDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <h4 className="text-sm text-slate-500 dark:text-slate-400 font-semibold">DUE DATE</h4>
                    <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                 <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${settings.accentColor}20` }}>
                    <h4 className="text-sm font-semibold" style={{ color: settings.accentColor }}>AMOUNT DUE</h4>
                    <p className="text-2xl font-bold" style={{ color: settings.accentColor }}>${invoice.amount.toFixed(2)}</p>
                </div>
            </section>

            {/* Line Items Table */}
            <section className="px-8 pb-8">
                <table className="w-full">
                    <thead style={tableHeaderStyle[settings.template]}>
                        <tr>
                            <th className={`${styles.tableHeader} text-left`}>Description</th>
                            <th className={`${styles.tableHeader} text-right`}>Hours</th>
                            <th className={`${styles.tableHeader} text-right`}>Rate</th>
                            <th className={`${styles.tableHeader} text-right`}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.lineItems.map(item => (
                            <tr key={item.id} className={styles.tableRow}>
                                <td className={`${styles.tableCell} font-medium`}>{item.description || "General work"}</td>
                                <td className={`${styles.tableCell} text-right`}>{item.hours.toFixed(2)}</td>
                                <td className={`${styles.tableCell} text-right`}>${hourlyRate.toFixed(2)}</td>
                                <td className={`${styles.tableCell} text-right font-medium`}>${(item.hours * hourlyRate).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            {/* Footer */}
            <footer className="px-8 pb-8 grid grid-cols-2 gap-8 text-sm">
                <div className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
                    <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Notes</h4>
                    {settings.notes}
                </div>
                <div className="text-right">
                    <div className="flex justify-end items-baseline gap-4"><span className="text-slate-500 dark:text-slate-400">Subtotal:</span> <span className="font-medium">${invoice.amount.toFixed(2)}</span></div>
                    <div className="flex justify-end items-baseline gap-4 text-xl font-bold mt-2" style={accentColorStyle['simple']}>
                        <span>Total:</span> <span>${invoice.amount.toFixed(2)}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default InvoicePreview;