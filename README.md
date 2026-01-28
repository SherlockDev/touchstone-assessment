# Black-Scholes Options Pricing Calculator

A full-stack web application for calculating Black-Scholes option prices with dividend yields. Built with React + TypeScript frontend, Python FastAPI backend, and SQLite database.

## Features

- **Interactive Calculator**: User-friendly form to input option parameters
- **Real-time Calculations**: Calculate call and put option prices using the Black-Scholes model
- **Dividend Yield Support**: Incorporates dividend yields into pricing calculations
- **Calculation History**: View and manage all previous calculations
- **Persistent Storage**: SQLite database stores all calculations with timestamps
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **RESTful API**: Well-documented API endpoints for integration

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

### Backend
- **Python 3.9+** - Programming language
- **FastAPI** - Modern web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **Custom Math Implementation** - Normal distribution functions (Abramowitz & Stegun approximation)

### Database
- **SQLite** - Lightweight embedded database

## Project Structure

```
Touchstone assessment/
├── backend/
│   ├── main.py                 # FastAPI application and routes
│   ├── black_scholes.py        # Black-Scholes calculation logic
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic schemas
│   ├── requirements.txt        # Python dependencies
│   └── black_scholes.db        # SQLite database (created on first run)
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── CalculatorForm.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── HistoryTable.tsx
│   │   ├── App.tsx             # Main application component
│   │   ├── api.ts              # API service layer
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── main.tsx            # Application entry point
│   ├── package.json            # Node dependencies
│   └── vite.config.ts          # Vite configuration
└── README.md                   # This file
```

## Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.9 or higher**: [Download Python](https://www.python.org/downloads/)
- **Node.js 18 or higher**: [Download Node.js](https://nodejs.org/)
- **npm or yarn**: Comes with Node.js

Verify installations:
```bash
python --version
node --version
npm --version
```

## Installation

### 1. Clone the Repository

```bash
cd "c:\Users\rossh\OneDrive\Documents\Ross Projects\Touchstone assessment"
```

### 2. Backend Setup

Navigate to the backend directory and install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

**Note for Windows users**: If you encounter issues, you may need to use:
```bash
python -m pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory and install Node dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

You'll need two terminal windows - one for the backend and one for the frontend.

### Terminal 1: Start the Backend Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`

**API Documentation** (automatically generated):
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Terminal 2: Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend application will be available at: `http://localhost:3000`

### Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## Assumptions

### Technical Assumptions
1. **European Options**: The model calculates prices for European-style options (can only be exercised at expiration)
2. **Constant Volatility**: Assumes volatility remains constant throughout the option's life
3. **Constant Risk-Free Rate**: Risk-free rate is assumed constant
4. **No Transaction Costs**: Model does not account for trading fees or taxes
5. **Continuous Dividend Yield**: Dividends are paid continuously at a constant rate
6. **Log-Normal Distribution**: Stock prices follow a log-normal distribution
7. **No Arbitrage**: Markets are efficient with no arbitrage opportunities

### Implementation Assumptions
1. **SQLite Database**: Using SQLite for simplicity; production use should consider PostgreSQL
2. **Local Development**: Application designed for local development; CORS is configured for localhost
3. **Input Validation**: All inputs are validated on both frontend and backend
4. **Time Units**: Time to maturity is expressed in years (0.5 = 6 months, 1 = 1 year)
5. **Decimal Format**: Rates and volatility are expressed as decimals (not percentages)
