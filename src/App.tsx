import React, { useState } from 'react';
import { FormSelector } from './components/FormSelector';
import { Toolbar } from './components/Toolbar';
import { PDFViewer } from './components/PDFViewer';
import { DraggableField } from './components/DraggableField';
import { PDFDocument } from 'pdf-lib';

interface FormField {
  id: string;
  type: string;
  position: { x: number; y: number };
  value?: string;
  bind?: string;
}

function App() {
  const [isFormSelectorOpen, setIsFormSelectorOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);

  const handleFormSelect = async (fileName: string) => {
    try {
      // Load PDF file
      const pdfResponse = await fetch(`/documents/${fileName}.pdf`);
      if (!pdfResponse.ok) throw new Error('Failed to load PDF');
      const pdfArrayBuffer = await pdfResponse.arrayBuffer();

      // // Load JSON data
      // const jsonResponse = await fetch(`/documents/json_data/${fileName}.json`);
      // if (!jsonResponse.ok) throw new Error('Failed to load form data');
      // const jsonData = await jsonResponse.json();

      // // Create File object for PDF viewer
      // const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
      // const file = new File([pdfBlob], `${fileName}.pdf`, { type: 'application/pdf' });

      // try {
      //   // Try to load PDF document with encryption handling
      //   const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
      //   setPdfDoc(pdfDoc);
      // } catch (error) {
      //   console.error('Error loading PDF document:', error);
      // }

      const file = await PDFDocument.load(pdfArrayBuffer, {
        ignoreEncryption: true,
      });

      console.log(pdfArrayBuffer);

      setSelectedFile(file);
      setFormData(jsonData);

      // Convert JSON field data to our internal format
      const formFields = jsonData.staticFields.map((field: any) => ({
        id: field.id,
        type: field.type.toLowerCase(),
        position: { x: field.x, y: field.y },
        value: field.value,
        bind: field.bind,
      }));

      setFields(formFields);
    } catch (error) {
      console.error('Error loading form:', error);
    }
  };

  const handleAddField = (type: string) => {
    const newField = {
      id: `field-${Date.now()}`,
      type,
      position: { x: 0, y: 0 },
    };
    setFields([...fields, newField]);
  };

  const handleFieldPositionChange = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, position } : field))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex gap-4">
          <div className="w-64">
            <button
              onClick={() => setIsFormSelectorOpen(true)}
              className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Select Form
            </button>
            <Toolbar onAddField={handleAddField} />
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
            <div className="relative">
              <PDFViewer
                file={selectedFile}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {fields.map((field) => (
                  <DraggableField
                    key={field.id}
                    id={field.id}
                    type={field.type}
                    position={field.position}
                    onPositionChange={handleFieldPositionChange}
                  />
                ))}
              </PDFViewer>
            </div>
          </div>
        </div>
      </div>

      <FormSelector
        isOpen={isFormSelectorOpen}
        onClose={() => setIsFormSelectorOpen(false)}
        onSelectForm={handleFormSelect}
      />
    </div>
  );
}

export default App;
