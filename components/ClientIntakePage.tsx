
import React, { useState, useMemo } from 'react';
import { Matter, Client, Page, Json, OpposingParty, Conflict } from '../types';
import ErrorAlert from './ErrorAlert';
import { performSmartConflictCheck } from '../services/geminiService';

interface ClientIntakePageProps {
  clients: Client[];
  matters: Matter[];
  onAddMatter: (newMatter: Omit<Matter, 'id' | 'created_at' | 'user_id' | 'status'>) => Promise<Matter>;
  onAddClient: (newClient: Omit<Client, 'id' | 'created_at' | 'user_id'>) => Promise<Client>;
  onNavigate: (page: Page) => void;
}

const ClientIntakePage: React.FC<ClientIntakePageProps> = ({ clients, matters, onAddMatter, onAddClient, onNavigate }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  
  // New Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientType, setNewClientType] = useState<'Individual' | 'Organization'>('Individual');
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Matter Form State
  const [matterName, setMatterName] = useState('');
  const [opposingParties, setOpposingParties] = useState<OpposingParty[]>([{ name: '', counsel: '' }]);
  
  // Conflict Check State
  const [conflicts, setConflicts] = useState<Conflict[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [conflictsAcknowledged, setConflictsAcknowledged] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId]);
  
  const handleAddParty = () => setOpposingParties([...opposingParties, { name: '', counsel: '' }]);
  const handlePartyChange = (index: number, field: keyof OpposingParty, value: string) => {
    const newParties = [...opposingParties];
    newParties[index][field] = value;
    setOpposingParties(newParties);
  };
  const handleRemoveParty = (index: number) => setOpposingParties(opposingParties.filter((_, i) => i !== index));

  const handleSaveNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingClient(true);
    setClientError(null);
    try {
        const newClient = await onAddClient({
            name: newClientName,
            email: newClientEmail,
            phone: newClientPhone,
            address: newClientAddress,
            type: newClientType
        });
        setSelectedClientId(newClient.id);
        setShowNewClientForm(false);
        // Reset form
        setNewClientName('');
        setNewClientEmail('');
        setNewClientPhone('');
        setNewClientAddress('');
    } catch (err) {
        setClientError(err instanceof Error ? err.message : 'Failed to save client.');
    } finally {
        setIsSavingClient(false);
    }
  }
  
  const performConflictCheck = async () => {
    if (!selectedClient || !matterName.trim()) {
        setConflictError("Please provide a client and a matter name before running a conflict check.");
        return;
    }
    setIsChecking(true);
    setConflicts(null);
    setConflictError(null);
    setConflictsAcknowledged(false);

    try {
        const opposingPartiesStr = opposingParties
            .map(p => p.name.trim())
            .filter(name => name)
            .join(', ');
        
        const foundConflicts = await performSmartConflictCheck(
            selectedClient.name,
            opposingPartiesStr,
            matterName // Use matter name as the summary
        );

        setConflicts(foundConflicts);
        if (foundConflicts.length === 0) {
            setConflictsAcknowledged(true);
        }
    } catch (err) {
        setConflictError(err instanceof Error ? err.message : 'Failed to run smart conflict check.');
        setConflicts([]); // Reset conflicts if error to hide old results
    } finally {
        setIsChecking(false);
    }
  };
  
  const handleSubmitMatter = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isMatterFormValid) return;
      
      try {
        await onAddMatter({
            client_id: selectedClientId,
            matter_name: matterName,
            opposing_parties: opposingParties.filter(p => p.name.trim() !== '') as unknown as Json,
        });
        alert("Matter saved successfully!");
        onNavigate('matters');
      } catch (err) {
        alert(`Failed to save matter: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
  };
  
  const isMatterFormValid = useMemo(() => {
    return selectedClientId && matterName.trim() && conflictsAcknowledged;
  }, [selectedClientId, matterName, conflictsAcknowledged]);


  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">New Matter Intake</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Select or create a client, then add matter details and run a conflict check.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
            {/* Step 1: Client Selection */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-2">Step 1: Select or Create Client</h2>
                {!showNewClientForm ? (
                    <div className="flex items-end gap-4">
                        <div className="flex-grow">
                            <label htmlFor="client-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Select an Existing Client</label>
                            <select id="client-select" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="w-full input-field">
                                <option value="" disabled>-- Choose a client --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="button" onClick={() => setShowNewClientForm(true)} className="px-4 py-2 text-sm border rounded-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600">
                            Create New Client
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSaveNewClient} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-4">
                        <h3 className="font-semibold">New Client Details</h3>
                        {clientError && <ErrorAlert message={clientError} />}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Client Name" value={newClientName} onChange={e => setNewClientName(e.target.value)} required />
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Client Type</label>
                                <div className="flex gap-4 mt-2">
                                    <RadioOption id="individual" label="Individual" checked={newClientType === 'Individual'} onChange={() => setNewClientType('Individual')} />
                                    <RadioOption id="organization" label="Organization" checked={newClientType === 'Organization'} onChange={() => setNewClientType('Organization')} />
                                </div>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Client Email" type="email" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} required />
                            <InputField label="Client Phone" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} />
                        </div>
                        <InputField label="Client Address" value={newClientAddress} onChange={e => setNewClientAddress(e.target.value)} />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setShowNewClientForm(false)} className="px-4 py-2 text-sm border rounded-md">Cancel</button>
                            <button type="submit" disabled={isSavingClient} className="px-4 py-2 text-sm border rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400">
                                {isSavingClient ? "Saving..." : "Save Client"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Step 2: Matter Details */}
            {selectedClientId && (
                <form onSubmit={handleSubmitMatter} className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-600">
                     <div>
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-2">Step 2: Matter Details for {selectedClient?.name}</h2>
                        <div className="mt-4">
                             <InputField label="Matter Name" value={matterName} onChange={e => setMatterName(e.target.value)} placeholder="e.g., Smith v. Jones Contract Dispute" required />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Opposing Parties</h3>
                        {opposingParties.map((party, index) => (
                            <div key={index} className="flex items-end gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                    <InputField label={`Opposing Party ${index + 1} Name`} value={party.name} onChange={e => handlePartyChange(index, 'name', e.target.value)} />
                                    <InputField label="Counsel (if known)" value={party.counsel} onChange={e => handlePartyChange(index, 'counsel', e.target.value)} />
                                </div>
                                {opposingParties.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveParty(index)} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddParty} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">+ Add another party</button>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-600">
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Step 3: Smart Conflict Check</h2>
                        <button type="button" onClick={performConflictCheck} disabled={isChecking || !selectedClientId || !matterName.trim()} className="px-5 py-2.5 bg-slate-600 text-white font-medium rounded-md shadow-sm hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
                            {isChecking ? 'Checking...' : 'Run Smart Conflict Check'}
                        </button>
                        {(!selectedClientId || !matterName.trim()) && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please select a client and enter a matter name to run a conflict check.</p>
                        )}
                        {isChecking && <p className="text-sm text-slate-500">Running smart conflict check using AI...</p>}
                        {conflictError && <ErrorAlert message={conflictError} title="Conflict Check Failed" />}
                        {conflicts && !conflictError && (
                            <div className="mt-4">
                                {conflicts.length === 0 ? (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 rounded-lg">
                                        <h3 className="font-bold text-green-800 dark:text-green-200">No Potential Conflicts Found</h3>
                                        <p className="text-sm text-green-700 dark:text-green-300">The AI assistant did not find any potential conflicts in the database.</p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg space-y-3">
                                        <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Potential Conflicts Found!</h3>
                                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-2">
                                            {conflicts.map((c, i) => (
                                                <li key={i}>
                                                    <strong>{c.conflictType} Conflict:</strong> Involving parties <strong>{Array.isArray(c.partiesInvolved) ? c.partiesInvolved.join(', ') : c.partiesInvolved}</strong>.
                                                    <p className="pl-4 mt-1 text-xs italic">AI Reasoning: "{c.reason}"</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="pt-3 border-t border-yellow-300 dark:border-yellow-700/50">
                                            <Checkbox id="ack" label="I have reviewed and acknowledge these potential conflicts." checked={conflictsAcknowledged} onChange={e => setConflictsAcknowledged(e.target.checked)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={!isMatterFormValid} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
                        Save Matter
                    </button>
                </form>
            )}
        </div>
    </div>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150 input-field"
    />
  </div>
);

const RadioOption: React.FC<{ id: string, label: string, checked: boolean, onChange: () => void }> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input id={id} name="clientType" type="radio" checked={checked} onChange={onChange} className="h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-500 focus:ring-blue-500" />
        <label htmlFor={id} className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
    </div>
);

const Checkbox: React.FC<{ id: string, label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, checked, onChange }) => (
    <div className="relative flex items-start">
        <div className="flex h-6 items-center">
            <input id={id} name={id} type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-600" />
        </div>
        <div className="ml-3 text-sm leading-6">
            <label htmlFor={id} className="font-medium text-slate-800 dark:text-slate-200">{label}</label>
        </div>
    </div>
);

export default ClientIntakePage;
