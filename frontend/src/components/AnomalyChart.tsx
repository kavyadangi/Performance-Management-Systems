import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { AnomalyData } from '../types';

interface AnomalyChartProps {
  data: AnomalyData[];
  selectedTimeRange?: { start: string; end: string };
  onTimeRangeSelect?: (start: string, end: string) => void;
}

const AnomalyChart: React.FC<AnomalyChartProps> = ({
  data,
  selectedTimeRange,
  onTimeRangeSelect,
}) => {
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      time: new Date(item.Time).toLocaleString(),
      score: item.Abnormality_score,
      category: getScoreCategory(item.Abnormality_score),
      index,
      originalTime: item.Time,
    }));
  }, [data]);

  const getScoreCategory = (score: number) => {
    if (score <= 10) return 'normal';
    if (score <= 30) return 'slight';
    if (score <= 60) return 'moderate';
    if (score <= 90) return 'significant';
    return 'severe';
  };



  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-medium">{data.score.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Category: <span className="font-medium capitalize">{data.category}</span>
          </p>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">Top Features:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {[1, 2, 3].map((i) => {
                const feature = data[`top_feature_${i}`];
                return feature ? (
                  <li key={i}>• {feature}</li>
                ) : null;
              })}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Anomaly Score Timeline</h3>
        <p className="text-sm text-gray-500">
          Visualizing anomaly scores over time. Higher scores indicate more anomalous data points.
        </p>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            {/* Reference lines for score categories */}
            <ReferenceLine y={10} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={30} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={90} stroke="#f97316" strokeDasharray="3 3" strokeOpacity={0.5} />
            
            {/* Training period reference area */}
            <ReferenceArea
              x1={0}
              x2={120} // First 120 hours (training period)
              fill="#f0f9ff"
              fillOpacity={0.3}
              stroke="#3b82f6"
              strokeOpacity={0.5}
            />
            
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Anomaly Score', angle: -90, position: 'insideLeft' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 1, r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Normal (0-10)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Slight (11-30)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Moderate (31-60)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Significant (61-90)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Severe (91-100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
          <span className="text-sm text-gray-600">Training Period</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {data.filter(d => d.Abnormality_score > 60).length}
          </p>
          <p className="text-sm text-gray-500">High Anomalies</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {data.filter(d => d.Abnormality_score <= 10).length}
          </p>
          <p className="text-sm text-gray-500">Normal Points</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {Math.max(...data.map(d => d.Abnormality_score)).toFixed(1)}
          </p>
          <p className="text-sm text-gray-500">Max Score</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {(data.reduce((sum, d) => sum + d.Abnormality_score, 0) / data.length).toFixed(1)}
          </p>
          <p className="text-sm text-gray-500">Avg Score</p>
        </div>
      </div>
    </div>
  );
};

export default AnomalyChart;
