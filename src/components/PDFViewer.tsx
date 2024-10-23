import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { PasswordPrompt } from './PasswordPrompt';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  children?: React.ReactNode;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ file, onLoadSuccess, children }) => {
  const [passwordNeeded, setPasswordNeeded] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [password, setPassword] = useState<string>();

  if (!file) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Select a form to get started</p>
      </div>
    );
  }

  const handlePasswordNeeded = () => {
    setPasswordNeeded(true);
  };

  const handlePasswordSubmit = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordNeeded(false);
    setPasswordError(undefined);
  };

  const handleLoadError = (error: Error) => {
    if (error.message.includes('Password')) {
      setPasswordError('Incorrect password. Please try again.');
      setPasswordNeeded(true);
    } else {
      console.error('Error loading PDF:', error);
    }
  };

  return (
    <div className="relative">
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        onPassword={handlePasswordNeeded}
        onLoadError={handleLoadError}
        password={password}
        className="border border-gray-300 rounded-lg shadow-lg"
      >
        <Page pageNumber={1} className="relative">
          {children}
        </Page>
      </Document>

      {passwordNeeded && (
        <PasswordPrompt
          onSubmit={handlePasswordSubmit}
          onCancel={() => setPasswordNeeded(false)}
          error={passwordError}
        />
      )}
    </div>
  );
};