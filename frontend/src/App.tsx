import React, { useState, useCallback, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Activity, Upload, BarChart3, Table, Download, AlertCircle } from 'lucide-react';

import FileUpload from './components/FileUpload';
import AnalysisSettings from './components/AnalysisSettings';
import ResultsSummary from './components/ResultsSummary';
import AnomalyChart from './components/AnomalyChart';
import DataTable from './components/DataTable';

import { AnalysisResult, ProcessingStatus } from './types';
import { uploadFile, analyzeData, downloadResults, uploadAndAnalyze, uploadAndAnalyzeSummary } from './services/api';

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({ status: 'idle' });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [contamination, setContamination] = useState(0.1);
  const [randomState, setRandomState] = useState(42);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

  // Debug effect to monitor analysisResult changes
  useEffect(() => {
    console.log('analysisResult state changed:', analysisResult);
  }, [analysisResult]);

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setProcessingStatus({ status: 'uploading', message: 'Uploading and analyzing file...' });

    try {
      const result = await uploadAndAnalyzeSummary(file, contamination, randomState);
      console.log('Upload and analysis summary result:', result); // Debug log
      
      // Check if the response was successful
      if (!result.success) {
        throw new Error(result.message || 'Analysis failed');
      }
      
      // Convert summary response to AnalysisResult format
      const analysisResult: AnalysisResult = {
        data: [], // Empty array since we only have summary
        summary: result.summary,
        processingTime: result.processingTime
      };
      
      console.log('Setting analysis result:', analysisResult); // Debug log
      setAnalysisResult(analysisResult);
      console.log('Analysis result set, switching to results tab'); // Debug log
      setProcessingStatus({ status: 'completed', message: 'Analysis completed!', progress: 100 });
      setActiveTab('results');
      
      toast.success('File uploaded and analyzed successfully!');
      
      // Reset progress after a delay
      setTimeout(() => {
        setProcessingStatus({ status: 'idle' });
      }, 2000);
      
    } catch (error) {
      console.error('Upload and analysis error:', error);
      toast.error('Failed to upload and analyze file. Please try again.');
      setProcessingStatus({ status: 'error', message: 'Upload and analysis failed' });
    } finally {
      setIsUploading(false);
    }
  }, [contamination, randomState]);



  const handleDownloadResults = useCallback(async () => {
    if (!analysisResult) return;

    try {
      // For summary results, we need to get the filename from the backend
      // For now, let's show a message that full results can be downloaded via API
      toast.info('Full results can be downloaded using the API endpoint: /api/download/{filename}');
      
      // If we have the filename, we could construct the download URL
      // const blob = await downloadResults('anomaly_results.csv');
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'anomaly_results.csv';
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      
      // toast.success('Results downloaded successfully!');
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
          <h2 className="text-xl font-semibold text-gray-900">Upload & Analyze Data</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Upload your CSV file containing time series data. The system will automatically analyze the data for anomalies
          and provide detailed insights with feature attribution.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">API Endpoints:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <code className="bg-blue-100 px-1 rounded">POST /api/upload-and-analyze-summary</code> - Summary results only (recommended)</li>
            <li>• <code className="bg-blue-100 px-1 rounded">POST /api/upload-and-analyze</code> - Full results with all data points</li>
            <li>• <code className="bg-blue-100 px-1 rounded">GET /api/download/{'{filename}'}</code> - Download full results CSV</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <button
              onClick={() => {
                console.log('Current analysisResult state:', analysisResult);
                console.log('Current activeTab:', activeTab);
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 mr-2"
            >
              Debug State
            </button>
            <button
              onClick={() => {
                const testResult = {
                  data: [],
                  summary: {
                    totalRows: 26400,
                    scoreRange: { min: 0, max: 100 },
                    scoreDistribution: {
                      normal: 2650,
                      slight: 5271,
                      moderate: 7920,
                      significant: 7920,
                      severe: 2639
                    },
                    trainingPeriodStats: { mean: 32.78, max: 81.68 },
                    topFeatures: [
                      { feature: "ReactorPressurekPagauge", count: 8651 },
                      { feature: "ReactorCoolingWaterFlow", count: 8050 }
                    ]
                  },
                  processingTime: 6.99
                };
                setAnalysisResult(testResult);
                setActiveTab('results');
                toast.success('Test data loaded!');
              }}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Load Test Data
            </button>
          </div>
        </div>
        
        <AnalysisSettings
          contamination={contamination}
          randomState={randomState}
          onContaminationChange={setContamination}
          onRandomStateChange={setRandomState}
        />
        
        <div className="mt-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
            uploadedFile={uploadedFile || undefined}
          />
        </div>
      </div>
    </div>
  );

  const renderResultsSection = () => {
    console.log('renderResultsSection called, analysisResult:', analysisResult); // Debug log
    
    if (!analysisResult) {
      console.log('No analysis result available');
      return null;
    }

    console.log('Rendering results with:', analysisResult); // Debug log

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

        {analysisResult.data && analysisResult.data.length > 0 ? (
          <>
            <AnomalyChart data={analysisResult.data} />
            <DataTable 
              data={analysisResult.data} 
              onDownload={handleDownloadResults}
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Summary View Only</h3>
              <p className="text-gray-500 mb-4">
                This analysis shows summary statistics only. For detailed data visualization and charts, 
                use the full analysis endpoint.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Key Insights:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Total data points analyzed: {analysisResult.summary?.totalRows?.toLocaleString()}</li>
                  <li>• Processing time: {(analysisResult.processingTime || 0).toFixed(2)} seconds</li>
                  <li>• Score range: {analysisResult.summary?.scoreRange?.min?.toFixed(2)} - {analysisResult.summary?.scoreRange?.max?.toFixed(2)}</li>
                  <li>• Top contributing features identified</li>
                </ul>
              </div>
            </div>
          </div>
        )}
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
