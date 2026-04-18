# SmartFX - Currency Exchange & Arbitrage Detection

A full-stack application that finds optimal currency exchange paths and detects arbitrage opportunities in real-time. Built with React (Frontend) + Spring Boot (Backend).

## 🌐 Live Environment
- **Frontend (GitHub Pages):** [https://plozdev.github.io/SmartFxApplicationFE/](https://plozdev.github.io/SmartFxApplicationFE/)

## Project Overview

**SmartFX** helps users:
- Find the best currency exchange rates across multiple currencies
- Discover optimal multi-hop exchange paths (e.g., USD → EUR → JPY)
- Detect profitable arbitrage opportunities in real-time
- Support 40+ global currencies with live rate updates

### Architecture

```
┌─────────────────────────────────────────────────┐
│            SmartFX Frontend (React)             │
│  - Currency exchange calculator                 │
│  - Real-time path visualization                 │
│  - Arbitrage notifications                      │
│  - Port: 3000                                   │
└──────────────────┬──────────────────────────────┘
                   │ HTTP/CORS
                   ▼
┌─────────────────────────────────────────────────┐
│         SmartFX Backend (Spring Boot)           │
│  - SPFA algorithm for optimal paths             │
│  - Real-time rate ingestion (FastForex API)    │
│  - Arbitrage detection engine                   │
│  - Port: 8080                                   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
         FastForex API (40+ currencies)
```

## Quick Start

### Prerequisites
- **Node.js** v18+
- **npm** or **yarn**
- **SmartFX Backend** running on `http://localhost:8080`
  - See [Backend Setup](https://github.com/plozdev/SmartFXApplication#quick-start)

### Setup Frontend

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   → Frontend available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

## What's Inside

### Frontend Structure
```
src/
├── components/
│   └── layout/           # Navbar, Footer
├── pages/
│   ├── DemoPage.tsx      # Arbitrage demo & testing
│   └── ExchangePage.tsx  # Main exchange calculator
├── services/
│   └── api.ts            # Backend API client
├── store/
│   └── useSmartFXStore.ts # Zustand state management
├── lib/
│   └── utils.ts          # Utility functions
└── App.tsx               # Main app component
```

### Key Features
- **Exchange Calculator** - Find best rates between any two currencies
- **Path Visualization** - See the exchange route taken
- **Arbitrage Detection** - Alerts when profitable cycles are found
- **Real-time Updates** - Rates refresh every 30 seconds
- **Responsive Design** - Works on desktop, tablet, mobile

## 🔗 Backend Integration

The frontend communicates with the backend via REST API:

### API Endpoints

**Find Exchange Path**
```bash
GET /api/v1/exchange?from=USD&to=VND&amount=1000
```

Response:
```json
{
  "from": "USD",
  "to": "VND",
  "initialAmount": 1000,
  "finalAmount": 24500000.50,
  "effectiveRate": 24500.00050,
  "path": ["USD", "VND"]
}
```

**Get Available Currencies**
```bash
GET /api/v1/currencies
```

Response: `["USD", "EUR", "GBP", "JPY", ...]`

**Demo: Inject Arbitrage** (for testing)
```bash
POST /api/v1/demo/inject-arbitrage?from=JPY&to=USD&rate=0.0082
```

For full API documentation, see [Backend README](https://github.com/plozdev/SmartFXApplication/blob/main/README.md)

## Docker & Docker Compose

### Using Docker
```bash
docker build -t smartfx-frontend .
docker run -p 3000:3000 -e VITE_BACKEND_URL=http://localhost:8080 smartfx-frontend
```

### Using Docker Compose (Full Stack)
```bash
docker-compose up
```

This starts:
- Frontend at `http://localhost:3000`
- Backend at `http://localhost:8080`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BACKEND_URL` | `http://localhost:8080` | Backend API URL |
| `PORT` | `3000` | Frontend server port |

### Local Development
Create `.env.local`:
```bash
VITE_BACKEND_URL=http://localhost:8080
PORT=3000
```

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend Framework | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite 6 |
| HTTP Client | Axios |
| State Management | Zustand |
| Animations | Motion (Framer Motion alternative) |
| Backend | Spring Boot 4.0.5 |
| Algorithm | SPFA (Bellman-Ford variant) |

## Development

### Available Scripts
```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
npm run start     # Start production server
npm run preview   # Preview production build locally
npm run clean     # Remove dist folder
npm run lint      # Type check with TypeScript
```

### API Client Setup
See [src/services/api.ts](src/services/api.ts) for Axios configuration and backend communication.

### State Management
Global state managed in [src/store/useSmartFXStore.ts](src/store/useSmartFXStore.ts) using Zustand.

## Screenshots

### 1. Normal Exchange Flow
<div align='center'>
<img width="1919" height="928" alt="case 1" src="https://github.com/user-attachments/assets/9c775422-03b3-4735-9b86-e0d16eade4e0" />
</div>

**What you see:**
- **Currency Swap**: Configure send amount (1000 USD) and receive currency (EUR)
- **Optimal Route**: Empty state waiting for execution
- **Quick Actions**: Preset currency pairs (USD/JPY, EUR/GBP) for testing
- **Recent Activity**: Shows successful past exchanges (USD→JPY, GBP→EUR, EUR→USD)
- **Market Pulse**: Live detection status showing system is active

### 2. Arbitrage Detection - Injected Cycle
<div align='center'>
  <img width="1919" height="928" alt="case 3" src="https://github.com/user-attachments/assets/9fcd937e-d42a-4130-9078-b6a177a56d49" />
</div>

**After injecting profitable cycle via Demo Page:**
- System detects negative cycle (arbitrage opportunity)
- Alert displays: `Arbitrage Detected! Cycle: USD → EUR → JPY → USD`
- Shows potential profit percentage
- Recent Activity marks attempt as `ARBITRAGE` instead of `SUCCESS`
- This demonstrates real-time arbitrage detection engine working

## Testing the System

### 1. Start Backend
```bash
cd ../SmartFXApplication
mvn spring-boot:run
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test Exchange Path
- Go to **Exchange** page
- Enter: From=USD, To=EUR, Amount=1000
- See optimal path and calculated rate
- Check "Recent Activity" updates

### 4. Test Arbitrage Detection (Demo Page)
- Click **Demo Testing** tab
- Click "Reset" to clean rates
- Try normal exchange (should succeed)
- Click "Inject Arbitrage" to create profitable cycle
- Execute exchange again - see arbitrage detection alert
- Check for cycle details in alert message

## Deployment

### Cloud Build (CI/CD)
The project includes Cloud Build configuration:
- [cloudbuild.yaml](cloudbuild.yaml) - Build pipeline
- Triggered on push to main branch
- Automatically builds and deploys Docker image

### Manual Deployment
```bash
# Build production image
docker build -t smartfx-frontend:latest .

# Push to registry
docker push your-registry/smartfx-frontend:latest

# Deploy (e.g., Cloud Run, Kubernetes)
```

## Documentation

- **Backend Documentation**: [SmartFXApplication README](https://github.com/plozdev/SmartFXApplication#readme)
- **API Docs**: Run backend and visit `http://localhost:8080/swagger-ui.html`
- **Algorithm Details**: See [Backend SPFA Implementation](https://github.com/plozdev/SmartFXApplication#how-it-works)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Related Repositories

- **Backend**: [SmartFXApplication](https://github.com/plozdev/SmartFXApplication)
- **Frontend**: [SmartFxApplicationFE](https://github.com/plozdev/SmartFxApplicationFE)

## License

This project is open source and available under the MIT License.

## Troubleshooting

### Frontend won't connect to backend
- Verify backend is running on `http://localhost:8080`
- Check `VITE_BACKEND_URL` environment variable
- Check browser console for CORS errors

### "No path found" error
- This is normal - backend has limited currency pairs in demo
- Try common pairs like USD→EUR, EUR→GBP
- Use Demo page to inject test arbitrage

### Slow response times
- Backend performs graph calculations (5-10ms typical)
- Rates update every 30 seconds from FastForex
- First request may be slower due to JVM startup

## Next Steps

1. **Explore the code** - Start with [App.tsx](src/App.tsx)
2. **Read backend docs** - Understand the SPFA algorithm
3. **Customize UI** - Modify components in [src/pages/](src/pages/)
4. **Add features** - Currency charts, historical rates, notifications
5. **Deploy** - Use docker-compose or Cloud Build

4. Open the app in your browser and ensure:
   - The backend API is running on `http://localhost:8080`
   - Currencies dropdown loads successfully
   - Exchange requests return data from the backend

### Backend Integration

This frontend connects to the **SmartFX Backend** API:
- **Backend Location**: `D:\SpringProjects\SmartFXApplication`
- **API Base URL**: `http://localhost:8080/api/v1`
- **API Endpoints**:
  - `GET /api/v1/currencies` - Get available currencies
  - `GET /api/v1/exchange?from=USD&to=EUR&amount=100` - Perform currency exchange
  - `POST /api/v1/demo/reset` - Reset demo data
  - `POST /api/v1/demo/inject-arbitrage` - Inject arbitrage for testing

### Troubleshooting

**Frontend can't connect to backend:**
- Ensure backend is running on port 8080
- Check `VITE_BACKEND_URL` in `.env` file
- Verify CORS is enabled on backend (should be by default)

**API requests failing:**
- Check browser console (F12) for error messages
- Verify backend logs for detailed errors
- Ensure environment variables are properly set

### Build for Production

```bash
npm run build
npm start
```
#
