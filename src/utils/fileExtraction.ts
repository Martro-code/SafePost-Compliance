/**
 * Extracts plain text or base64 data from uploaded files.
 *
 * - .txt  → native browser FileReader API, returns text result
 * - .docx → mammoth library, returns text result
 * - .pdf  → native FileReader readAsDataURL, returns base64 result
 *           (text extraction is handled server-side via Claude's native PDF support)
 */

export type FileExtractionResult =
  | { type: 'text'; content: string }
  | { type: 'pdf'; base64: string };

export async function extractTextFromFile(file: File): Promise<FileExtractionResult> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt') {
    return new Promise<FileExtractionResult>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ type: 'text', content: reader.result as string });
      reader.onerror = () => reject(new Error('Failed to read the text file.'));
      reader.readAsText(file);
    });
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const extracted = String(result.value).trim();
    console.log('[fileExtraction] mammoth extracted text:', {
      length: extracted.length,
      preview: extracted.slice(0, 200),
      isEmpty: extracted.length === 0,
    });
    return { type: 'text', content: extracted };
  }

  if (ext === 'pdf') {
    return new Promise<FileExtractionResult>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Strip the data URL prefix (e.g. "data:application/pdf;base64,")
        const base64 = dataUrl.split(',')[1];
        resolve({ type: 'pdf', base64 });
      };
      reader.onerror = () => reject(new Error('Failed to read the PDF file.'));
      reader.readAsDataURL(file);
    });
  }

  throw new Error(
    `Unsupported file type: .${ext}. Please upload a .txt, .docx, or .pdf file.`,
  );
}
