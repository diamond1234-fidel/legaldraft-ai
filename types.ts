import { Tables } from './types/supabase';
// FIX: Export the Json type to be used in other components.
// FIX: Export the Tables type to resolve import error in other components.
export type { Json, Tables } from './types/supabase';

export type Page =
  | 'landing'
  | 'pricing'
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'dashboard'
  | 'intake'
  | 'draft'
  | 'review'
  | 'research'
  | 'documents'
  | 'billing'
  | 'support'
  | 'admin'
  | 'sqlEditor'
  | 'viewDocument'
  | 'createTemplate'
  | 'templates'
  | 'features'
  | 'testimonials'
  | 'demo'
  | 'clients'
  | 'viewClient'
  | 'terms'
  | 'privacy'
  | 'disclaimer'
  | 'cases'
  | 'viewCase'
  | 'tasks'
  | 'advancedResearch'
  | 'team'
  | 'reports'
  | 'paymentSettings'
  | 'invoiceSettings';

export type SubscriptionStatus = 'trial' | 'paid' | 'basic' | 'pro' | 'enterprise' | 'cancelled';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

export type SignatoryStatus = 'pending' | 'signed' | 'declined';

export type SignatureStatus = 'none' | 'out_for_signature' | 'signed' | 'declined';

export interface Signatory {
    name: string;
    email: string;
    status: SignatoryStatus;
}

export type Document = Tables<'documents'>;
export type Template = Tables<'templates'>;
export type Profile = Tables<'profiles'>;
export type Client = Tables<'clients'>;
export type Matter = Tables<'matters'>;
export type Task = Tables<'tasks'>;
export type Note = Tables<'notes'>;
export type TimeEntry = Tables<'time_entries'>;
export type Evidence = Tables<'evidence'>;
export type Notification = Tables<'notifications'>;
export interface Invoice {
    id: string;
    matter_id: string;
    client_id: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
    dueDate: string;
    issuedDate: string;
    lineItems: TimeEntry[];
    url: string;
}
export interface PaymentSettings {
  stripe: {
    connected: boolean;
    publishableKey: string | null;
  };
  paypal: {
    connected: boolean;
    clientId: string | null;
  };
  bankTransfer: {
    enabled: boolean;
    instructions: string | null;
  };
}

export interface InvoiceSettings {
    template: 'modern' | 'classic' | 'simple';
    accentColor: string;
    logoUrl: string | null;
    fromAddress: string;
    notes: string;
}


export interface DocumentVersion {
  version: number;
  createdAt: string;
  content: string | null;
  description: string;
}

export type ResearchType = 'publicProfile' | 'reverseImage' | 'courtFilings' | 'kyc';

export interface OpposingParty {
    name: string;
    counsel: string;
}

export interface ResearchParams {
    fullName: string;
    organization: string;
    state: string;
    researchType: ResearchType;
    image?: File;
    reason: string;
    consentGiven: boolean;
}

export interface ResearchLog extends ResearchParams {
    id: string;
    timestamp: string;
}

export type UserRole = 'lawyer' | 'paralegal' | 'admin';

export interface UserProfile extends Profile {
  usage: {
    drafted: number;
    reviewed: number;
  };
  documents: Document[];
  templates: Template[];
  clients: Client[];
  matters: Matter[];
  tasks: Task[];
  notes: Note[];
  timeEntries: TimeEntry[];
  evidence: Evidence[];
  researchLogs: ResearchLog[];
  notifications: Notification[];
  teamMembers: Profile[];
  payment_settings: PaymentSettings;
  invoices: Invoice[];
  invoice_settings: InvoiceSettings;


  // Detailed signup fields based on new schema
  account_type?: 'lawyer' | 'firm';
  // FIX: The `full_name` property is defined in the base `Profile` type as `string | null`.
  // The previous optional type (`string | undefined`) was incompatible. This makes it compatible.
  full_name: string | null;
  phone_number?: string;
  
  // Individual Lawyer fields
  bar_id?: string;
  // FIX: The `jurisdiction` property is defined in the base `Profile` type as `string | null`.
  // The previous optional type `string?` (i.e., `string | undefined`) was incompatible.
  // This makes it compatible with the extended type.
  jurisdiction: string | null;
  years_experience?: number;
  practice_areas?: string[];
  hourly_rate?: number;

  // Firm fields
  firm_name?: string;
  firm_size?: string; // e.g. "1-5", "6-20"
  firm_address?: string;

  // Subscription info
  subscription_plan?: SubscriptionPlan;
}

export interface AppState {
  isAuthenticated: boolean;
  currentPage: Page;
  user: UserProfile | null;
  viewingDocument?: Document | null;
  editingTemplate?: Template | null;
  viewingClient?: Client | null;
  viewingMatter?: Matter | null;
}

export interface SelectOption {
    value: string;
    label:string;
}

export interface FormData {
    documentType: string;
    state: string;
    partyA_name: string;
    partyA_address: string;
    partyB_name: string;
    partyB_address: string;
    effectiveDate: string;
    optionalClauses: {
        arbitration: boolean;
        indemnification: boolean;
        confidentiality: boolean;
    };
    customDetails: string;
}

export interface ResearchResults {
    publicProfile?: {
        fullName: string;
        title: string;
        company: string;
        location: string;
        linkedinUrl: string;
        companyDomain: string;
    };
    imageResults?: {
        source: string;
        url: string;
        snippet: string;
        thumbnailUrl: string;
    }[];
    courtFilings?: {
        docketNumber: string;
        caseTitle: string;
        jurisdiction: string;
        link: string;
    }[];
    kyc?: {
        status: string;
        verificationId: string;
        checkedAt: string;
    };
}

export interface LegalResearchResult {
  summary: string;
  argumentStrength: {
    assessment: 'Strong' | 'Moderate' | 'Weak' | 'Uncertain';
    reasoning: string;
  };
  suggestedPrecedents: {
    caseName: string;
    citation: string;
    reasoning: string;
  }[];
  relevantCases: AnalyzedCase[];
}

export interface AnalyzedCase {
  caseName: string;
  citation: string;
  court: string;
  decisionDate: string;
  url: string;
  snippet: string;
  aiSummary: string;
}

export interface CaseLawAnalysisResult {
    opinion: any;
    citedOpinions: any[];
    aiSummary: string;
}

export interface PersonProfileResult {
    profile: any;
    aiSummary: string;
}

export interface DocketSummaryResult {
    docket: any;
    entries: any[];
    aiSummary: string;
}

export interface PredictiveAnalyticsResult {
  prediction: "PlaintiffLikely" | "DefendantLikely" | "Uncertain";
  confidence: number;
  riskLevel: "Low" | "Medium" | "High";
  recommendedStrategy: string;
  supportingCases: {
    caseName: string;
    citation: string;
    reasoning: string;
  }[];
  rawCasesFetched: number;
}


// FIX: Update Conflict interface to match the new API response from the external conflict check service.
export interface Conflict {
    conflictType: string;
    partiesInvolved: string[];
    reasoning: string;
}