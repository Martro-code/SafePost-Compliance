/**
 * Extracts plain text from uploaded files.
 *
 * - .txt  → native browser FileReader API
 * - .docx → mammoth library
 * - .pdf  → not supported
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    throw new Error(
      'PDF files are not currently supported. Please upload a .txt or .docx file.',
    );
  }

  if (ext === 'txt') {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read the text file.'));
      reader.readAsText(file);
    });
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
