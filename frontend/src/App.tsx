import React, { useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Activity, Upload, BarChart3, Table, Download, AlertCircle } from 'lucide-react';

import FileUpload from './components/FileUpload';
import AnalysisSettings from './components/AnalysisSettings';
import ResultsSummary from './components/ResultsSummary';
import AnomalyChart from './components/AnomalyChart';
import DataTable from './components/DataTable';

import { AnalysisResult, ProcessingStatus } from './types';
import { uploadFile, analyzeData, downloadResults } from './services/api';

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({ status: 'idle' });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [contamination, setContamination] = useState(0.1);
  const [randomState, setRandomState] = useState(42);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setProcessingStatus({ status: 'uploading', message: 'Uploading file...' });

    try {
      const response = await uploadFile(file);
      if (response.success) {
        toast.success('File uploaded successfully!');
        setProcessingStatus({ status: 'idle' });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
      setProcessingStatus({ status: 'error', message: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first.');
      return;
    }

    setProcessingStatus({ status: 'processing', message: 'Analyzing data...', progress: 0 });
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingStatus(prev => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + 10, 90)
        }));
      }, 500);

      const result = await analyzeData({
        filename: uploadedFile.name,
        contamination,
        randomState,
      });

      clearInterval(progressInterval);
      
      setAnalysisResult(result);
      setProcessingStatus({ status: 'completed', message: 'Analysis completed!', progress: 100 });
      setActiveTab('results');
      
      toast.success('Analysis completed successfully!');
      
      // Reset progress after a delay
      setTimeout(() => {
        setProcessingStatus({ status: 'idle' });
      }, 2000);

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
      setProcessingStatus({ status: 'error', message: 'Analysis failed' });
    }
  }, [uploadedFile, contamination, randomState]);

  const handleDownloadResults = useCallback(async () => {
    if (!analysisResult) return;

    try {
      const blob = await downloadResults('anomaly_results.csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'anomaly_results.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Results downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download results.');
    }
  }, [analysisResult]);

  const renderUploadSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Upload Data</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Upload your CSV file containing time series data. The system will analyze the data for anomalies
          and provide detailed insights with feature attribution.
        </p>
        <FileUpload
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
          uploadedFile={uploadedFile}
        />
      </div>

      {uploadedFile && (
        <AnalysisSettings
          contamination={contamination}
          randomState={randomState}
          onContaminationChange={setContamination}
          onRandomStateChange={setRandomState}
        />
      )}

      {uploadedFile && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Ready to Analyze</h3>
              <p className="text-sm text-gray-500">
                File uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={processingStatus.status === 'processing'}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processingStatus.status === 'processing' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  <span>Start Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderResultsSection = () => {
    if (!analysisResult) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
            </div>
            <button
              onClick={handleDownloadResults}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Results</span>
            </button>
          </div>
          
          <ResultsSummary result={analysisResult} />
        </div>

        <AnomalyChart data={analysisResult.data} />

        <DataTable 
          data={analysisResult.data} 
          onDownload={handleDownloadResults}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Anomaly Detection System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Processing Status */}
        {processingStatus.status !== 'idle' && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                {processingStatus.status === 'processing' && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
                {processingStatus.status === 'completed' && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                {processingStatus.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium text-gray-900">
                  {processingStatus.message}
                </span>
                {processingStatus.progress !== undefined && (
                  <div className="flex-1 ml-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingStatus.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload & Configure</span>
              </div>
            </button>
            
            {analysisResult && (
              <button
                onClick={() => setActiveTab('results')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Results & Analysis</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'upload' ? renderUploadSection() : renderResultsSection()}
      </main>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
