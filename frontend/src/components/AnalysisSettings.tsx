import React from 'react';
import { Settings, Info } from 'lucide-react';

interface AnalysisSettingsProps {
  contamination: number;
  randomState: number;
  onContaminationChange: (value: number) => void;
  onRandomStateChange: (value: number) => void;
}

const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({
  contamination,
  randomState,
  onContaminationChange,
  onRandomStateChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">Analysis Settings</h3>
      </div>
      
      <div className="space-y-6">
        {/* Contamination Parameter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contamination Rate
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={contamination}
              onChange={(e) => onContaminationChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
              {(contamination * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-start space-x-2 mt-2">
            <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Expected proportion of anomalies in the dataset. Higher values detect more anomalies but may increase false positives.
            </p>
          </div>
        </div>
        
        {/* Random State Parameter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Random State
          </label>
          <input
            type="number"
            min="0"
            max="9999"
            value={randomState}
            onChange={(e) => onRandomStateChange(parseInt(e.target.value) || 42)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="42"
          />
          <div className="flex items-start space-x-2 mt-2">
            <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Random seed for reproducible results. Use the same value to get consistent results across runs.
            </p>
          </div>
        </div>
        
        {/* Preset Configurations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onContaminationChange(0.05);
                onRandomStateChange(42);
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Conservative (5%)
            </button>
            <button
              onClick={() => {
                onContaminationChange(0.1);
                onRandomStateChange(42);
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Balanced (10%)
            </button>
            <button
              onClick={() => {
                onContaminationChange(0.2);
                onRandomStateChange(42);
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Sensitive (20%)
            </button>
            <button
              onClick={() => {
                onContaminationChange(0.3);
                onRandomStateChange(42);
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Very Sensitive (30%)
            </button>
          </div>
        </div>
        
        {/* Information Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">About These Parameters:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Contamination:</strong> Higher values detect more anomalies but may increase false positives</li>
                <li>• <strong>Random State:</strong> Ensures reproducible results across multiple runs</li>
                <li>• <strong>Training Period:</strong> First 120 hours (1/1/2004 to 1/5/2004) used for model training</li>
                <li>• <strong>Analysis Period:</strong> Full dataset (1/1/2004 to 1/19/2004) analyzed for anomalies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSettings;
