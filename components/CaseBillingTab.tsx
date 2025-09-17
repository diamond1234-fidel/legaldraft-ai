import React, { useState, useMemo } from 'react';
import { Matter, TimeEntry, UserProfile, Invoice, Client } from '../types';
import ErrorAlert from './ErrorAlert';
import BillingIcon from './icons/BillingIcon';
import TimeLogModal from './TimeLogModal';
import InvoicePreview from './InvoicePreview';

interface CaseBillingTabProps {
    matter: Matter;
    timeEntries: TimeEntry[];
    invoices: Invoice[];
    user: UserProfile;
    onUpdateTimeEntry: (entry: Omit<TimeEntry, 'created_at' | 'user_id'>) => Promise<void>;
    onDeleteTimeEntry: (entryId: string) => Promise<void>;
    onAddInvoice: (invoice: Invoice) => Promise<void>;
    onUpdateInvoice: (invoice: Invoice) => Promise<void>;
}

const CaseBillingTab: React.FC<CaseBillingTabProps> = ({ matter, timeEntries, invoices, user, onUpdateTimeEntry, onDeleteTimeEntry, onAddInvoice, onUpdateInvoice }) => {
    const [selectedEntryIds, setSelectedEntryIds] = useState<Set<string>>(new Set());
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [timeEntryToEdit, setTimeEntryToEdit] = useState<TimeEntry | null>(null);

    const client = user.clients.find(c => c.id === matter.client_id)!;
    const unbilledEntries = useMemo(() => timeEntries.filter(e => !e.is_billed), [timeEntries]);
    const hourlyRate = user.hourly_rate || 150; // Default rate

    const handleToggleEntry = (id: string) => {
        setSelectedEntryIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleCreateInvoice = async () => {
        const itemsToInvoice = unbilledEntries.filter(e => selectedEntryIds.has(e.id));
        if (itemsToInvoice.length === 0) {
            setError("Please select at least one time entry to create an invoice.");
            return;
        }
        setError(null);
        const totalAmount = itemsToInvoice.reduce((acc, item) => acc + (item.hours * hourlyRate), 0);
        const invoiceId = `INV-${Date.now()}`;
        const newInvoice: Invoice = {
            id: invoiceId,
            matter_id: matter.id,
            client_id: matter.client_id,
            amount: totalAmount,
            status: 'draft',
            issuedDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
            lineItems: itemsToInvoice,
            url: `${window.location.origin}/invoice/${invoiceId}`
        };

        try {
            await onAddInvoice(newInvoice);
            // Mark entries as billed
            await Promise.all(
                itemsToInvoice.map(item => onUpdateTimeEntry({ ...item, is_billed: true }))
            );
            setSelectedEntryIds(new Set());
            setViewingInvoice(newInvoice);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create invoice and update time entries.");
        }
    };

    const handleUpdateStatus = async (invoice: Invoice, status: Invoice['status']) => {
        const updatedInvoice = { ...invoice, status };
        try {
            await onUpdateInvoice(updatedInvoice);
            setViewingInvoice(updatedInvoice); // Update the view with the new status
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update invoice status.");
        }
    };
    
    const handleEditEntry = (entry: TimeEntry) => {
        setTimeEntryToEdit(entry);
        setIsTimeModalOpen(true);
    };
    
    const handleDeleteEntry = async (entryId: string) => {
        if(window.confirm("Are you sure you want to delete this time entry?")) {
            try {
                await onDeleteTimeEntry(entryId);
            } catch(e) {
                setError(e instanceof Error ? e.message : "Failed to delete entry.");
            }
        }
    };
    
    const InvoiceStatusBadge: React.FC<{status: Invoice['status']}> = ({ status }) => {
        const config = {
            draft: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
            sent: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
            paid: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
            overdue: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
            void: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${config[status]}`}>{status}</span>;
    };

    if (viewingInvoice) {
        return (
            <div>
                <button onClick={() => setViewingInvoice(null)} className="mb-4 text-sm font-medium text-blue-600 hover:underline">&larr; Back to Billing Overview</button>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Invoice #{viewingInvoice.id.split('-')[1]}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-500">Status:</span>
                            <InvoiceStatusBadge status={viewingInvoice.status} />
                        </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                        {viewingInvoice.status === 'draft' && <button onClick={() => handleUpdateStatus(viewingInvoice, 'sent')} className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700">Mark as Sent</button>}
                        {viewingInvoice.status === 'sent' && <button onClick={() => handleUpdateStatus(viewingInvoice, 'paid')} className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700">Mark as Paid</button>}
                        {(viewingInvoice.status === 'draft' || viewingInvoice.status === 'sent') && <button onClick={() => handleUpdateStatus(viewingInvoice, 'void')} className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700">Void</button>}
                    </div>
                </div>
                 <div className="mt-4">
                    <InvoicePreview invoice={viewingInvoice} settings={user.invoice_settings} client={client} user={user} />
                </div>
            </div>
        );
    }
    
    const totalSelectedHours = unbilledEntries.filter(e => selectedEntryIds.has(e.id)).reduce((acc, e) => acc + e.hours, 0);

    return (
        <div className="space-y-6">
            {error && <ErrorAlert message={error} />}
            
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Unbilled Time</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{selectedEntryIds.size} Entries Selected</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Total Hours: {totalSelectedHours.toFixed(2)} | Estimated Amount: ${(totalSelectedHours * hourlyRate).toFixed(2)}
                        </p>
                    </div>
                    <button onClick={handleCreateInvoice} disabled={selectedEntryIds.size === 0} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed self-end sm:self-center">
                        Create Invoice
                    </button>
                </div>
                <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        {unbilledEntries.length > 0 && (
                            <thead className="bg-slate-100 dark:bg-slate-700/50 text-left text-sm text-slate-600 dark:text-slate-300">
                                <tr>
                                    <th className="p-2 w-8"><input type="checkbox" onChange={e => setSelectedEntryIds(e.target.checked ? new Set(unbilledEntries.map(entry => entry.id)) : new Set())} /></th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Description</th>
                                    <th className="p-2 text-right">Hours</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {unbilledEntries.length > 0 ? unbilledEntries.map(entry => (
                                <tr key={entry.id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <td className="p-2"><input type="checkbox" checked={selectedEntryIds.has(entry.id)} onChange={() => handleToggleEntry(entry.id)} /></td>
                                    <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                                    <td className="p-2 text-slate-800 dark:text-slate-100">{entry.description || 'General work'}</td>
                                    <td className="p-2 text-right font-medium">{entry.hours.toFixed(2)}</td>
                                    <td className="p-2 text-right">
                                        <button onClick={() => handleEditEntry(entry)} className="font-medium text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => handleDeleteEntry(entry.id)} className="font-medium text-red-600 hover:underline text-xs ml-2">Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        <p>No unbilled time entries for this matter.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Invoice History</h3>
                 <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        {invoices.length > 0 && (
                           <thead className="bg-slate-100 dark:bg-slate-700/50 text-left text-sm text-slate-600 dark:text-slate-300">
                                <tr>
                                    <th className="p-2">Invoice #</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {invoices.length > 0 ? invoices.map(invoice => (
                                <tr key={invoice.id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <td className="p-2 font-mono text-xs">{invoice.id}</td>
                                    <td className="p-2">{new Date(invoice.issuedDate).toLocaleDateString()}</td>
                                    <td className="p-2 font-medium">${invoice.amount.toFixed(2)}</td>
                                    <td className="p-2"><InvoiceStatusBadge status={invoice.status} /></td>
                                    <td className="p-2 text-right">
                                        <button onClick={() => setViewingInvoice(invoice)} className="font-medium text-blue-600 hover:underline text-xs">View</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        <BillingIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                                        No invoices created for this matter yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>

             <TimeLogModal 
                isOpen={isTimeModalOpen}
                onClose={() => { setIsTimeModalOpen(false); setTimeEntryToEdit(null); }}
                onSave={onUpdateTimeEntry}
                matter={matter}
                entryToEdit={timeEntryToEdit}
            />
        </div>
    );
};

export default CaseBillingTab;