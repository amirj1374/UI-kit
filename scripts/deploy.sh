#!/bin/bash

# Samap Three Environment Deployment Script
# Usage: ./scripts/deploy.sh [environment] [action]

ENVIRONMENT=${1:-dev}
ACTION=${2:-deploy}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment configuration - All environments use port 5050
declare -A ENV_CONFIGS
ENV_CONFIGS[dev]="5050"
ENV_CONFIGS[prelive]="5050"
ENV_CONFIGS[live]="5050"

echo -e "${BLUE}🚀 Samap Three Environment Deployment Script${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Action: $ACTION${NC}"
echo ""

# Validate environment
if [[ ! "${!ENV_CONFIGS[@]}" =~ "$ENVIRONMENT" ]]; then
    echo -e "${RED}❌ Invalid environment. Use: dev, prelive, or live${NC}"
    exit 1
fi

# Get port for environment (always 5050)
PORT=${ENV_CONFIGS[$ENVIRONMENT]}

case $ACTION in
    "dev")
        echo -e "${GREEN}🌍 Starting development server for $ENVIRONMENT...${NC}"
        yarn dev --mode $ENVIRONMENT
        ;;
        
    "build")
        echo -e "${GREEN}🔨 Building for $ENVIRONMENT...${NC}"
        yarn build:$ENVIRONMENT
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Build completed successfully!${NC}"
            echo -e "${BLUE}📁 Build output: dist/${NC}"
        else
            echo -e "${RED}❌ Build failed!${NC}"
            exit 1
        fi
        ;;
        
    "preview")
        echo -e "${GREEN}🌐 Starting preview server for $ENVIRONMENT on port $PORT...${NC}"
        yarn preview:$ENVIRONMENT
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Preview server started successfully!${NC}"
            echo -e "${BLUE}🌐 Access your application at: http://localhost:$PORT${NC}"
        else
            echo -e "${RED}❌ Preview server failed to start!${NC}"
            exit 1
        fi
        ;;
        
    "build-and-preview")
        echo -e "${GREEN}🔨 Building and previewing for $ENVIRONMENT...${NC}"
        
        # Build
        yarn build:$ENVIRONMENT
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Build failed!${NC}"
            exit 1
        fi
        
        # Preview
        echo -e "${GREEN}🌐 Starting preview server...${NC}"
        yarn preview:$ENVIRONMENT
        ;;
        
    "clean")
        echo -e "${GREEN}🧹 Cleaning build directory...${NC}"
        rm -rf dist/
        echo -e "${GREEN}✅ Clean completed!${NC}"
        ;;
        
    "info")
        echo -e "${GREEN}📋 Environment Information:${NC}"
        echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
        echo -e "${YELLOW}Port: $PORT${NC}"
        echo -e "${YELLOW}Build Command: yarn build:$ENVIRONMENT${NC}"
        echo -e "${YELLOW}Dev Command: yarn dev --mode $ENVIRONMENT${NC}"
        echo -e "${YELLOW}Preview Command: yarn preview:$ENVIRONMENT${NC}"
        echo ""
        echo -e "${BLUE}Available Commands:${NC}"
        echo "  dev                    - Start development server"
        echo "  build                  - Build for environment"
        echo "  preview                - Start preview server"
        echo "  build-and-preview      - Build and preview"
        echo "  clean                  - Clean build directory"
        echo "  info                   - Show environment info"
        ;;
        
    *)
        echo -e "${RED}❌ Unknown action: $ACTION${NC}"
        echo -e "${YELLOW}Available actions:${NC}"
        echo "  dev                    - Start development server"
        echo "  build                  - Build for environment"
        echo "  preview                - Start preview server"
        echo "  build-and-preview      - Build and preview"
        echo "  clean                  - Clean build directory"
        echo "  info                   - Show environment info"
        echo ""
        echo -e "${YELLOW}Usage examples:${NC}"
        echo "  ./scripts/deploy.sh dev dev"
        echo "  ./scripts/deploy.sh prelive build"
        echo "  ./scripts/deploy.sh live build-and-preview"
        echo "  ./scripts/deploy.sh dev info"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment script completed!${NC}"
