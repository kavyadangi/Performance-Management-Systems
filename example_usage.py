"""
Example Usage Script for Anomaly Detection System

This script demonstrates how to use the anomaly detection system
with the provided dataset.
"""

import os
import sys
from datetime import datetime
import pandas as pd

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from anomaly_detector import AnomalyDetectionSystem, main


def example_basic_usage():
    """Demonstrate basic usage of the anomaly detection system."""
    print("=== BASIC USAGE EXAMPLE ===")
    
    input_file = "81ce1f00-c3f4-4baa-9b57-006fad1875adTEP_Train_Test.csv"
    output_file = "anomaly_results.csv"
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found!")
        return
    
    print(f"Input file: {input_file}")
    print(f"Output file: {output_file}")
    print("Running anomaly detection...")
    
    try:
        # Run the anomaly detection
        start_time = datetime.now()
        from anomaly_detector import AnomalyDetectionSystem
        system = AnomalyDetectionSystem()
        system.process_data(input_file, output_file)
        end_time = datetime.now()
        
        runtime = (end_time - start_time).total_seconds()
        print(f"✓ Anomaly detection completed in {runtime:.2f} seconds")
        
        # Display results summary
        if os.path.exists(output_file):
            df = pd.read_csv(output_file)
            print(f"✓ Results saved: {len(df)} rows, {len(df.columns)} columns")
            
            # Show score statistics
            scores = df['Abnormality_score']
            print(f"✓ Score range: {scores.min():.2f} to {scores.max():.2f}")
            print(f"✓ Mean score: {scores.mean():.2f}")
            
            # Show top features distribution
            feature_cols = [f'top_feature_{i+1}' for i in range(7)]
            print("\nTop contributing features:")
            for col in feature_cols:
                non_empty = df[col].str.len() > 0
                print(f"  {col}: {non_empty.sum()} non-empty values")
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")


def example_programmatic_usage():
    """Demonstrate programmatic usage with custom parameters."""
    print("\n=== PROGRAMMATIC USAGE EXAMPLE ===")
    
    input_file = "81ce1f00-c3f4-4baa-9b57-006fad1875adTEP_Train_Test.csv"
    output_file = "custom_results.csv"
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found!")
        return
    
    try:
        # Initialize system with custom parameters
        system = AnomalyDetectionSystem(
            contamination=0.15,  # Expect 15% anomalies
            random_state=123     # Different random seed
        )
        
        print("Running with custom parameters...")
        start_time = datetime.now()
        system.process_data(input_file, output_file)
        end_time = datetime.now()
        
        runtime = (end_time - start_time).total_seconds()
        print(f"✓ Custom analysis completed in {runtime:.2f} seconds")
        
        # Compare results
        if os.path.exists(output_file):
            df = pd.read_csv(output_file)
            scores = df['Abnormality_score']
            print(f"✓ Custom results - Mean score: {scores.mean():.2f}")
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")


def example_data_analysis():
    """Demonstrate data analysis capabilities."""
    print("\n=== DATA ANALYSIS EXAMPLE ===")
    
    input_file = "81ce1f00-c3f4-4baa-9b57-006fad1875adTEP_Train_Test.csv"
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found!")
        return
    
    try:
        # Load and analyze input data
        df = pd.read_csv(input_file)
        df['Time'] = pd.to_datetime(df['Time'])
        
        print(f"Dataset overview:")
        print(f"  Total rows: {len(df)}")
        print(f"  Total columns: {len(df.columns)}")
        print(f"  Time range: {df['Time'].min()} to {df['Time'].max()}")
        print(f"  Time interval: {df['Time'].diff().median()}")
        
        # Analyze numeric features
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        print(f"  Numeric features: {len(numeric_cols)}")
        
        # Show feature statistics
        print("\nFeature statistics (first 5 features):")
        for col in numeric_cols[:5]:
            stats = df[col].describe()
            print(f"  {col}: mean={stats['mean']:.3f}, std={stats['std']:.3f}")
        
        # Check for missing values
        missing_counts = df.isnull().sum()
        missing_features = missing_counts[missing_counts > 0]
        if len(missing_features) > 0:
            print(f"\nFeatures with missing values: {len(missing_features)}")
            for col, count in missing_features.items():
                print(f"  {col}: {count} missing values")
        else:
            print("\n✓ No missing values found")
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")


def example_result_analysis():
    """Demonstrate analysis of anomaly detection results."""
    print("\n=== RESULT ANALYSIS EXAMPLE ===")
    
    output_file = "anomaly_results.csv"
    
    if not os.path.exists(output_file):
        print(f"Error: Results file {output_file} not found! Run basic usage first.")
        return
    
    try:
        # Load results
        df = pd.read_csv(output_file)
        df['Time'] = pd.to_datetime(df['Time'])
        
        print("Anomaly detection results analysis:")
        
        # Score distribution
        scores = df['Abnormality_score']
        print(f"\nScore distribution:")
        print(f"  Min: {scores.min():.2f}")
        print(f"  Max: {scores.max():.2f}")
        print(f"  Mean: {scores.mean():.2f}")
        print(f"  Median: {scores.median():.2f}")
        print(f"  Std: {scores.std():.2f}")
        
        # Score categories
        normal = (scores <= 10).sum()
        slight = ((scores > 10) & (scores <= 30)).sum()
        moderate = ((scores > 30) & (scores <= 60)).sum()
        significant = ((scores > 60) & (scores <= 90)).sum()
        severe = (scores > 90).sum()
        
        print(f"\nScore categories:")
        print(f"  Normal (0-10): {normal} ({normal/len(scores)*100:.1f}%)")
        print(f"  Slight (11-30): {slight} ({slight/len(scores)*100:.1f}%)")
        print(f"  Moderate (31-60): {moderate} ({moderate/len(scores)*100:.1f}%)")
        print(f"  Significant (61-90): {significant} ({significant/len(scores)*100:.1f}%)")
        print(f"  Severe (91-100): {severe} ({severe/len(scores)*100:.1f}%)")
        
        # Training period validation
        training_mask = (df['Time'] >= pd.Timestamp('2004-01-01 00:00:00')) & \
                       (df['Time'] <= pd.Timestamp('2004-01-05 23:59:59'))
        training_scores = df.loc[training_mask, 'Abnormality_score']
        
        if len(training_scores) > 0:
            print(f"\nTraining period validation:")
            print(f"  Training samples: {len(training_scores)}")
            print(f"  Mean score: {training_scores.mean():.2f}")
            print(f"  Max score: {training_scores.max():.2f}")
            
            if training_scores.mean() < 10:
                print("  ✓ Training period scores are within acceptable range")
            else:
                print("  ⚠ Training period scores are above recommended threshold")
        
        # Top contributing features analysis
        feature_cols = [f'top_feature_{i+1}' for i in range(7)]
        print(f"\nTop contributing features analysis:")
        
        # Count feature occurrences
        feature_counts = {}
        for col in feature_cols:
            for feature in df[col]:
                if feature and feature != "":
                    feature_counts[feature] = feature_counts.get(feature, 0) + 1
        
        # Show most common contributing features
        sorted_features = sorted(feature_counts.items(), key=lambda x: x[1], reverse=True)
        print("  Most common contributing features:")
        for feature, count in sorted_features[:10]:
            print(f"    {feature}: {count} times")
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")


def main():
    """Run all examples."""
    print("ANOMALY DETECTION SYSTEM - EXAMPLE USAGE")
    print("=" * 50)
    
    # Run examples
    example_basic_usage()
    example_programmatic_usage()
    example_data_analysis()
    example_result_analysis()
    
    print("\n" + "=" * 50)
    print("Example usage completed!")
    print("\nTo run the full test suite:")
    print("  python test_anomaly_detector.py")
    print("\nTo run anomaly detection directly:")
    print("  python anomaly_detector.py input.csv output.csv")


if __name__ == "__main__":
    main()
