/**
 * Extracts plain text from .txt, .pdf, and .docx files in the browser.
 *
 * - .txt  → native File.text() API
 * - .pdf  → unpdf (Vite-compatible, bundles its own PDF.js build)
 * - .docx → mammoth (dynamic import)
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt') {
    return file.text();
  }

  if (ext === 'pdf') {
    const { extractText } = await import('unpdf');
    const arrayBuffer = await file.arrayBuffer();
    const result = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
    return (result.text as string).trim();
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: .${ext}`);
}
