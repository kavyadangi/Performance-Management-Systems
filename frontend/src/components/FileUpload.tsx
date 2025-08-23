import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  uploadedFile?: File;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isUploading, uploadedFile }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB max
  });

  const getUploadStatus = () => {
    if (isUploading) {
      return (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Uploading...</span>
        </div>
      );
    }
    
    if (uploadedFile) {
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>{uploadedFile.name}</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        <div className="flex flex-col items-center space-y-4">
          {isDragActive ? (
            <Upload className="h-12 w-12 text-blue-500" />
          ) : (
            <FileText className="h-12 w-12 text-gray-400" />
          )}
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop your file here' : 'Upload your CSV file'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop your CSV file here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports CSV, XLS, XLSX files up to 50MB
            </p>
          </div>
          
          {isDragReject && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Invalid file type. Please upload a CSV file.</span>
            </div>
          )}
          
          {getUploadStatus()}
        </div>
      </div>
      
      {uploadedFile && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                File uploaded successfully
              </span>
            </div>
            <span className="text-xs text-green-600">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
