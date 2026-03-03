/**
 * Extracts plain text from .txt and .docx files in the browser.
 *
 * - .txt  → native File.text() API (no external dependency)
 * - .docx → mammoth (dynamic import, confirmed installed)
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt') {
    return file.text();
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  }

  throw new Error(
    `Unsupported file type: .${ext}. Please upload a .txt or .docx file.`,
  );
}
