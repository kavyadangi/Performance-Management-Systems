export interface AnomalyData {
  Time: string;
  Abnormality_score: number;
  top_feature_1: string;
  top_feature_2: string;
  top_feature_3: string;
  top_feature_4: string;
  top_feature_5: string;
  top_feature_6: string;
  top_feature_7: string;
  [key: string]: any; // For other sensor columns
}

export interface AnalysisResult {
  data: AnomalyData[];
  summary: {
    totalRows: number;
    scoreRange: {
      min: number;
      max: number;
    };
    scoreDistribution: {
      normal: number;
      slight: number;
      moderate: number;
      significant: number;
      severe: number;
    };
    trainingPeriodStats: {
      mean: number;
      max: number;
    };
    topFeatures: Array<{
      feature: string;
      count: number;
    }>;
  };
  processingTime: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  filename?: string;
}

export interface AnalysisRequest {
  filename: string;
  contamination?: number;
  randomState?: number;
}

export interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export interface ChartDataPoint {
  time: string;
  score: number;
  category: 'normal' | 'slight' | 'moderate' | 'significant' | 'severe';
}

export interface FeatureContribution {
  feature: string;
  contribution: number;
  rank: number;
}
