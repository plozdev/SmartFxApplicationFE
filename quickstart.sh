#!/bin/bash
# SmartFX Quick Start Script
# Starts both backend and frontend services

set -e

echo "=========================================="
echo "  SmartFX Application - Quick Start"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Windows (Git Bash)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check Java (for backend only)
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_status "Java found: $JAVA_VERSION"
else
    print_error "Java not found. Please install Java 25+"
    exit 1
fi

echo ""
echo "Setup Options:"
echo "1) Start Frontend + Backend (Docker Compose)"
echo "2) Start Frontend Only"
echo "3) Start Backend Only"
echo "4) Install Dependencies"
echo ""
read -p "Select option (1-4): " option

case $option in
    1)
        echo ""
        print_info "Starting both services with Docker Compose..."
        echo ""
        
        if ! command -v docker &> /dev/null; then
            print_error "Docker not found. Please install Docker Desktop"
            exit 1
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            print_error "Docker Compose not found. Please install Docker Desktop"
            exit 1
        fi
        
        docker-compose up --build
        ;;
        
    2)
        echo ""
        print_info "Starting Frontend service..."
        echo ""
        
        # Check if .env exists
        if [ ! -f .env ]; then
            print_info "Creating .env file from .env.example..."
            cp .env.example .env
        fi
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            print_info "Installing dependencies..."
            npm install
        fi
        
        print_status "Starting frontend on http://localhost:3000"
        echo ""
        print_info "Make sure backend is running on http://localhost:8080"
        echo ""
        
        npm run dev
        ;;
        
    3)
        echo ""
        print_info "Starting Backend service..."
        echo ""
        
        BACKEND_PATH="../SmartFXApplication"
        
        if [ ! -d "$BACKEND_PATH" ]; then
            print_error "Backend directory not found at: $BACKEND_PATH"
            echo "Please ensure backend is at: D:\SpringProjects\SmartFXApplication"
            exit 1
        fi
        
        cd "$BACKEND_PATH"
        
        print_status "Starting backend on http://localhost:8080"
        echo ""
        print_info "API Docs available at: http://localhost:8080/swagger-ui.html"
        echo ""
        
        # Check for Maven wrapper
        if [ -f "mvnw" ]; then
            if [ "$IS_WINDOWS" = true ]; then
                ./mvnw.cmd spring-boot:run
            else
                ./mvnw spring-boot:run
            fi
        else
            mvn spring-boot:run
        fi
        ;;
        
    4)
        echo ""
        print_info "Installing Frontend dependencies..."
        echo ""
        npm install
        print_status "Dependencies installed"
        echo ""
        print_info "Run 'npm run dev' to start frontend"
        ;;
        
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac
