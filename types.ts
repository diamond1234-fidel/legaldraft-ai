import { Tables } from './types/supabase';

export type { Json, Tables } from './types/supabase';

export type Page =
  | 'landing'
  | 'pricing'
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'dashboard'
  | 'review'
  | 'documents'
  | 'billing'
  | 'support'
  | 'viewDocument'
  | 'createTemplate'
  | 'templates'
  | 'features'
  | 'testimonials'
  | 'demo'
  | 'terms'
  | 'privacy'
  | 'about'
  | 'security'
  | 'disclaimer'
  // Added pages
  | 'matters'
  | 'clients'
  | 'intake'
  // FIX: Add 'forms' page type
  | 'forms'
  | 'formFilling'
  | 'i9Compliance'
  | 'roadmap';

export type SubscriptionStatus = 'trial' | 'paid' | 'basic' | 'pro' | 'enterprise' | 'cancelled' | 'non-renewing';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

export type Document = Tables<'documents'>;
export type Template = Tables<'templates'>;
export type Profile = Tables<'profiles'>;
export type Notification = Tables<'notifications'>;
export type Client = Tables<'clients'>;
export type Matter = Tables<'matters'>;
export type Note = Tables<'notes'>;
export type Task = Tables<'tasks'>;
export type TimeEntry = Tables<'time_entries'>;
export type I9Record = Tables<'i9_records'>;
export type EVerifyCase = Tables<'e_verify_cases'>;

export interface DocumentVersion {
  version: number;
  createdAt: string;
  // FIX: Changed from `Json` to `any` to resolve "Cannot find name 'Json'" error
  content: any;
  description: string;
}

export type UserRole = 'user' | 'admin' | 'lawyer' | 'paralegal';

export interface OpposingParty {
    name: string;
    counsel: string;
}
export interface Conflict {
    conflictType: 'Past Client' | 'Past Opposing Party' | 'Similar Name';
    partiesInvolved: string[];
    reason: string;
}
export interface Signatory {
    email: string;
    name: string;
    status: 'pending' | 'signed' | 'declined';
}
export interface InvoiceLineItem {
    id: string;
    date: string;
    description: string | null;
    hours: number;
    rate: number;
}
export type Invoice = {
    id: string;
    matter_id: string;
    client_id: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
    issuedDate: string;
    dueDate: string;
    lineItems: InvoiceLineItem[];
    url: string;
}
export interface PaymentSettings {
    stripe: { connected: boolean; publishableKey: string; };
    paypal: { connected: boolean; clientId: string; };
    bankTransfer: { enabled: boolean; instructions: string; };
}
export interface InvoiceSettings {
    template: 'modern' | 'classic' | 'simple';
    accentColor: string;
    logoUrl: string | null;
    fromAddress: string;
    notes: string;
}

export interface UserProfile extends Profile {
  usage: {
    analyzed: number;
  };
  documents: Document[];
  templates: Template[];
  notifications: Notification[];
  subscription_plan?: SubscriptionPlan;
  clients: Client[];
  matters: Matter[];
  notes: Note[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  i9Records: I9Record[];
  eVerifyCases: EVerifyCase[];
  teamMembers?: Profile[];
  hourly_rate?: number;
  payment_settings?: PaymentSettings;
  invoice_settings?: InvoiceSettings;
  firm_name?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  currentPage: Page;
  user: UserProfile | null;
  viewingDocument?: Document | null;
  editingTemplate?: Template | null;
}

export interface SelectOption {
    value: string;
    label:string;
}

export interface ContractAnalysis {
    summary: string;
    risks: {
        severity: 'High' | 'Medium' | 'Low';
        description: string;
        snippet: string;
    }[];
    missingClauses: string[];
    suggestedFixes: string[];
    keyDates: {
        date: string;
        obligation: string;
    }[];
}

export type DocumentStatus = 'draft' | 'analyzed' | 'reviewed' | 'signed' | 'out_for_signature';

export interface FormData {
  documentType: string;
  state: string;
  partyA_name: string;
  partyA_address: string;
  partyB_name: string;
  partyB_address: string;
  effectiveDate: string;
  optionalClauses: { [key: string]: boolean };
  customDetails: string;
}

export type ResearchType = 'publicProfile' | 'reverseImage' | 'courtFilings' | 'kyc';

export interface ResearchParams {
  fullName: string;
  organization?: string;
  state?: string;
  researchType: ResearchType;
  image?: File;
  reason: string;
  consentGiven: boolean;
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

export interface ResearchLog {
  timestamp: string;
  params: ResearchParams;
}

export interface CaseLawAnalysisResult { aiSummary: string; opinion: any; citedOpinions: any[]; }
export interface PersonProfileResult { aiSummary: string; profile: any; }
export interface DocketSummaryResult { aiSummary: string; docket: any; entries: any[]; }
export interface PredictiveAnalyticsResult {
    prediction: 'PlaintiffLikely' | 'DefendantLikely' | 'Uncertain';
    confidence: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendedStrategy: string;
    supportingCases: { caseName: string; citation: string; reasoning: string; }[];
    rawCasesFetched: number;
}
export interface LegalResearchResult {
  summary: string;
  argumentStrength: { assessment: 'Strong' | 'Moderate' | 'Weak' | 'Uncertain'; reasoning: string; };
  suggestedPrecedents: { caseName: string; citation: string; reasoning: string; }[];
  relevantCases: { caseName: string; citation: string; court: string; decisionDate: string; url: string; snippet: string; aiSummary: string; }[];
}

export interface USCISFormQuestionnaire { [key: string]: any; }
export interface USCISFormResult { filledData: { [key: string]: string | boolean }; errorsAndWarnings: string[]; }