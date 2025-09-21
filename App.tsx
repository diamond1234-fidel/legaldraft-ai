
import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Page, Document, Template, UserProfile, Notification, Json, ContractAnalysis } from './types';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import BillingPage from './components/BillingPage';
import Header from './components/Header';
import PricingPage from './components/PricingPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ReviewContractPage from './components/ReviewContractPage';
import SavedDocumentsPage from './components/SavedDocumentsPage';
import SupportPage from './components/SupportPage';
import Footer from './components/Footer';
import ViewDocumentPage from './components/ViewDocumentPage';
import CreateTemplatePage from './components/CreateTemplatePage';
import TemplateManagerPage from './components/TemplateManagerPage';
import FeaturesPage from './components/FeaturesPage';
import TestimonialsPage from './components/TestimonialsPage';
import DemoPage from './components/DemoPage';
import { supabase } from './services/supabaseClient';
import Sidebar from './components/Sidebar';
import TermsOfServicePage from './components/TermsOfServicePage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import AboutPage from './components/AboutPage';
import SecurityPage from './components/SecurityPage';
import DisclaimerPage from './components/DisclaimerPage';
import DisclaimerBanner from './components/DisclaimerBanner';
import RoadmapPage from './components/RoadmapPage';
import InternalRoadmapPage from './components/InternalRoadmapPage';
import { BACKEND_URL } from './constants';

declare const PaystackPop: any;

const initialAppState: AppState = {
    isAuthenticated: false,
    currentPage: 'landing',
    user: null,
    viewingDocument: null,
    editingTemplate: null,
};

// FIX: Changed to a named export to resolve the "no default export" error in index.tsx.
export const App: React.FC = () => {
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
            await fetchUserData(session.user.id, session.user.email, session.user.user_metadata);
        };
        fetchFullUserData();
        setAppState(prev => ({ ...prev, isAuthenticated: true, currentPage: prev.currentPage === 'landing' || prev.currentPage === 'login' ? 'dashboard' : prev.currentPage }));
    } else {
        setAppState(initialAppState);
    }
  }, [session]);

  const fetchUserData = async (userId: string, emailFromSession?: string, userMetadata: any = {}) => {
    // Get the authoritative user object to ensure email is present, as the session
    // object's email can be missing immediately after signup.
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const email = authUser?.email || emailFromSession; // Prioritize fresh auth user email

    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
        if (profileError) console.error("Error fetching profile, creating one...", profileError.message);
        
        if (profileError?.code === 'PGRST116') {
             const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({ 
                    id: userId, 
                    email, // Use the more reliable email
                    full_name: userMetadata.full_name,
                    role: userMetadata.account_type || 'user', 
                    subscription_status: userMetadata.subscription_status || 'trial',
                })
                .select()
                .single();

            if (insertError) {
                console.error("Error creating profile:", insertError.message);
                return;
            }
            profile = newProfile;
        } else {
            return;
        }
    }
    
    if (!profile) {
      console.error("Could not fetch or create a user profile. Aborting data load.");
      return;
    }

    // This handles the edge case where a profile was created with a null email
    // before the user confirmed their account. This will backfill the email on their next login.
    if (!profile.email && email) {
        const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ email: email })
            .eq('id', userId)
            .select()
            .single();
        
        if (updateError) {
            console.warn("Could not backfill email in profile:", updateError.message);
        } else if (updatedProfile) {
            profile = updatedProfile;
        }
    }

    const { data: documents } = await supabase.from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    const { data: templates } = await supabase.from('templates').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    const { data: notifications } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });

    const userProfile: UserProfile = {
        ...userMetadata,
        ...profile,
        email: email || profile.email || '', // Now uses a reliable email source
        subscription_status: profile.subscription_status as any || 'trial',
        role: profile.role as any || 'user',
        documents: documents || [],
        templates: templates || [],
        notifications: notifications || [],
        usage: { analyzed: (documents || []).length },
        // Add defaults for new properties
        clients: [],
        matters: [],
        notes: [],
        tasks: [],
        timeEntries: [],
        invoices: [],
        i9Records: [],
        eVerifyCases: [],
        teamMembers: [],
        payment_settings: { stripe: { connected: false, publishableKey: ''}, paypal: { connected: false, clientId: ''}, bankTransfer: { enabled: false, instructions: ''}},
        invoice_settings: { template: 'modern', accentColor: '#3b82f6', logoUrl: '', fromAddress: '', notes: 'Thank you for your business.'},
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
    setAppState(prevState => ({ ...prevState, currentPage: page, editingTemplate: null }));
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAppState(initialAppState);
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };
  
  const handleCheckout = async (planCode: string) => {
    if (!appState.user) {
        throw new Error("Please log in to choose a plan.");
    }
    
    // FIX: Directly fetch the authenticated user to ensure the most up-to-date email is used.
    // This prevents issues where the email might be missing from the local state immediately after signup.
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const userEmail = authUser?.email || appState.user.email;

    if (!userEmail) {
        throw new Error("Your email address could not be found. Please ensure your email is confirmed or try logging out and back in.");
    }

    try {
        const response = await fetch(`${BACKEND_URL}/initialize_payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_email: userEmail,
                plan_code: planCode,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to initialize payment.');
        }

        const data = await response.json();

        const handler = PaystackPop.setup({
            key: data.public_key,
            email: data.email,
            plan: data.plan_code,
            ref: data.reference,
            onClose: function() {
                // User closed the popup
            },
            callback: function(response: any) {
                // Payment successful. The backend should have a webhook to update the user's subscription status in Supabase.
                // For a better user experience, we can poll or just refetch user data after a short delay.
                alert('Payment successful! Your plan is being updated.');
                setTimeout(() => {
                    if (session) {
                        fetchUserData(session.user.id, session.user.email);
                        handleNavigate('dashboard');
                    }
                }, 3000); // Wait 3 seconds for webhook to potentially process
            }
        });
        handler.openIframe();

    } catch (error) {
        console.error("Checkout failed:", error);
        throw error;
    }
  };

  const handleCancelSubscription = async () => {
    if (!appState.user || !appState.user.subscription_code || !appState.user.email_token) {
        throw new Error("Subscription details not found. Please contact support.");
    }

    if (!window.confirm("Are you sure you want to cancel your subscription? Your access will continue until the end of the current billing period.")) {
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/cancel_subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subscription_code: appState.user.subscription_code,
                email_token: appState.user.email_token,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to cancel subscription.');
        }

        alert("Your subscription has been cancelled. It will not renew at the end of the current period.");
        if (session) {
            await fetchUserData(session.user.id, session.user.email);
        }

    } catch (error) {
        console.error("Cancellation failed:", error);
        throw error;
    }
  };

  const addDocument = async (docData: Omit<Document, 'id' | 'created_at' | 'user_id' | 'version_history'>): Promise<Document> => {
    if (!session) throw new Error("User not logged in");
    const newDocumentPayload = { 
        ...docData, 
        id: uuidv4(),
        user_id: session.user.id,
        version_history: [] as unknown as Json,
    };
    const { data, error } = await supabase.from('documents').insert(newDocumentPayload).select().single();
    if (error || !data) { throw new Error(error?.message || "Failed to save document"); }
    await fetchUserData(session.user.id, session.user.email);
    return data as Document;
  };
    
  const updateDocument = async (updatedDoc: Document) => {
    const { error } = await supabase.from('documents').update(updatedDoc).eq('id', updatedDoc.id);
    if (error) { throw new Error("Failed to save changes to the document."); }
    await fetchUserData(session!.user.id, session!.user.email);
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    if (!session) throw new Error("User not authenticated for deletion.");
    // FIX: Use .match to ensure user can only delete their own documents. This is a more robust fix.
    const { error } = await supabase.from('documents').delete().match({ id: documentId, user_id: session.user.id });
    if (error) { 
        console.error("Supabase delete error:", error);
        throw new Error('Failed to delete the document. Please try again.'); 
    }
    await fetchUserData(session.user.id, session.user.email);
  };
  
  const handleViewDocument = (doc: Document) => {
    setAppState(prevState => ({ ...prevState, currentPage: 'viewDocument', viewingDocument: doc }));
  };
  
  const handleSaveTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'placeholders' | 'user_id'>, existingId?: string) => {
      if (!session) throw new Error("User not logged in");
      const placeholders = ((template.content as string)?.match(/\{\{\s*(\w+)\s*\}\}/g) || []).map(p => p.replace(/[{}]/g, '').trim());
      
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
    
  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    if (error) { console.error("Failed to mark notification as read", error); return; }
    
    setAppState(prev => {
        if (!prev.user) return prev;
        const updatedNotifications = prev.user.notifications.map(n => n.id === notificationId ? { ...n, is_read: true } : n);
        return { ...prev, user: { ...prev.user, notifications: updatedNotifications } };
    });
  };

  const handleCreateTemplateFromDocument = (doc: Document) => {
    let contentToUse = '';
    if (doc.source === 'uploaded' && doc.content) {
        try {
            const analysis: ContractAnalysis = JSON.parse(doc.content);
            contentToUse = `# Analysis Summary for ${doc.name}\n\n${analysis.summary}\n\n## Key Risks\n${analysis.risks.map(r => `* [${r.severity}] ${r.description}`).join('\n')}`;
        } catch (e) {
            contentToUse = "Could not parse analysis content.";
        }
    } else {
        contentToUse = doc.content || '';
    }
    const newTemplateForEditing = {
        name: `Template from ${doc.name}`,
        description: `Based on document '${doc.name}'`,
        content: contentToUse,
    };
    setAppState(prevState => ({...prevState, currentPage: 'createTemplate', editingTemplate: newTemplateForEditing as Template}));
  };

  const renderPage = () => {
    const isUsageLimitReached = (appState.user?.usage?.analyzed || 0) >= 5 && (appState.user?.subscription_status === 'trial');
    
    switch (appState.currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} />;
      case 'forgotPassword':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'features':
        return <FeaturesPage onNavigate={handleNavigate} />;
      case 'testimonials':
        return <TestimonialsPage onNavigate={handleNavigate} />;
      case 'demo':
        return <DemoPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsOfServicePage onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'security':
        return <SecurityPage onNavigate={handleNavigate} />;
      case 'disclaimer':
        return <DisclaimerPage onNavigate={handleNavigate} />;
      case 'roadmap':
        return appState.isAuthenticated
          ? <InternalRoadmapPage />
          : <RoadmapPage onNavigate={handleNavigate} />;
      
      // Authenticated pages below
      case 'dashboard':
        return appState.user ? <Dashboard user={appState.user} onNavigate={handleNavigate} onViewDocument={handleViewDocument} /> : null;
      case 'review':
        return <ReviewContractPage isUsageLimitReached={isUsageLimitReached} onNavigate={handleNavigate} addDocument={addDocument} updateDocument={updateDocument} />;
      case 'documents':
        return appState.user ? <SavedDocumentsPage documents={appState.user.documents} onViewDocument={handleViewDocument} onDeleteDocument={handleDeleteDocument} /> : null;
      case 'billing':
        return appState.user ? <BillingPage onChoosePlan={handleCheckout} user={appState.user} onCancelSubscription={handleCancelSubscription} /> : null;
      case 'support':
        return <SupportPage />;
      case 'viewDocument':
        if (appState.viewingDocument) {
          return <ViewDocumentPage document={appState.viewingDocument} updateDocument={updateDocument} onNavigate={handleNavigate} onCreateTemplate={handleCreateTemplateFromDocument} />;
        }
        handleNavigate('documents');
        return null;
      case 'createTemplate':
        return <CreateTemplatePage onSave={handleSaveTemplate} existingTemplate={appState.editingTemplate} />;
      case 'templates':
        return appState.user ? <TemplateManagerPage templates={appState.user.templates} onEdit={handleEditTemplate} onDelete={handleDeleteTemplate} onNavigate={handleNavigate} /> : null;
      default:
        return appState.isAuthenticated 
            ? (appState.user ? <Dashboard user={appState.user} onNavigate={handleNavigate} onViewDocument={handleViewDocument} /> : null) 
            : <LandingPage onNavigate={handleNavigate} />;
    }
  };

  if (!appState.isAuthenticated) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        {renderPage()}
        <Footer onNavigate={handleNavigate} isAuthenticated={appState.isAuthenticated} />
      </div>
    );
  }

  if (!appState.user) {
    return <div className="flex items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">Loading user data...</div>;
  }
  
  return (
    <div className={`font-sans antialiased text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        user={appState.user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={appState.currentPage}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          setSidebarOpen={setSidebarOpen}
          notifications={appState.user.notifications}
          onMarkNotificationRead={markNotificationAsRead}
          onNavigate={handleNavigate}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <DisclaimerBanner onNavigate={handleNavigate} />
    </div>
  );
};
