import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-12 h-12 mb-3 text-blue-500" />
          <p className="mb-2 text-sm text-gray-700 font-medium">
            Click to upload Salesforce debug log
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: .txt, .log
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".txt,.log"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
