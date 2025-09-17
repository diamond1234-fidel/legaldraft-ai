
import { SelectOption, FormData } from './types';

export const DOCUMENT_TYPES: string[] = [
  "Non-Disclosure Agreement (NDA)",
  "Employment Contract",
  "Residential Lease Agreement",
  "Partnership Agreement",
  "Last Will and Testament",
  "Custom/Other",
];

export const JURISDICTIONS: SelectOption[] = [
    { value: "USA-CA", label: "USA - California" },
    { value: "USA-NY", label: "USA - New York" },
    { value: "USA-TX", label: "USA - Texas" },
    { value: "USA-FL", label: "USA - Florida" },
    { value: "CAN-ON", label: "Canada - Ontario" },
    { value: "GBR", label: "United Kingdom" },
    { value: "DEU", label: "Germany" },
    { value: "FRA", label: "France" },
    { value: "JPN", label: "Japan" },
    { value: "AUS", label: "Australia" },
];

// FIX: Add US_STATES export by filtering JURISDICTIONS to resolve import errors in other components.
export const US_STATES: SelectOption[] = JURISDICTIONS.filter(j => j.value.startsWith('USA-'));

export const PRACTICE_AREAS: SelectOption[] = [
    { value: 'corporate', label: 'Corporate Law' },
    { value: 'litigation', label: 'Litigation' },
    { value: 'family', label: 'Family Law' },
    { value: 'criminal', label: 'Criminal Law' },
    { value: 'ip', label: 'Intellectual Property' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'immigration', label: 'Immigration' },
    { value: 'other', label: 'Other' },
];

export const OPTIONAL_CLAUSES: { id: keyof FormData['optionalClauses']; label: string; description: string }[] = [
  { id: 'arbitration', label: 'Arbitration Clause', description: 'Mandates that disputes be settled through arbitration instead of court.' },
  { id: 'indemnification', label: 'Indemnification Clause', description: 'One party agrees to cover the losses of another.' },
  { id: 'confidentiality', label: 'Confidentiality Clause', description: 'Protects sensitive information shared between the parties.' },
];

export const DISCLAIMER = "This tool is an AI drafting assistant, not legal advice. Documents must be reviewed by a licensed attorney in your state.";
