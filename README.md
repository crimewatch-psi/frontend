# 🚨 CrimeWatch - Crime Analytics & Prediction System

A comprehensive web-based platform for crime data analysis, visualization, and AI-powered insights to support tourism safety and decision-making in Yogyakarta, Indonesia.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🎯 System Overview

CrimeWatch is designed to provide stakeholders with powerful tools for crime data analysis and visualization. The system serves five primary user types:

- **🌍 General Public/Tourists** - Access public heatmap and location-based AI recommendations (no login required)
- **👨‍💼 Government Officials (Pemerintah)** - Input and manage crime data
- **👮‍♂️ Police Officers (Polri)** - Input and manage crime data
- **🏨 Tourism Managers (Manajer Wisata)** - Access analytics and predictions
- **🔧 System Administrators** - Manage users and system configuration

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │   Login     │ │  Dashboard  │ │    Admin    │ │  Analytics  │ │
│  │   System    │ │   (Role-    │ │   Panel     │ │   & AI      │ │
│  │             │ │   Based)    │ │             │ │   Features  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    API Layer (Axios + Mock)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │    Auth     │ │    Data     │ │  Analytics  │ │    User     │ │
│  │     API     │ │ Management  │ │     API     │ │ Management  │ │
│  │             │ │     API     │ │             │ │     API     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                   Middleware & Security                         │
├─────────────────────────────────────────────────────────────────┤
│                        Data Layer                               │
│         (CSV Processing + Mock Database + AI Engine)            │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Core Features

### 1. 🔐 Authentication System

**Login Flow:**

- **Input**: Email and password
- **Process**: Role-based authentication with JWT tokens
- **Output**: User successfully logged in with appropriate permissions

```typescript
// Login Implementation
const loginData = {
  email: "admin@crimewatch.id",
  password: "admin123",
  role: "admin",
};

const result = await authApi.login(loginData);
// Redirects to role-appropriate dashboard
```

**Features:**

- Multi-role authentication (Admin, Government, Police, Tourism)
- JWT-based session management
- Secure password handling
- Role-based route protection
- Auto-logout on session expiry

---

### 2. 📊 Data Upload System

**CSV File Upload:**

- **Input**: Drag & drop CSV files containing crime statistics
- **Process**: System reads, validates, and saves data to database
- **Output**: Processed data available for analysis

```typescript
// Upload Implementation
const handleFileUpload = async (file: File) => {
  const result = await crimeDataApi.importData(file);
  // File processed and data stored
  console.log(`${result.data.recordsImported} records imported`);
};
```

**Features:**

- Drag & drop interface
- CSV format validation
- Real-time upload progress
- Data integrity checks
- Batch processing support
- Error handling and reporting

---

### 3. 🤖 AI Analytics Tab

**Intelligent Query System:**

- **Input**: Natural language queries (e.g., "location with the highest trend")
- **Process**: AI processes query and analyzes crime data patterns
- **Output**: Data-driven insights to help decision making

```typescript
// AI Query Implementation
const query = "location with the highest crime trend";
const insights = await analyticsApi.getPredictions({ query });
// Returns AI-generated insights and recommendations
```

**Features:**

- Natural language processing
- Trend analysis and predictions
- Risk assessment algorithms
- Decision support recommendations
- Historical pattern recognition
- Predictive modeling

---

### 4. 🗺️ Interactive Heatmap

**Location-Based Crime Visualization:**

- **Input**: Click on map location
- **Process**: Retrieve and aggregate crime data for selected area
- **Output**: Display detailed crime information and statistics

```typescript
// Heatmap Implementation
const handleLocationClick = async (coordinates: LatLng) => {
  const crimeData = await analyticsApi.getHeatmapData({
    lat: coordinates.lat,
    lng: coordinates.lng,
    radius: 1000, // meters
  });
  // Display crime statistics for selected area
};
```

**Features:**

- Real-time crime data overlay
- Interactive location selection
- Intensity-based color coding
- Zoom-level adaptive clustering
- Time-range filtering
- Multi-layered data visualization

---

### 5. 📈 Line Chart Analytics

**Crime Trend Visualization:**

- **Input**: Retrieve data from uploaded CSV files
- **Process**: Process temporal data and generate trend lines
- **Output**: Visualize crime trends over time periods

```typescript
// Line Chart Implementation
const chartData = await crimeDataApi.getCrimeData({
  dateRange: { start: "2024-01-01", end: "2024-12-31" },
  groupBy: "month",
  metrics: ["total_crimes", "severity_average"],
});
// Renders interactive line chart
```

**Features:**

- Time-series data visualization
- Multiple metric tracking
- Trend line calculations
- Period-over-period comparisons
- Interactive data points
- Export capabilities

---

### 6. 🥧 Pie Chart Distribution

**Crime Type Analysis:**

- **Input**: Retrieve categorized data from CSV files
- **Process**: Aggregate and categorize crime types
- **Output**: Visual breakdown of crime types distribution

```typescript
// Pie Chart Implementation
const pieData = await crimeDataApi.getCrimeData({
  groupBy: "crime_type",
  aggregation: "count",
  period: "last_year",
});
// Renders interactive pie chart with crime type distribution
```

**Features:**

- Crime type categorization
- Percentage distribution
- Interactive segments
- Color-coded categories
- Drill-down capabilities
- Comparative analysis

---

### 7. 📋 Data Table System

**Comprehensive Crime Database:**

- **Input**: Retrieve detailed data from CSV uploads
- **Process**: Format and organize crime records
- **Output**: Searchable table with crime descriptions and details

```typescript
// Table Implementation
const tableData = await crimeDataApi.getCrimeData({
  format: "detailed",
  includeDescriptions: true,
  pagination: { page: 1, limit: 50 },
});
// Renders searchable, sortable data table
```

**Features:**

- Searchable crime database
- Sortable columns
- Pagination support
- Detailed crime descriptions
- Filtering options
- Export functionality
- Real-time updates

## 💻 Technology Stack

### Frontend

- **Framework**: Next.js 15.3.3 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Charts**: Chart.js / Recharts (ready for implementation)
- **Maps**: Leaflet / Mapbox (ready for implementation)

### Backend (Mock Implementation)

- **API**: Mock services with axios interceptors
- **Authentication**: localStorage-based JWT simulation
- **Data Processing**: CSV parsing and processing utilities
- **AI/ML**: Mock prediction algorithms (ready for real AI integration)

### Development Tools

- **Package Manager**: npm
- **Build Tool**: Next.js built-in
- **Linting**: ESLint
- **Formatting**: Prettier (configured)
- **Version Control**: Git

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/crimewatch.git
cd crimewatch
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment setup**

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

4. **Run development server**

```bash
npm run dev
```

5. **Access the application**

```
http://localhost:3000
```

### Demo Accounts

```
Admin: admin@crimewatch.id / admin123
Government: gov@example.com / password123
Police: police@example.com / password123
Tourism: tourism@example.com / password123
```

## 🗺️ Frontend Page Flow

### 📊 Navigation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Landing Page (/)                           │
│                    [Hero + Features]                           │
└─────────────┬───────────────┬───────────────────────────────────┘
              │               │
              ▼               ▼
┌─────────────────────────┐   ┌─────────────────────────────────────┐
│    Public Access        │   │         Login Page (/login)         │
│   (No Login Required)   │   │      [Email + Password + Role]      │
└─────────────┬───────────┘   └─────┬───────┬───────┬───────────────┘
              │                     │       │       │       │
              ▼                     ▼       ▼       ▼       ▼
┌─────────────────────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────────┐
│   Public Heatmap        │   │  Admin  │ │  Gov    │ │ Police  │ │     Tourism         │
│   (/public-heatmap)     │   │Dashboard│ │Dashboard│ │Dashboard│ │     Dashboard       │
└─────────────┬───────────┘   │(/admin) │ │(/dash.) │ │(/dash.) │ │     (/dashboard)    │
              │               └─────────┘ └─────────┘ └─────────┘ └─────────────────────┘
              ▼                     │           │           │              │
┌─────────────────────────┐         ▼           ▼           ▼              ▼
│  AI Recommendations     │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────────┐
│  (/public-ai)           │   │  User   │ │  Data   │ │  Data   │ │    Analytics        │
│  [Location-based Tips]  │   │ Mgmt    │ │ Upload  │ │ Upload  │ │    & AI Hub         │
└─────────────────────────┘   └─────────┘ └─────────┘ └─────────┘ └─────────────────────┘
                                                                           │
                                                                           ▼
                                                                   ┌─────────────────────┐
                                                                   │  Heatmap ◄──────────┤
                                                                   │  Charts             │
                                                                   │  Reports            │
                                                                   │  AI Insights        │
                                                                   └─────────────────────┘
```

### 📄 Page-by-Page Breakdown

#### 1. 🏠 **Landing Page (`/`)**

**Purpose**: Public homepage showcasing system capabilities
**Content**:

- Hero section with system overview
- Feature highlights (heatmap, AI, analytics)
- Call-to-action for account access
- Navigation to login AND public features

**User Flow**:

```
Visit Site → View Features → Choose: "Login" OR "Public Access" → Redirect accordingly
```

**Navigation Options**:

- **Login** → `/login` (Professional users)
- **Public Heatmap** → `/public-heatmap` (General public/tourists)
- **AI Recommendations** → `/public-ai` (Location-based tips)

**Components**:

- `HeroSection` - Main banner with value proposition
- `FeaturesSection` - System capabilities overview
- `Header` - Navigation with login button + public access
- `Footer` - Contact and additional links

---

#### 2. 🗺️ **Public Heatmap (`/public-heatmap`)**

**Purpose**: Crime heatmap visualization for general public and tourists
**Access**: No login required - completely public

**Content**:

- Interactive crime heatmap by area
- Location-based crime statistics
- Safety level indicators
- Area-specific safety tips

**User Flow**:

```
Visit Heatmap → Select Area → View Crime Data → Get Safety Recommendations
```

**Features**:

- Real-time crime data visualization
- Click-to-explore area details
- Color-coded safety levels
- Tourist-friendly interface
- Mobile-responsive design

**Components**:

- Interactive map component
- Area information panels
- Safety level indicators
- Navigation breadcrumbs

---

#### 3. 🤖 **Public AI Recommendations (`/public-ai`)**

**Purpose**: AI-powered location recommendations for tourists
**Access**: No login required - completely public

**Content**:

- Location-based safety recommendations
- AI-generated travel tips
- Real-time safety alerts
- Alternative route suggestions

**User Flow**:

```
Enter/Select Location → AI Analysis → Safety Tips → Route Recommendations
```

**Features**:

- Natural language AI recommendations
- Location-specific safety advice
- Real-time safety updates
- Tourist-friendly suggestions
- Multi-language support (ready)

**Components**:

- Location input interface
- AI recommendation cards
- Safety alert banners
- Share functionality

---

#### 4. 🔐 **Login Page (`/login`)**

**Purpose**: User authentication and role selection
**Content**:

- Email/password input fields
- Role dropdown (Admin, Government, Police, Tourism)
- Demo account information
- Error handling and validation

**User Flow**:

```
Enter Credentials → Select Role → Submit → Role-based Redirect
```

**Redirect Logic**:

- `admin` → `/admin` (Admin Dashboard)
- `pemerintah` → `/dashboard` (Government Dashboard)
- `polri` → `/dashboard` (Police Dashboard)
- `manajer_wisata` → `/dashboard` (Tourism Dashboard)

**Components**:

- Login form with validation
- Role selector
- Demo credentials display
- Error message handling

---

#### 5. 👨‍💼 **Admin Dashboard (`/admin`)**

**Purpose**: System administration and user management
**Access**: Admin users only

**Content**:

- User statistics overview
- User management table
- Create new user functionality
- System health metrics

**User Flow**:

```
Login as Admin → View Stats → Manage Users → Create/Edit Users
```

**Features**:

- User CRUD operations
- Role-based user statistics
- Status management (active/inactive)
- Account creation workflow

**Components**:

- Statistics cards
- User management table
- Create user dialog
- Action buttons

---

#### 6. 📊 **Main Dashboard (`/dashboard`)**

**Purpose**: Role-specific data management and analytics
**Access**: Government, Police, Tourism users

**Content Varies by Role**:

##### 👨‍💼 **Government/Police View**:

- Data upload interface
- Recent uploads summary
- Data validation status
- Basic analytics overview

##### 🏨 **Tourism Manager View**:

- AI analytics interface
- Prediction summaries
- Heatmap quick access
- Report generation tools

**User Flow**:

```
Login → Dashboard → Access Role-specific Features → Navigate to Specialized Pages
```

---

#### 7. 📤 **Data Upload Page (`/upload`)**

**Purpose**: CSV file upload and data management
**Access**: Government and Police users only

**Content**:

- Drag & drop file interface
- Upload progress tracking
- Data validation results
- Upload history

**User Flow**:

```
Navigate from Dashboard → Drag CSV File → Validate → Confirm Upload → View Results
```

**Features**:

- File validation (format, size, content)
- Progress indicators
- Error reporting
- Success confirmation
- Batch upload support

**Components**:

- File dropzone
- Progress bar
- Validation feedback
- Upload history table

---

#### 8. 🤖 **AI Analytics Page (`/analytics`)**

**Purpose**: AI-powered insights and predictions
**Access**: Tourism managers and admins

**Content**:

- Natural language query interface
- AI-generated insights
- Prediction models
- Recommendation engine

**User Flow**:

```
Type Query → "location with highest trend" → AI Processing → View Insights → Export Results
```

**Features**:

- Text input for queries
- Real-time AI processing
- Insight visualization
- Downloadable reports
- Historical query log

**Components**:

- Query input interface
- Results display
- Insight cards
- Export controls

---

#### 9. 🗺️ **Heatmap Page (`/heatmap`)**

**Purpose**: Interactive crime data visualization
**Access**: Tourism managers and admins

**Content**:

- Interactive map interface
- Crime data overlay
- Location-specific details
- Filter controls

**User Flow**:

```
View Map → Click Location → View Crime Stats → Apply Filters → Analyze Patterns
```

**Features**:

- Clickable map regions
- Real-time data overlay
- Intensity-based visualization
- Time range filtering
- Layer management

**Components**:

- Map component (Leaflet/Mapbox)
- Filter sidebar
- Info panels
- Legend and controls

---

#### 10. 📈 **Charts & Analytics Page (`/charts`)**

**Purpose**: Data visualization with charts and graphs
**Access**: Tourism managers and admins

**Content**:

- Line charts for trends
- Pie charts for distributions
- Bar charts for comparisons
- Interactive controls

**User Flow**:

```
Select Chart Type → Configure Parameters → View Visualization → Export/Share
```

**Features**:

- Multiple chart types
- Interactive controls
- Data filtering
- Export capabilities
- Comparative analysis

**Components**:

- Chart containers
- Control panels
- Data selectors
- Export buttons

---

#### 11. 📋 **Data Table Page (`/data`)**

**Purpose**: Detailed crime data exploration
**Access**: All authenticated users (role-based filtering)

**Content**:

- Searchable data table
- Crime descriptions
- Sorting and filtering
- Pagination controls

**User Flow**:

```
Search/Filter Data → Sort Columns → View Details → Export Subset
```

**Features**:

- Advanced search
- Column sorting
- Row-level details
- Bulk operations
- Export functionality

**Components**:

- Data table with pagination
- Search interface
- Filter controls
- Detail modals

---

#### 12. 📊 **Reports Page (`/reports`)**

**Purpose**: Generate and manage reports
**Access**: Tourism managers and admins

**Content**:

- Report builder interface
- Template selection
- Scheduled reports
- Report history

**User Flow**:

```
Select Template → Configure Parameters → Generate → Download/Schedule
```

**Features**:

- Custom report builder
- Automated scheduling
- Multiple export formats
- Report templates
- Sharing capabilities

---

#### 13. 👤 **Profile Page (`/profile`)**

**Purpose**: User account management
**Access**: All authenticated users

**Content**:

- User information
- Password change
- Notification preferences
- Activity log

**User Flow**:

```
Access Profile → Update Information → Save Changes → View Activity
```

**Features**:

- Profile editing
- Security settings
- Preference management
- Activity tracking

---

### 🔄 **Navigation Patterns**

#### **Header Navigation**:

```
Logo | Dashboard | Analytics | Reports | Heatmap | Profile | Logout
```

#### **Sidebar Navigation** (Role-specific):

```
Admin: Users | System | Settings
Government/Police: Upload | Data | Analytics
Tourism: AI | Heatmap | Charts | Reports
```

#### **Breadcrumb Navigation**:

```
Dashboard > Analytics > AI Insights > Query Results
```

### 📱 **Responsive Design**

- **Desktop**: Full navigation and feature access
- **Tablet**: Collapsible sidebar, touch-optimized controls
- **Mobile**: Bottom navigation, simplified interface

## 📖 Usage Guide

### For General Public/Tourists (No Login Required)

1. **Visit Homepage** at `/` - Browse system features and capabilities
2. **Access Public Heatmap** at `/public-heatmap` - View crime heatmap by area
   - Click on any area to see crime statistics
   - View safety level indicators
   - Get area-specific safety recommendations
3. **AI Recommendations** at `/public-ai` - Get location-based safety tips
   - Enter or select your destination
   - Receive AI-powered safety recommendations
   - Get alternative route suggestions
   - Access real-time safety alerts
4. **No Registration Needed** - All public features are accessible without creating an account

### For Administrators

1. **Login** with admin credentials at `/login`
2. **Access Admin Dashboard** at `/admin`
3. **Manage Users** - Create, edit, and manage user accounts
4. **System Configuration** - Configure system settings and permissions
5. **Data Overview** - Monitor system usage and data quality

### For Government/Police Users

1. **Login** with respective credentials at `/login`
2. **Access Dashboard** at `/dashboard`
3. **Upload Data** at `/upload` - Drag and drop CSV files with crime statistics
4. **Data Management** at `/data` - Edit, validate, and organize crime records
5. **Basic Analytics** at `/analytics` - View uploaded data summaries

### For Tourism Managers

1. **Login** with tourism credentials at `/login`
2. **Access Dashboard** at `/dashboard`
3. **AI Analytics** at `/analytics` - Query the system for insights and predictions
4. **Heatmap Analysis** at `/heatmap` - Explore crime patterns by location
5. **Charts & Visualization** at `/charts` - View trends and distributions
6. **Reports** at `/reports` - Generate comprehensive crime trend reports
7. **Decision Support** - Access AI-powered recommendations

### Data Upload Format

```csv
date,location,crime_type,severity,description,coordinates
2024-01-15,Borobudur Temple,theft,medium,Tourist bag stolen,"-7.6079,110.2038"
2024-01-16,Malioboro Street,vandalism,low,Graffiti on wall,"-7.7956,110.3695"
```

## 🔗 API Documentation

### Authentication Endpoints

```typescript
POST / auth / login; // User login
POST / auth / logout; // User logout
GET / auth / verify; // Verify token
```

### Data Management Endpoints

```typescript
GET    /crime-data           // Retrieve crime data
POST   /crime-data           // Create crime record
PUT    /crime-data/:id       // Update crime record
DELETE /crime-data/:id       // Delete crime record
POST   /crime-data/import    // Upload CSV file
GET    /crime-data/export    // Export data
```

### Analytics Endpoints

```typescript
GET / analytics / dashboard; // Dashboard statistics
GET / analytics / predictions; // AI predictions
GET / analytics / heatmap; // Heatmap data
GET / analytics / trends; // Trend analysis
```

### Admin Endpoints

```typescript
GET    /admin/users         // Get all users
POST   /admin/users         // Create user
PUT    /admin/users/:id     // Update user
DELETE /admin/users/:id     // Delete user
```

## 🔄 Data Flow

```
CSV Upload → Data Validation → Database Storage → Processing → Analytics APIs → Frontend Visualization
     ↓              ↓               ↓              ↓              ↓               ↓
File Input → Format Check → Mock Storage → AI Analysis → Axios Calls → React Components
```

## 🚀 Future Enhancements

### Phase 1 - Core Features

- [ ] Real backend integration
- [ ] Advanced AI/ML algorithms
- [ ] Enhanced data visualization
- [ ] Mobile responsive design

### Phase 2 - Advanced Features

- [ ] Real-time data streaming
- [ ] Advanced predictive modeling
- [ ] Integration with external APIs
- [ ] Advanced user management

### Phase 3 - Scale & Performance

- [ ] Database optimization
- [ ] Caching strategies
- [ ] Load balancing
- [ ] Advanced security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- **Email**: support@crimewatch.id
- **Documentation**: [docs.crimewatch.id](https://docs.crimewatch.id)
- **Issues**: [GitHub Issues](https://github.com/yourusername/crimewatch/issues)

---

**Built with ❤️ for tourism safety in Yogyakarta, Indonesia**
