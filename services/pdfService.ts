import { USCIS_FORMS } from '../constants';
import saveAs from 'file-saver';

/**
 * Helper function to split a full name into its components.
 * Assumes the last word is the last name.
 * @param fullName The full name string.
 * @returns An object with first, middle, and last name.
 */
function splitName(fullName: string | undefined | null): { first: string, middle: string, last: string } {
    if (!fullName) return { first: '', middle: '', last: '' };
    const parts = String(fullName).trim().split(/\s+/);
    if (parts.length === 1) return { first: parts[0], middle: '', last: '' };
    if (parts.length === 2) return { first: parts[0], middle: '', last: parts[1] };
    const last = parts.pop() || '';
    const first = parts.shift() || '';
    const middle = parts.join(' ');
    return { first, middle, last };
}


export async function fillUSCISForm(formId: string, data: { [key: string]: string | boolean }): Promise<void> {
    const formInfo = USCIS_FORMS.find(f => f.id === formId);

    // Type assertion to access custom properties
    const extendedFormInfo = formInfo as typeof USCIS_FORMS[0] & { pdfUrl?: string, fieldMap?: any };

    if (!extendedFormInfo || !extendedFormInfo.pdfUrl || !extendedFormInfo.fieldMap) {
        throw new Error(`PDF template for form ${formId} not found or is not configured for filling.`);
    }

    const { pdfUrl, fieldMap } = extendedFormInfo;
    const { PDFDocument } = (window as any).PDFLib;
    
    // Fetch the PDF
    // Use a more reliable CORS proxy to bypass browser restrictions.
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const existingPdfBytes = await fetch(`${proxyUrl}${encodeURIComponent(pdfUrl)}`).then(res => {
        if (!res.ok) {
            throw new Error(`Failed to fetch PDF via proxy from ${pdfUrl}. Status: ${res.status}. This may be a temporary proxy issue or the source file may be blocking access.`);
        }
        return res.arrayBuffer();
    });

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
        // This option can help with forms that don't auto-update visually
        updateFieldAppearances: true,
        // Add this option to handle encrypted USCIS forms
        ignoreEncryption: true,
    });

    const form = pdfDoc.getForm();
    
    // Log all form fields to help with debugging and mapping
    // console.log(`Fields for ${formId}:`);
    // form.getFields().forEach(field => {
    //     console.log(`- Name: ${field.getName()}, Type: ${field.constructor.name}`);
    // });

    // Fill the fields based on the map
    for (const [dataKey, mapping] of Object.entries(fieldMap)) {
        const value = data[dataKey];
        if (value === undefined || value === null || value === '') continue;

        try {
            if (typeof mapping === 'string') { // Simple key-to-field mapping
                const field = form.getField(mapping);
                if (field.constructor.name === 'PDFTextField') {
                    (field as any).setText(String(value));
                } // Add other simple types if needed
            } else if (typeof mapping === 'object' && (mapping as any).type) { // Complex mapping
                const complexMapping = mapping as any;
                switch(complexMapping.type) {
                    case 'FULL_NAME_FLM': {
                        const { first, middle, last } = splitName(String(value));
                        if(complexMapping.fields.first) form.getTextField(complexMapping.fields.first).setText(first);
                        if(complexMapping.fields.middle) form.getTextField(complexMapping.fields.middle).setText(middle);
                        if(complexMapping.fields.last) form.getTextField(complexMapping.fields.last).setText(last);
                        break;
                    }
                    // Add other complex types like 'ADDRESS', 'CHECKBOX_GROUP' here in the future
                }
            }
        } catch (e) {
            console.warn(`Could not find or fill field for data key: "${dataKey}" with mapping:`, mapping, e);
        }
    }

    // Save the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `${formId}-filled.pdf`);
}