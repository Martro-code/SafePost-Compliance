/**
 * Extracts plain text from .txt and .docx files in the browser.
 *
 * - .txt  → native File.text() API
 * - .docx → mammoth (dynamic import)
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt') {
    return file.text();
  }

  if (ext === 'pdf') {
    throw new Error(
      'PDF files are not supported for direct upload. Please copy and paste your content into the text area, or upload a .txt or .docx file instead.',
    );
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: .${ext}`);
}
