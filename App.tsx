import React, { useState, useEffect } from 'react';
// FIX: Changed to a non-type-only import for Session, which may resolve type resolution issues with older bundlers or configurations.
import { Session } from '@supabase/supabase-js';
import { AppState, Page, UserRole, Matter, Document, Template, UserProfile, Client, Json, Note, Task, TimeEntry, Notification, Profile, PaymentSettings, Invoice, InvoiceSettings } from './types';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import BillingPage from './components/BillingPage';
import DisclaimerBanner from './components/DisclaimerBanner';
import Header from './components/Header';
import PricingPage from './components/PricingPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import DraftContractPage from './components/DraftContractPage';
import ReviewContractPage from './components/ReviewContractPage';
import SavedDocumentsPage from './components/SavedDocumentsPage';
import SupportPage from './components/SupportPage';
import Footer from './components/Footer';
import LegalResearchPage from './components/LegalResearchPage';
import ClientIntakePage from './components/ClientIntakePage';
import ViewDocumentPage from './components/ViewDocumentPage';
import { ROLES_PERMISSIONS } from './permissions';
import CreateTemplatePage from './components/CreateTemplatePage';
import TemplateManagerPage from './components/TemplateManagerPage';
import FeaturesPage from './components/FeaturesPage';
import TestimonialsPage from './components/TestimonialsPage';
import DemoPage from './components/DemoPage';
import { supabase } from './services/supabaseClient';
import ClientListPage from './components/ClientListPage';
import ClientDetailPage from './components/ClientDetailPage';
import CaseListPage from './components/CaseListPage';
import CaseDetailPage from './components/CaseDetailPage';
import Sidebar from './components/Sidebar';
import TermsOfServicePage from './components/TermsOfServicePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import DisclaimerPage from './components/DisclaimerPage';
import SqlEditorPage from './components/SqlEditorPage';
import TaskListPage from './components/TaskListPage';
import AdvancedResearchPage from './components/AdvancedResearchPage';
import TeamManagementPage from './components/TeamManagementPage';
import ReportsPage from './components/ReportsPage';
import PaymentSettingsPage from './components/PaymentSettingsPage';
import InvoiceSettingsPage from './components/InvoiceSettingsPage';

const initialAppState: AppState = {
    isAuthenticated: false,
    currentPage: 'landing',
    user: null,
    viewingDocument: null,
    editingTemplate: null,
    viewingClient: null,
    viewingMatter: null,
};

const App: React.FC = () => (
    <AppContent />
);

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(initialAppState);
  const [session, setSession] = useState<Session | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedMode = localStorage.getItem('isDarkMode');
      return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      console.error("Failed to load dark mode preference", e);
      return false;
    }
  });

  useEffect(() => {
    // FIX: Corrected destructuring for onAuthStateChange to match Supabase v2, which returns { data: { subscription } }.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])
  
  // Realtime subscription for notifications
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channel = supabase
      .channel('notifications')
      .on<Notification>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` },
        (payload) => {
          console.log('New notification received!', payload.new);
          setAppState(prev => {
              if (!prev.user) return prev;
              const newNotifications = [payload.new as Notification, ...prev.user.notifications];
              return { ...prev, user: { ...prev.user, notifications: newNotifications } };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  useEffect(() => {
    if (session) {
        const fetchFullUserData = async () => {
            // FIX: `session.user` from onAuthStateChange contains all necessary user data in Supabase v2.
            await fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
        };
        fetchFullUserData();
        setAppState(prev => ({ ...prev, isAuthenticated: true, currentPage: prev.currentPage === 'landing' || prev.currentPage === 'login' ? 'dashboard' : prev.currentPage }));
    } else {
        setAppState(initialAppState);
    }
  }, [session]);


  const fetchUserData = async (userId: string, email?: string, userMetadata: any = {}) => {
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
        if (profileError) console.error("Error fetching profile, creating one...", profileError.message);
        
        // Create a profile if it doesn't exist (error code for "not found")
        if (profileError?.code === 'PGRST116') {
             const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({ 
                    id: userId, 
                    email, 
                    full_name: userMetadata.full_name,
                    role: userMetadata.account_type === 'firm' ? 'admin' : 'lawyer', 
                    subscription_status: 'trial', 
                    jurisdiction: userMetadata.jurisdiction,
                    firm_id: userMetadata.account_type === 'firm' ? userId : null // Admin's firm_id is their own ID
                })
                .select()
                .single();

            if (insertError) {
                console.error("Error creating profile:", insertError.message);
                return; // Stop execution if profile creation fails
            }
            // Use the newly created profile for the rest of the function
            profile = newProfile;
        } else {
            // A different error occurred during fetch, so we can't proceed
            return;
        }
    }
    
    // Sync role from auth metadata if it exists and differs from the profile.
    if (userMetadata.account_type && profile) {
        const expectedRole = userMetadata.account_type === 'firm' ? 'admin' : 'lawyer';
        if (profile.role !== expectedRole) {
            console.log(`Role mismatch: Auth metadata implies '${expectedRole}', but profile has '${profile.role}'. Syncing...`);
            const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update({ role: expectedRole })
                .eq('id', userId)
                .select()
                .single();
            
            if (updateError) {
                console.error("Error syncing user role:", updateError.message);
            } else if (updatedProfile) {
                profile = updatedProfile; // Use the fresh profile data for the rest of this function call
                console.log("User role successfully synced.");
            }
        }
    }
    
    // Data integrity check: Ensure firm admins have a firm_id.
    if (profile && profile.role === 'admin' && !profile.firm_id) {
        console.log(`Data integrity issue: Admin user ${profile.id} is missing a firm_id. Patching...`);
        const { data: patchedProfile, error: patchError } = await supabase
            .from('profiles')
            .update({ firm_id: profile.id }) // An admin's firm_id is their own ID.
            .eq('id', profile.id)
            .select()
            .single();

        if (patchError) {
            console.error("Error patching admin's firm_id:", patchError.message);
        } else if (patchedProfile) {
            profile = patchedProfile; // Use the patched profile data.
            console.log("Admin's firm_id successfully patched.");
        }
    }
    
    if (!profile) {
      console.error("Could not fetch or create a user profile. Aborting data load.");
      return;
    }
    
    // Fetch all data related to the firm if user is part of one, otherwise just their own data.
    const firmId = profile.firm_id;
    const { data: teamMembers } = firmId ? await supabase.from('profiles').select('*').eq('firm_id', firmId).neq('id', userId) : { data: [] };
    
    const userIds = firmId ? [userId, ...(teamMembers || []).map(m => m.id)] : [userId];

    const { data: documents } = await supabase.from('documents').select('*').in('user_id', userIds).order('created_at', { ascending: false });
    const { data: templates } = await supabase.from('templates').select('*').in('user_id', userIds).order('created_at', { ascending: false });
    const { data: clients } = await supabase.from('clients').select('*').in('user_id', userIds).order('name', { ascending: true });
    const { data: matters } = await supabase.from('matters').select('*').in('user_id', userIds).order('created_at', { ascending: false });
    const { data: tasks } = await supabase.from('tasks').select('*').in('user_id', userIds).order('due_date', { ascending: true });
    const { data: notes } = await supabase.from('notes').select('*').in('user_id', userIds).order('created_at', { ascending: false });
    const { data: timeEntries } = await supabase.from('time_entries').select('*').in('user_id', userIds).order('date', { ascending: false });
    const { data: evidence } = await supabase.from('evidence').select('*').in('user_id', userIds).order('created_at', { ascending: false });
    const { data: notifications } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });

    // Mock payment and invoice settings as there are no DB tables for them
    const paymentSettings: PaymentSettings = appState.user?.payment_settings || {
        stripe: { connected: false, publishableKey: null },
        paypal: { connected: false, clientId: null },
        bankTransfer: { enabled: false, instructions: null },
    };
     const invoiceSettings: InvoiceSettings = appState.user?.invoice_settings || {
        template: 'modern',
        accentColor: '#3b82f6',
        logoUrl: null,
        fromAddress: "123 Law Lane\nLegal City, LS 54321\nUnited States",
        notes: "Thank you for your business. Please remit payment within 30 days."
    };

    const userProfile: UserProfile = {
        ...userMetadata,
        ...profile,
        email: email || profile.email || '',
        subscription_status: profile.subscription_status as any || 'trial',
        role: profile.role as any || 'lawyer',
        documents: documents || [],
        templates: templates || [],
        clients: clients || [],
        matters: matters || [],
        tasks: tasks || [],
        notes: notes || [],
        timeEntries: timeEntries || [],
        evidence: evidence || [],
        notifications: notifications || [],
        teamMembers: (teamMembers as Profile[]) || [],
        usage: { drafted: (documents || []).filter(d => d.status === 'drafted').length, reviewed: (documents || []).filter(d => d.status === 'reviewed').length },
        researchLogs: [], // Mocked for now
        payment_settings: paymentSettings,
        invoice_settings: invoiceSettings,
        invoices: appState.user?.invoices || [], // Mocked for now
    };

    setAppState(prevState => ({ ...prevState, user: userProfile }));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    } catch (e) {
        console.error("Failed to save dark mode preference", e);
    }
  }, [isDarkMode]);

  const handleNavigate = (page: Page) => {
    setAppState(prevState => ({ ...prevState, currentPage: page, editingTemplate: null, viewingClient: null, viewingMatter: null }));
    setSidebarOpen(false); // Close sidebar on navigation
  };

  const handleLogout = async () => {
    try {
      // FIX: The `signOut` method is correct for modern Supabase.
      await supabase.auth.signOut();
      setAppState(initialAppState);
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };
  
   const handleViewClient = (client: Client) => {
    setAppState(prevState => ({ ...prevState, currentPage: 'viewClient', viewingClient: client }));
  };

  const handleViewCase = (matter: Matter) => {
    setAppState(prevState => ({ ...prevState, currentPage: 'viewCase', viewingMatter: matter }));
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'user_id'>): Promise<Client> => {
    if (!session) throw new Error("User not logged in");
    const newClientPayload = { ...clientData, user_id: session.user.id };
    const { data, error } = await supabase.from('clients').insert(newClientPayload).select().single();
    if (error || !data) { throw new Error(error?.message || "Failed to save client"); }
    await fetchUserData(session.user.id, session.user.email);
    return data as Client;
  };
  
  const updateClient = async (updatedClient: Client): Promise<void> => {
    const { error } = await supabase.from('clients').update(updatedClient).eq('id', updatedClient.id);
    if (error) { throw new Error("Failed to save changes to the client."); }
    await fetchUserData(session!.user.id, session!.user.email);
  };
  
  const deleteClient = async (clientId: string): Promise<void> => {
    const mattersForClient = appState.user?.matters.filter(m => m.client_id === clientId) || [];
    if (mattersForClient.length > 0) {
        throw new Error("Cannot delete a client that has associated matters. Please delete the matters first.");
    }
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) { throw new Error("Failed to delete the client."); }
    await fetchUserData(session!.user.id, session!.user.email);
    handleNavigate('clients');
  };

  const addMatter = async (matterData: Omit<Matter, 'id' | 'created_at' | 'user_id' | 'status'>): Promise<Matter> => {
    if (!session) throw new Error("User not logged in");
    const newMatterPayload = { ...matterData, status: 'open' as 'open' | 'closed', user_id: session.user.id };
    const { data, error } = await supabase.from('matters').insert(newMatterPayload).select().single();
    if (error || !data) { throw new Error(error?.message || "Failed to save matter"); }
    await fetchUserData(session.user.id, session.user.email);
    return data as Matter;
  };
  
  const updateMatter = async (updatedMatter: Matter): Promise<void> => {
    const { error } = await supabase.from('matters').update(updatedMatter).eq('id', updatedMatter.id);
    if (error) { throw new Error("Failed to save changes to the matter."); }
    await fetchUserData(session!.user.id, session!.user.email);
  };
  
  const deleteMatter = async (matterId: string): Promise<void> => {
    // Manually cascade deletes for safety, assuming no DB cascade is set up
    await supabase.from('time_entries').delete().eq('matter_id', matterId);
    await supabase.from('tasks').delete().eq('matter_id', matterId);
    await supabase.from('notes').delete().eq('matter_id', matterId);
    await supabase.from('documents').delete().eq('matter_id', matterId);
    
    const { error } = await supabase.from('matters').delete().eq('id', matterId);
    if (error) { throw new Error("Failed to delete the matter."); }
    await fetchUserData(session!.user.id, session!.user.email);
    handleNavigate('cases');
  };

  const addNote = async (noteData: Omit<Note, 'id' | 'created_at' | 'user_id'>): Promise<Note> => {
    if (!session) throw new Error("User not logged in");
    const newNotePayload = { ...noteData, user_id: session.user.id };
    const { data, error } = await supabase.from('notes').insert(newNotePayload).select().single();
    if (error || !data) { throw new Error(error?.message || "Failed to save note"); }
    await fetchUserData(session.user.id, session.user.email);
    return data as Note;
  };
  
  const updateNote = async (updatedNote: Note): Promise<void> => {
    const { error } = await supabase.from('notes').update(updatedNote).eq('id', updatedNote.id);
    if (error) { throw new Error("Failed to save changes to the note."); }
    await fetchUserData(session!.user.id, session!.user.email);
  };
  
  const deleteNote = async (noteId: string): Promise<void> => {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (error) { throw new Error("Failed to delete the note."); }
    await fetchUserData(session!.user.id, session!.user.email);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'user_id'>): Promise<Task> => {
    if (!session) throw new Error("User not logged in");
    const newTaskPayload = { ...taskData, user_id: session.user.id };
    const { data, error } = await supabase.from('tasks').insert(newTaskPayload).select().single();
    if (error || !data) { throw new Error(error?.message || "Failed to save task"); }
    await fetchUserData(session.user.id, session.user.email);
    return data as Task;
  };

  const updateTask = async (updatedTask: Omit<Task, 'created_at' | 'user_id'>): Promise<void> => {
      const { error } = await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id);
      if (error) { throw new Error("Failed to save changes to the task."); }
      await fetchUserData(session!.user.id, session!.user.email);
  };

  const deleteTask = async (taskId: string): Promise<void> => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) { throw new Error('Failed to delete the task. Please try again.'); }
      await fetchUserData(session!.user.id, session!.user.email);
  };
  
  const addTimeEntry = async (entryData: Omit<TimeEntry, 'id' | 'created_at' | 'user_id' | 'is_billed'>): Promise<void> => {
      if (!session) throw new Error("User not logged in");
      const { error } = await supabase.from('time_entries').insert({ ...entryData, user_id: session.user.id });
      if (error) { throw new Error(error.message || "Failed to save time entry."); }
      await fetchUserData(session.user.id, session.user.email);
  };

  const updateTimeEntry = async (updatedEntry: Omit<TimeEntry, 'created_at' | 'user_id'>): Promise<void> => {
      if (!session) throw new Error("User not logged in");
      const { error } = await supabase.from('time_entries').update(updatedEntry).eq('id', updatedEntry.id);
      if (error) { throw new Error("Failed to update time entry."); }
      await fetchUserData(session.user.id, session.user.email);
  };
  
  const deleteTimeEntry = async (entryId: string): Promise<void> => {
    const { error } = await supabase.from('time_entries').delete().eq('id', entryId);
    if (error) { throw new Error("Failed to delete the time entry."); }
    await fetchUserData(session!.user.id, session!.user.email);
  };

  const addInvoice = async (invoice: Invoice): Promise<void> => {
    // Mock implementation, saves to local state
    if (!appState.user) return;
    setAppState(prev => ({
        ...prev,
        user: { ...prev.user!, invoices: [...prev.user!.invoices, invoice] }
    }));
  };
  
  const updateInvoice = async (updatedInvoice: Invoice): Promise<void> => {
    // Mock implementation, updates local state
    if (!appState.user) return;
    setAppState(prev => ({
        ...prev,
        user: { ...prev.user!, invoices: prev.user!.invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv) }
    }));
  };

  const handleCheckout = async (planId: string) => {
    // This function would call a Supabase Edge Function to create a Stripe Checkout session.
    // For this demo, we'll simulate the process.
    console.log(`Initiating checkout for plan: ${planId}`);
    try {
        // const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        //     body: { planId },
        // });
        // if (error) throw error;
        // window.location.href = data.url; // Redirect to Stripe
        alert(`Redirecting to Stripe to purchase ${planId} plan. (This is a demo)`);
    } catch (error) {
        console.error("Checkout failed:", error);
        alert("Could not initiate checkout. Please try again.");
    }
  };

  const addDocument = async (docData: Omit<Document, 'id' | 'created_at' | 'health_score' | 'signature_status' | 'signatories' | 'user_id' | 'version_history'>): Promise<Document> => {
    if (!session) throw new Error("User not logged in");
    const newDocumentPayload = { 
        ...docData, 
        health_score: 80, 
        signature_status: 'none', 
        signatories: [], 
        user_id: session.user.id,
        version_history: [] as unknown as Json,
    };
    const { data, error } = await supabase.from('documents').insert(newDocumentPayload).select().single();
    if (error || !data) { throw new Error(error?.message || "Failed to save document"); }
    await fetchUserData(session.user.id, session.user.email);
    return data as Document;
  };
  
  const uploadDocument = async (file: File, matterId: string, description: string): Promise<void> => {
      if (!session) throw new Error("User not logged in");
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session.user.id}/${matterId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('case_documents').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('case_documents').getPublicUrl(filePath);

      const docData = {
          name: file.name,
          type: description || 'Uploaded File',
          status: 'uploaded',
          source: 'uploaded' as 'uploaded',
          content: `Uploaded file: ${file.name}`,
          matter_id: matterId,
          user_id: session.user.id,
          file_url: publicUrl,
          health_score: null,
          signature_status: 'none',
          signatories: [],
          version_history: [] as unknown as Json
      };
      
      const { error: insertError } = await supabase.from('documents').insert(docData);
      if (insertError) throw insertError;
      
      await fetchUserData(session.user.id, session.user.email);
  };
  
  const updateDocument = async (updatedDoc: Document) => {
    const { error } = await supabase.from('documents').update(updatedDoc).eq('id', updatedDoc.id);
    if (error) { throw new Error("Failed to save changes to the document."); }
    await fetchUserData(session!.user.id, session!.user.email);
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', documentId);
    if (error) { throw new Error('Failed to delete the document. Please try again.'); }
    await fetchUserData(session!.user.id, session!.user.email);
  };

  const addResearchLog = (params: any) => { /* ... not implemented with Supabase yet ... */ };
  
  const handleViewDocument = (doc: Document) => {
    setAppState(prevState => ({ ...prevState, currentPage: 'viewDocument', viewingDocument: doc }));
  };
  
  const handleSaveTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'placeholders' | 'user_id'>, existingId?: string) => {
      if (!session) throw new Error("User not logged in");
      const placeholders = (template.content?.match(/\{\{\s*(\w+)\s*\}\}/g) || []).map(p => p.replace(/[{}]/g, '').trim());
      
      if (existingId) {
          const { error } = await supabase.from('templates').update({ ...template, placeholders }).eq('id', existingId);
          if (error) { throw new Error('Failed to update the template. Please try again.'); }
      } else {
          const { error } = await supabase.from('templates').insert({ ...template, placeholders, user_id: session.user.id });
          if (error) { throw new Error('Failed to create the template. Please try again.'); }
      }
      await fetchUserData(session.user.id, session.user.email);
      handleNavigate('templates');
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', templateId);
    if (error) { throw new Error('Failed to delete the template. Please try again.'); }
    await fetchUserData(session!.user.id, session!.user.email);
  };

  const handleEditTemplate = (template: Template) => {
    setAppState(prevState => ({...prevState, currentPage: 'createTemplate', editingTemplate: template}));
  };
  
   const inviteUser = async (email: string, role: UserRole) => {
        if (!appState.user?.firm_id) throw new Error("Only firm admins can invite users.");
        
        // Invoke the 'invite-user' Edge Function to handle user invitations securely.
        // This replaces the direct, client-side call to a non-existent admin function.
        const { error } = await supabase.functions.invoke('invite-user', {
            body: { 
                email: email, 
                role: role,
                firm_id: appState.user.firm_id
            },
        });

        if (error) {
            throw error;
        }
  };
  
  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    if (error) { console.error("Failed to mark notification as read", error); return; }
    
    setAppState(prev => {
        if (!prev.user) return prev;
        const updatedNotifications = prev.user.notifications.map(n => n.id === notificationId ? { ...n, is_read: true } : n);
        return { ...prev, user: { ...prev.user, notifications: updatedNotifications } };
    });
  };

  const handleCreateTemplateFromDoc = (doc: Document) => {
    const newTemplate: Template = {
      id: '', created_at: '', user_id: '',
      name: `${doc.name} Template`,
      description: `Template created from document: ${doc.name}`,
      content: doc.content, placeholders: [],
    }
    setAppState(prevState => ({ ...prevState, currentPage: 'createTemplate', editingTemplate: newTemplate as any }));
  };

    const handleUpdatePaymentSettings = async (settings: PaymentSettings) => {
        if (!appState.user) return;
        // In a real app, this would save to the database. Here, we just update local state.
        setAppState(prevState => ({
            ...prevState,
            user: { ...prevState.user!, payment_settings: settings },
        }));
    };
    
    const handleUpdateInvoiceSettings = async (settings: InvoiceSettings) => {
        if (!appState.user) return;
        // In a real app, this would save to the database. Here, we just update local state.
        setAppState(prevState => ({
            ...prevState,
            user: { ...prevState.user!, invoice_settings: settings },
        }));
    };

  const isUsageLimitReached = false;

  const renderAuthenticatedPage = () => {
    if (!appState.user) return <div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin"></div></div>;
    const userRole = appState.user.role;
    const userPermissions = (userRole && userRole in ROLES_PERMISSIONS) ? ROLES_PERMISSIONS[userRole as UserRole] : ROLES_PERMISSIONS['lawyer'];
    switch (appState.currentPage) {
      case 'dashboard': return <Dashboard user={appState.user} onNavigate={handleNavigate} onViewDocument={handleViewDocument} onViewCase={handleViewCase} />;
      case 'cases': if (!userPermissions.canManageClients) handleNavigate('dashboard'); return <CaseListPage matters={appState.user.matters} clients={appState.user.clients} onViewCase={handleViewCase} onNavigate={handleNavigate} onDeleteMatter={deleteMatter} />;
      case 'viewCase': if (!appState.viewingMatter) { handleNavigate('cases'); return null; } return <CaseDetailPage matter={appState.viewingMatter} user={appState.user} onNavigate={handleNavigate} onViewDocument={handleViewDocument} addNote={addNote} onAddTask={addTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} onLogTime={addTimeEntry} onUploadDocument={uploadDocument} onUpdateTimeEntry={updateTimeEntry} onUpdateMatter={updateMatter} onUpdateNote={updateNote} onDeleteNote={deleteNote} onDeleteTimeEntry={deleteTimeEntry} onAddInvoice={addInvoice} onUpdateInvoice={updateInvoice} />;
      case 'clients': if (!userPermissions.canManageClients) handleNavigate('dashboard'); return <ClientListPage clients={appState.user.clients} matters={appState.user.matters} onViewClient={handleViewClient} onAddClient={() => handleNavigate('intake')} onDeleteClient={deleteClient} />;
      case 'viewClient': if (!appState.viewingClient) { handleNavigate('clients'); return null; } return <ClientDetailPage client={appState.viewingClient} matters={appState.user.matters.filter(m => m.client_id === appState.viewingClient!.id)} onNavigate={handleNavigate} onUpdateClient={updateClient} />;
      case 'intake': if (!userPermissions.canPerformIntake) handleNavigate('dashboard'); return <ClientIntakePage clients={appState.user.clients} matters={appState.user.matters} onAddMatter={addMatter} onAddClient={addClient} onNavigate={handleNavigate} />;
      case 'tasks': if (!userPermissions.canManageClients) handleNavigate('dashboard'); return <TaskListPage tasks={appState.user.tasks} matters={appState.user.matters} onAddTask={addTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} />;
      case 'draft': return <DraftContractPage matters={appState.user.matters} isUsageLimitReached={isUsageLimitReached} onNavigate={handleNavigate} addDocument={addDocument} updateDocument={updateDocument} onCreateTemplate={handleCreateTemplateFromDoc} />;
      case 'review': return <ReviewContractPage isUsageLimitReached={isUsageLimitReached} onNavigate={handleNavigate} addDocument={addDocument} updateDocument={updateDocument} />;
      case 'research': return <LegalResearchPage researchLogs={appState.user.researchLogs} addResearchLog={addResearchLog} />;
      case 'advancedResearch': if (!userPermissions.canResearch) handleNavigate('dashboard'); return <AdvancedResearchPage />;
      case 'documents': return <SavedDocumentsPage documents={appState.user.documents} onViewDocument={handleViewDocument} onDeleteDocument={handleDeleteDocument} />;
      case 'viewDocument': if (!appState.viewingDocument) { handleNavigate('documents'); return null; } return <ViewDocumentPage document={appState.viewingDocument} updateDocument={updateDocument} onNavigate={handleNavigate} onCreateTemplate={handleCreateTemplateFromDoc} />;
      case 'templates': return <TemplateManagerPage templates={appState.user.templates} onEdit={handleEditTemplate} onDelete={handleDeleteTemplate} onNavigate={handleNavigate} />;
      case 'createTemplate': return <CreateTemplatePage onSave={handleSaveTemplate} existingTemplate={appState.editingTemplate} />;
      case 'billing': if (!userPermissions.canAccessBilling) handleNavigate('dashboard'); return <BillingPage onChoosePlan={handleCheckout} user={appState.user} />;
      case 'support': return <SupportPage />;
      case 'team': if (appState.user.role !== 'admin') handleNavigate('dashboard'); return <TeamManagementPage user={appState.user} onInviteUser={inviteUser} />;
      case 'reports': if (appState.user.role !== 'admin') handleNavigate('dashboard'); return <ReportsPage user={appState.user} />;
      case 'paymentSettings': if (!userPermissions.canAccessBilling) handleNavigate('dashboard'); return <PaymentSettingsPage user={appState.user} onUpdateSettings={handleUpdatePaymentSettings} />;
      case 'invoiceSettings': if (!userPermissions.canAccessBilling) handleNavigate('dashboard'); return <InvoiceSettingsPage user={appState.user} onUpdateSettings={handleUpdateInvoiceSettings} />;
      case 'admin': if (!userPermissions.canAccessAdmin) handleNavigate('dashboard'); return <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg"><h1 className="text-3xl font-bold">Admin Panel</h1></div>;
      case 'sqlEditor': if (!userPermissions.canAccessAdmin) handleNavigate('dashboard'); return <SqlEditorPage />;
      default: return <Dashboard user={appState.user} onNavigate={handleNavigate} onViewDocument={handleViewDocument} onViewCase={handleViewCase} />;
    }
  }

  const renderPublicPage = () => {
    switch (appState.currentPage) {
        case 'landing': return <LandingPage onNavigate={handleNavigate} />;
        case 'pricing': return <PricingPage onNavigate={handleNavigate} />;
        case 'features': return <FeaturesPage onNavigate={handleNavigate} />;
        case 'testimonials': return <TestimonialsPage onNavigate={handleNavigate} />;
        case 'demo': return <DemoPage onNavigate={handleNavigate} />;
        case 'login': return <LoginPage onNavigate={handleNavigate} />;
        case 'signup': return <SignupPage onNavigate={handleNavigate} />;
        case 'forgotPassword': return <ForgotPasswordPage onNavigate={handleNavigate} />;
        case 'terms': return <TermsOfServicePage onNavigate={handleNavigate} />;
        case 'privacy': return <PrivacyPolicyPage onNavigate={handleNavigate} />;
        case 'disclaimer': return <DisclaimerPage onNavigate={handleNavigate} />;
        default: return <LandingPage onNavigate={handleNavigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-300">
      {appState.isAuthenticated && appState.user ? (
        <div className="flex h-screen">
            <Sidebar 
                user={appState.user}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                currentPage={appState.currentPage}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    isDarkMode={isDarkMode}
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                    setSidebarOpen={setSidebarOpen}
                    notifications={appState.user.notifications}
                    onMarkNotificationRead={markNotificationAsRead}
                    onNavigate={handleNavigate}
                />
                <main className="flex-grow overflow-y-auto">
                  <div className="container mx-auto p-4 md:p-8">
                    {renderAuthenticatedPage()}
                  </div>
                </main>
            </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">{renderPublicPage()}</div>
          <Footer onNavigate={handleNavigate} isAuthenticated={appState.isAuthenticated} />
        </div>
      )}
      <DisclaimerBanner onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
