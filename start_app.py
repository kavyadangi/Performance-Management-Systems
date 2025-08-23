#!/usr/bin/env python3
"""
Startup Script for Anomaly Detection System

This script starts both the Flask backend API and provides instructions
for starting the React frontend.
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed."""
    print("🔍 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import flask
        import pandas
        import numpy
        import sklearn
        print("✅ Python dependencies are installed")
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False
    
    # Check if Node.js is installed
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js is installed: {result.stdout.strip()}")
        else:
            print("❌ Node.js is not installed")
            return False
    except FileNotFoundError:
        print("❌ Node.js is not installed")
        return False
    
    # Check if npm is installed
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm is installed: {result.stdout.strip()}")
        else:
            print("❌ npm is not installed")
            return False
    except FileNotFoundError:
        print("❌ npm is not installed")
        return False
    
    return True

def install_frontend_dependencies():
    """Install frontend dependencies if needed."""
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("📦 Installing frontend dependencies...")
        try:
            subprocess.run(['npm', 'install'], cwd=frontend_dir, check=True)
            print("✅ Frontend dependencies installed")
        except subprocess.CalledProcessError:
            print("❌ Failed to install frontend dependencies")
            return False
    else:
        print("✅ Frontend dependencies already installed")
    
    return True

def start_backend():
    """Start the Flask backend server."""
    print("🚀 Starting Flask backend server...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return None
    
    # Install backend dependencies if needed
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'backend/requirements.txt'], check=True)
        print("✅ Backend dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install backend dependencies")
        return None
    
    # Start backend server
    try:
        backend_process = subprocess.Popen([
            sys.executable, 'backend/app.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        # Wait a moment for server to start
        time.sleep(3)
        
        if backend_process.poll() is None:
            print("✅ Backend server started on http://localhost:5000")
            return backend_process
        else:
            stdout, stderr = backend_process.communicate()
            print(f"❌ Backend server failed to start: {stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None

def start_frontend():
    """Start the React frontend development server."""
    print("🚀 Starting React frontend server...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return None
    
    try:
        frontend_process = subprocess.Popen([
            'npm', 'start'
        ], cwd=frontend_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        # Wait a moment for server to start
        time.sleep(5)
        
        if frontend_process.poll() is None:
            print("✅ Frontend server started on http://localhost:3000")
            return frontend_process
        else:
            stdout, stderr = frontend_process.communicate()
            print(f"❌ Frontend server failed to start: {stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def main():
    """Main startup function."""
    print("=" * 60)
    print("🔍 ANOMALY DETECTION SYSTEM - STARTUP")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Dependency check failed. Please install missing dependencies.")
        return
    
    # Install frontend dependencies
    if not install_frontend_dependencies():
        print("\n❌ Frontend setup failed.")
        return
    
    print("\n" + "=" * 60)
    print("🚀 STARTING SERVICES")
    print("=" * 60)
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("\n❌ Failed to start backend server.")
        return
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("\n❌ Failed to start frontend server.")
        backend_process.terminate()
        return
    
    print("\n" + "=" * 60)
    print("✅ SYSTEM STARTED SUCCESSFULLY!")
    print("=" * 60)
    print("🌐 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:5000")
    print("📊 Health Check: http://localhost:5000/api/health")
    print("\n💡 Usage:")
    print("   1. Open http://localhost:3000 in your browser")
    print("   2. Upload your CSV file")
    print("   3. Configure analysis parameters")
    print("   4. Run anomaly detection")
    print("   5. Explore results and download")
    
    # Open browser
    try:
        webbrowser.open('http://localhost:3000')
        print("\n🌐 Browser opened automatically")
    except:
        print("\n🌐 Please open http://localhost:3000 in your browser")
    
    print("\n" + "=" * 60)
    print("🛑 To stop the system, press Ctrl+C")
    print("=" * 60)
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
            
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("\n❌ Backend server stopped unexpectedly")
                break
                
            if frontend_process.poll() is not None:
                print("\n❌ Frontend server stopped unexpectedly")
                break
                
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down services...")
        
        # Terminate processes
        if backend_process:
            backend_process.terminate()
            print("✅ Backend server stopped")
            
        if frontend_process:
            frontend_process.terminate()
            print("✅ Frontend server stopped")
            
        print("👋 Goodbye!")

if __name__ == "__main__":
    main()
