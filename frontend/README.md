# Anomaly Detection System - Frontend

A modern, responsive web interface for the Multivariate Time Series Anomaly Detection System built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 **Core Functionality**
- **File Upload**: Drag-and-drop CSV file upload with validation
- **Interactive Analysis**: Real-time anomaly detection with configurable parameters
- **Visual Analytics**: Interactive charts and data visualization
- **Results Export**: Download analysis results in CSV format

### 🎨 **User Interface**
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Charts**: Real-time anomaly score visualization with Recharts
- **Data Tables**: Sortable, searchable, and paginated results table
- **Progress Tracking**: Real-time progress indicators for long-running operations

### 📊 **Data Visualization**
- **Time Series Chart**: Interactive line chart showing anomaly scores over time
- **Score Distribution**: Visual breakdown of anomaly categories
- **Feature Attribution**: Top contributing features analysis
- **Training Period Validation**: Visual indicators for model validation

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with comprehensive interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Recharts**: Composable charting library for data visualization
- **React Dropzone**: Drag-and-drop file upload functionality
- **React Toastify**: Toast notifications for user feedback
- **Lucide React**: Beautiful, customizable icons

### Backend Integration
- **RESTful API**: Communication with Flask backend
- **Axios**: HTTP client for API requests
- **File Upload**: Multipart form data handling
- **Real-time Updates**: Progress tracking and status updates

## Project Structure

```
frontend/
├── public/
│   └── index.html              # Main HTML template
├── src/
│   ├── components/             # React components
│   │   ├── FileUpload.tsx      # File upload with drag-and-drop
│   │   ├── AnalysisSettings.tsx # Analysis parameter configuration
│   │   ├── ResultsSummary.tsx  # Analysis results overview
│   │   ├── AnomalyChart.tsx    # Interactive time series chart
│   │   └── DataTable.tsx       # Sortable results table
│   ├── services/
│   │   └── api.ts             # API service functions
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── App.tsx                # Main application component
│   ├── index.tsx              # Application entry point
│   └── index.css              # Global styles and Tailwind imports
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Installation

### Prerequisites
- Node.js 16+ and npm
- Backend API running (see backend README)

### Setup
1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API endpoint** (optional):
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000`

## Usage

### 1. Upload Data
- Drag and drop a CSV file onto the upload area
- Or click to browse and select a file
- Supported formats: CSV, XLS, XLSX (up to 50MB)

### 2. Configure Analysis
- **Contamination Rate**: Expected proportion of anomalies (1-50%)
- **Random State**: Seed for reproducible results
- **Quick Presets**: Pre-configured settings for common use cases

### 3. Run Analysis
- Click "Start Analysis" to begin processing
- Monitor progress with real-time updates
- View results in the interactive dashboard

### 4. Explore Results
- **Summary Dashboard**: Key statistics and metrics
- **Time Series Chart**: Interactive anomaly score visualization
- **Data Table**: Detailed results with sorting and filtering
- **Download Results**: Export analysis to CSV

## API Integration

### Endpoints
- `POST /api/upload` - Upload CSV file
- `POST /api/analyze` - Run anomaly detection analysis
- `GET /api/download/<filename>` - Download results
- `GET /api/info` - System information
- `GET /api/health` - Health check

### Data Flow
1. **File Upload**: Multipart form data to backend
2. **Analysis Request**: JSON payload with parameters
3. **Progress Tracking**: Real-time status updates
4. **Results Processing**: Structured data for visualization
5. **Export**: File download functionality

## Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Tailwind**: Utility-first CSS classes

### Component Architecture
- **Functional Components**: Modern React with hooks
- **Type Safety**: Comprehensive TypeScript interfaces
- **Props Validation**: Runtime and compile-time validation
- **Error Boundaries**: Graceful error handling

## Customization

### Styling
- **Tailwind Config**: Custom colors, spacing, and animations
- **Component Themes**: Consistent design system
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Ready for future implementation

### Charts
- **Recharts Configuration**: Customizable chart components
- **Color Schemes**: Semantic color coding for anomaly levels
- **Interactive Features**: Tooltips, zoom, and pan
- **Export Options**: Chart image export capability

### Data Processing
- **Real-time Updates**: WebSocket support for live data
- **Caching**: Client-side data caching
- **Pagination**: Efficient large dataset handling
- **Search & Filter**: Advanced data exploration

## Deployment

### Production Build
```bash
npm run build
```

### Static Hosting
The build output can be deployed to:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for open source

### Environment Configuration
```env
# Production API endpoint
REACT_APP_API_URL=https://your-api-domain.com

# Analytics (optional)
REACT_APP_GA_TRACKING_ID=GA-XXXXXXXXX
```

## Performance

### Optimization
- **Code Splitting**: Lazy loading of components
- **Bundle Analysis**: Webpack bundle optimization
- **Image Optimization**: Compressed assets
- **Caching**: Browser and CDN caching strategies

### Monitoring
- **Error Tracking**: Sentry integration ready
- **Performance Metrics**: Core Web Vitals monitoring
- **User Analytics**: Usage pattern analysis
- **API Monitoring**: Backend health checks

## Troubleshooting

### Common Issues
1. **API Connection**: Ensure backend is running on correct port
2. **File Upload**: Check file size and format restrictions
3. **CORS Errors**: Verify backend CORS configuration
4. **Build Errors**: Clear node_modules and reinstall dependencies

### Debug Mode
```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start
```

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Install dependencies
4. Make changes with tests
5. Submit pull request

### Code Standards
- **TypeScript**: Strict mode compliance
- **Testing**: Component and integration tests
- **Documentation**: JSDoc comments for functions
- **Accessibility**: WCAG 2.1 AA compliance

## License

This project is part of the Anomaly Detection System and follows the same license terms.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Open an issue on GitHub
4. Contact the development team
