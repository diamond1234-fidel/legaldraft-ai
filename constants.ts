
import { SelectOption } from './types';

export const BACKEND_URL = 'https://legalcase.vercel.app';

export const DISCLAIMER = 'AI-generated analysis is not legal advice and may contain errors. All output requires review by a qualified professional before use.';

export const US_JURISDICTIONS: SelectOption[] = [
    { value: "USA-AL", label: "USA - Alabama" },
    { value: "USA-AK", label: "USA - Alaska" },
    { value: "USA-AZ", label: "USA - Arizona" },
    { value: "USA-AR", label: "USA - Arkansas" },
    { value: "USA-CA", label: "USA - California" },
    { value: "USA-CO", label: "USA - Colorado" },
    { value: "USA-CT", label: "USA - Connecticut" },
    { value: "USA-DE", label: "USA - Delaware" },
    { value: "USA-DC", label: "USA - District of Columbia" },
    { value: "USA-FL", label: "USA - Florida" },
    { value: "USA-GA", label: "USA - Georgia" },
    { value: "USA-HI", label: "USA - Hawaii" },
    { value: "USA-ID", label: "USA - Idaho" },
    { value: "USA-IL", label: "USA - Illinois" },
    { value: "USA-IN", label: "USA - Indiana" },
    { value: "USA-IA", label: "USA - Iowa" },
    { value: "USA-KS", label: "USA - Kansas" },
    { value: "USA-KY", label: "USA - Kentucky" },
    { value: "USA-LA", label: "USA - Louisiana" },
    { value: "USA-ME", label: "USA - Maine" },
    { value: "USA-MD", label: "USA - Maryland" },
    { value: "USA-MA", label: "USA - Massachusetts" },
    { value: "USA-MI", label: "USA - Michigan" },
    { value: "USA-MN", label: "USA - Minnesota" },
    { value: "USA-MS", label: "USA - Mississippi" },
    { value: "USA-MO", label: "USA - Missouri" },
    { value: "USA-MT", label: "USA - Montana" },
    { value: "USA-NE", label: "USA - Nebraska" },
    { value: "USA-NV", label: "USA - Nevada" },
    { value: "USA-NH", label: "USA - New Hampshire" },
    { value: "USA-NJ", label: "USA - New Jersey" },
    { value: "USA-NM", label: "USA - New Mexico" },
    { value: "USA-NY", label: "USA - New York" },
    { value: "USA-NC", label: "USA - North Carolina" },
    { value: "USA-ND", label: "USA - North Dakota" },
    { value: "USA-OH", label: "USA - Ohio" },
    { value: "USA-OK", label: "USA - Oklahoma" },
    { value: "USA-OR", label: "USA - Oregon" },
    { value: "USA-PA", label: "USA - Pennsylvania" },
    { value: "USA-RI", label: "USA - Rhode Island" },
    { value: "USA-SC", label: "USA - South Carolina" },
    { value: "USA-SD", label: "USA - South Dakota" },
    { value: "USA-TN", label: "USA - Tennessee" },
    { value: "USA-TX", label: "USA - Texas" },
    { value: "USA-UT", label: "USA - Utah" },
    { value: "USA-VT", label: "USA - Vermont" },
    { value: "USA-VA", label: "USA - Virginia" },
    { value: "USA-WA", label: "USA - Washington" },
    { value: "USA-WV", label: "USA - West Virginia" },
    { value: "USA-WI", label: "USA - Wisconsin" },
    { value: "USA-WY", label: "USA - Wyoming" },
    { value: "USA-AS", label: "USA - American Samoa" },
    { value: "USA-GU", label: "USA - Guam" },
    { value: "USA-MP", label: "USA - Northern Mariana Islands" },
    { value: "USA-PR", label: "USA - Puerto Rico" },
    { value: "USA-VI", label: "USA - U.S. Virgin Islands" },
    { value: "GBR", label: "United Kingdom" },
    { value: "INTL", label: "International" },
];

// FIX: Add SUPPORTING_DOC_TYPES
export const SUPPORTING_DOC_TYPES = [
    'Affidavit of Support',
    'Cover Letter for I-130',
    'Personal Statement of Bona Fide Marriage',
    'Cover Letter for I-485',
    'Declaration of Financial Support',
];

// FIX: Add PRACTICE_AREAS
export const PRACTICE_AREAS: SelectOption[] = [
    { value: "family-law", label: "Family Law" },
    { value: "immigration", label: "Immigration Law" },
    { value: "criminal-defense", label: "Criminal Defense" },
    { value: "corporate", label: "Corporate Law" },
    { value: "real-estate", label: "Real Estate" },
    { value: "intellectual-property", label: "Intellectual Property" },
    { value: "personal-injury", label: "Personal Injury" },
    { value: "other", label: "Other" },
];

// FIX: Add USCIS_FORMS
export const USCIS_FORMS = [
  // Family-Based
  { id: 'i-130', name: 'I-130', title: 'Petition for Alien Relative', description: 'To petition for a qualifying foreign-born relative to immigrate to the United States.', category: 'Family-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-130.pdf' },
  { id: 'i-485', name: 'I-485', title: 'Application to Register Permanent Residence or Adjust Status', description: 'Used by individuals in the U.S. to apply for lawful permanent resident status.', category: 'Family-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-485.pdf' },
  { id: 'i-129f', name: 'I-129F', title: 'Petition for Alien Fiancé(e)', description: 'For a U.S. citizen to bring their foreign-citizen fiancé(e) to the U.S. to marry.', category: 'Family-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-129f.pdf' },
  { id: 'i-864', name: 'I-864', title: 'Affidavit of Support', description: 'Required for most family-based immigrants to show they have adequate means of financial support.', category: 'Family-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-864.pdf' },
  { id: 'i-751', name: 'I-751', title: 'Petition to Remove Conditions on Residence', description: 'For conditional permanent residents who obtained status through marriage to remove the conditions.', category: 'Family-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-751.pdf' },
  
  // Citizenship
  { id: 'n-400', name: 'N-400', title: 'Application for Naturalization', description: 'The application to become a U.S. citizen.', category: 'Citizenship', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/n-400.pdf' },
  { id: 'n-600', name: 'N-600', title: 'Application for Certificate of Citizenship', description: 'To claim U.S. citizenship by birth to a U.S. citizen parent or by deriving citizenship after birth.', category: 'Citizenship', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/n-600.pdf' },
  { id: 'n-600k', name: 'N-600K', title: 'Application for Citizenship and Issuance of Certificate Under Section 322', description: 'For a child residing outside the U.S. to claim U.S. citizenship.', category: 'Citizenship', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/n-600k.pdf' },

  // Employment-Based
  { id: 'i-129', name: 'I-129', title: 'Petition for a Nonimmigrant Worker', description: 'Used by employers to petition for a foreign national to come to the U.S. temporarily to perform services or labor.', category: 'Employment-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-129.pdf' },
  { id: 'i-140', name: 'I-140', title: 'Immigrant Petition for Alien Worker', description: 'Used by employers to petition for an alien worker to become a permanent resident in the U.S.', category: 'Employment-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-140.pdf' },
  { id: 'i-907', name: 'I-907', title: 'Request for Premium Processing Service', description: 'To request faster processing for certain employment-based petitions and applications.', category: 'Employment-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-907.pdf' },
  { id: 'i-9', name: 'I-9', title: 'Employment Eligibility Verification', description: 'Used by employers to verify the identity and employment authorization of individuals hired for employment in the United States.', category: 'Employment-Based', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-9.pdf' },

  // Humanitarian
  { id: 'i-589', name: 'I-589', title: 'Application for Asylum and for Withholding of Removal', description: 'To apply for asylum in the United States and for withholding of removal (formerly called "withholding of deportation").', category: 'Humanitarian', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-589.pdf' },
  { id: 'i-730', name: 'I-730', title: 'Refugee/Asylee Relative Petition', description: 'For a principal refugee or asylee to petition for qualifying relatives to join them in the U.S.', category: 'Humanitarian', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-730.pdf' },
  
  // Other Common Forms
  { id: 'g-28', name: 'G-28', title: 'Notice of Entry of Appearance as Attorney or Accredited Representative', description: 'To provide notice that an attorney or accredited representative is representing a person in a matter before DHS.', category: 'Other Common Forms', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/g-28.pdf' },
  { id: 'i-765', name: 'I-765', title: 'Application for Employment Authorization', description: 'Used by certain foreign nationals to request an Employment Authorization Document (EAD).', category: 'Other Common Forms', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-765.pdf' },
  { id: 'i-131', name: 'I-131', title: 'Application for Travel Document', description: 'To apply for a re-entry permit, refugee travel document, or advance parole travel document.', category: 'Other Common Forms', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-131.pdf' },
  { id: 'i-824', name: 'I-824', title: 'Application for Action on an Approved Application or Petition', description: 'To request further action on a previously approved application or petition.', category: 'Other Common Forms', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-824.pdf' },
  { id: 'i-290b', name: 'I-290B', title: 'Notice of Appeal or Motion', description: 'To file an appeal or a motion to reopen or reconsider certain decisions made by USCIS.', category: 'Other Common Forms', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-290b.pdf' },
  { id: 'i-601', name: 'I-601', title: 'Application for Waiver of Grounds of Inadmissibility', description: 'For applicants who are inadmissible to the U.S. and are seeking a waiver.', category: 'Other Common Forms', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-601.pdf' },
  { id: 'i-212', name: 'I-212', title: 'Application for Permission to Reapply for Admission into the U.S. After Deportation or Removal', description: 'For individuals who have been deported or removed and need permission to reapply for admission.', category: 'Other Common Forms', pdfUrl: 'https://www.uscis.gov/sites/default/files/document/forms/i-212.pdf' },
];
