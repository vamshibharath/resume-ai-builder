export async function parseResumeFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    const pdfParse = await import('pdf-parse');
    const result = await pdfParse.default(buffer);
    return result.text;
  }
  
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  
  if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  }
  
  throw new Error(`Unsupported file type: ${mimeType}. Please upload a PDF, DOCX, or TXT file.`);
}
