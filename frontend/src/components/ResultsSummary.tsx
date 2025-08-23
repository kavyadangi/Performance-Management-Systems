import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsSummaryProps {
  result: AnalysisResult;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result }) => {
  const { summary } = result;
  
  const getScoreCategoryColor = (score: number) => {
    if (score <= 10) return 'text-green-600 bg-green-50';
    if (score <= 30) return 'text-blue-600 bg-blue-50';
    if (score <= 60) return 'text-yellow-600 bg-yellow-50';
    if (score <= 90) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreCategoryIcon = (score: number) => {
    if (score <= 10) return <CheckCircle className="h-4 w-4" />;
    if (score <= 30) return <CheckCircle className="h-4 w-4" />;
    if (score <= 60) return <AlertTriangle className="h-4 w-4" />;
    if (score <= 90) return <AlertTriangle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getScoreCategoryLabel = (score: number) => {
    if (score <= 10) return 'Normal';
    if (score <= 30) return 'Slight';
    if (score <= 60) return 'Moderate';
    if (score <= 90) return 'Significant';
    return 'Severe';
  };

  return (
    <div className="space-y-6">
      {/* Processing Time */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Processing Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{result.processingTime.toFixed(2)}s</p>
            <p className="text-sm text-gray-500">Processing Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.totalRows.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Data Points Analyzed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.topFeatures.length}</p>
            <p className="text-sm text-gray-500">Unique Features</p>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Score Distribution</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Normal', count: summary.scoreDistribution.normal, range: '0-10' },
              { label: 'Slight', count: summary.scoreDistribution.slight, range: '11-30' },
              { label: 'Moderate', count: summary.scoreDistribution.moderate, range: '31-60' },
              { label: 'Significant', count: summary.scoreDistribution.significant, range: '61-90' },
              { label: 'Severe', count: summary.scoreDistribution.severe, range: '91-100' },
            ].map((category) => (
              <div key={category.label} className="text-center p-4 rounded-lg border">
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                  category.label === 'Normal' ? 'text-green-600 bg-green-50' :
                  category.label === 'Slight' ? 'text-blue-600 bg-blue-50' :
                  category.label === 'Moderate' ? 'text-yellow-600 bg-yellow-50' :
                  category.label === 'Significant' ? 'text-orange-600 bg-orange-50' :
                  'text-red-600 bg-red-50'
                }`}>
                  {category.label === 'Normal' ? <CheckCircle className="h-3 w-3" /> :
                   category.label === 'Slight' ? <CheckCircle className="h-3 w-3" /> :
                   <AlertTriangle className="h-3 w-3" />}
                  <span>{category.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{category.count.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{category.range}</p>
                <p className="text-xs text-gray-400">
                  {((category.count / summary.totalRows) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Range */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Score Statistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.scoreRange.min.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Minimum Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.scoreRange.max.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Maximum Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {((summary.scoreRange.min + summary.scoreRange.max) / 2).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Average Score</p>
          </div>
        </div>
      </div>

      {/* Training Period Validation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Training Period Validation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.trainingPeriodStats.mean.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Mean Score</p>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              summary.trainingPeriodStats.mean <= 10 ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
            }`}>
              {summary.trainingPeriodStats.mean <= 10 ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              <span>{summary.trainingPeriodStats.mean <= 10 ? 'Good' : 'Above Threshold'}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{summary.trainingPeriodStats.max.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Max Score</p>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              summary.trainingPeriodStats.max <= 25 ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
            }`}>
              {summary.trainingPeriodStats.max <= 25 ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              <span>{summary.trainingPeriodStats.max <= 25 ? 'Good' : 'Above Threshold'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributing Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Top Contributing Features</h3>
        </div>
        <div className="space-y-2">
          {summary.topFeatures.slice(0, 10).map((feature, index) => (
            <div key={feature.feature} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <span className="text-sm font-medium text-gray-900">{feature.feature}</span>
              </div>
              <span className="text-sm text-gray-600">{feature.count.toLocaleString()} times</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;
