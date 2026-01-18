#!/bin/bash

# ============================================================================
# Environment Setup Script for Phase-2
# ============================================================================
# This script helps you set up .env files for backend and frontend
# Usage: bash setup-env.sh
# ============================================================================

set -e  # Exit on error

echo "======================================"
echo "Phase-2 Environment Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# Step 1: Check if we're in the correct directory
# ============================================================================
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: Please run this script from the phase-2 directory${NC}"
    echo "Usage: cd phase-2 && bash setup-env.sh"
    exit 1
fi

echo -e "${GREEN}✓ Current directory verified${NC}"
echo ""

# ============================================================================
# Step 2: Backend .env Setup
# ============================================================================
echo "============================================"
echo "Step 1: Backend Environment Setup"
echo "============================================"
echo ""

if [ -f "backend/.env" ]; then
    echo -e "${YELLOW}Warning: backend/.env already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping backend .env creation"
    else
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✓ backend/.env created from .env.example${NC}"
    fi
else
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ backend/.env created from .env.example${NC}"
fi

echo ""

# ============================================================================
# Step 3: Generate JWT Secret Key
# ============================================================================
echo "============================================"
echo "Step 2: Generate JWT Secret Key"
echo "============================================"
echo ""

echo "Generating secure JWT secret key..."
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))" 2>/dev/null || openssl rand -base64 32)

if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}Error: Could not generate JWT secret key${NC}"
    echo "Please install Python 3 or OpenSSL"
    exit 1
fi

echo -e "${GREEN}✓ JWT Secret Key generated:${NC}"
echo "$JWT_SECRET"
echo ""

# Update JWT_SECRET_KEY in backend/.env
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|JWT_SECRET_KEY=.*|JWT_SECRET_KEY=$JWT_SECRET|g" backend/.env
else
    # Linux
    sed -i "s|JWT_SECRET_KEY=.*|JWT_SECRET_KEY=$JWT_SECRET|g" backend/.env
fi

echo -e "${GREEN}✓ JWT_SECRET_KEY updated in backend/.env${NC}"
echo ""

# ============================================================================
# Step 4: Frontend .env Setup
# ============================================================================
echo "============================================"
echo "Step 3: Frontend Environment Setup"
echo "============================================"
echo ""

if [ -f "frontend/.env" ]; then
    echo -e "${YELLOW}Warning: frontend/.env already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping frontend .env creation"
    else
        cp frontend/.env.example frontend/.env
        echo -e "${GREEN}✓ frontend/.env created from .env.example${NC}"
    fi
else
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ frontend/.env created from .env.example${NC}"
fi

echo ""

# ============================================================================
# Step 5: Verify Setup
# ============================================================================
echo "============================================"
echo "Step 4: Verification"
echo "============================================"
echo ""

# Check backend .env
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ backend/.env exists${NC}"

    # Check if JWT_SECRET_KEY is set and not the example value
    if grep -q "JWT_SECRET_KEY=$JWT_SECRET" backend/.env; then
        echo -e "${GREEN}✓ JWT_SECRET_KEY is configured${NC}"
    else
        echo -e "${YELLOW}⚠ JWT_SECRET_KEY may need manual update${NC}"
    fi

    # Check DATABASE_URL
    if grep -q "DATABASE_URL=" backend/.env; then
        echo -e "${GREEN}✓ DATABASE_URL is configured${NC}"
    else
        echo -e "${RED}✗ DATABASE_URL is missing${NC}"
    fi
else
    echo -e "${RED}✗ backend/.env not found${NC}"
fi

echo ""

# Check frontend .env
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓ frontend/.env exists${NC}"

    # Check VITE_API_URL
    if grep -q "VITE_API_URL=" frontend/.env; then
        echo -e "${GREEN}✓ VITE_API_URL is configured${NC}"
    else
        echo -e "${RED}✗ VITE_API_URL is missing${NC}"
    fi
else
    echo -e "${RED}✗ frontend/.env not found${NC}"
fi

echo ""

# ============================================================================
# Step 6: Display Summary
# ============================================================================
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Environment files created:"
echo "  ✓ backend/.env"
echo "  ✓ frontend/.env"
echo ""
echo "Generated JWT Secret Key:"
echo "  $JWT_SECRET"
echo ""
echo -e "${YELLOW}Important Security Notes:${NC}"
echo "  1. Never commit .env files to Git"
echo "  2. Keep your JWT_SECRET_KEY secure"
echo "  3. Change default database password for production"
echo "  4. Set DEBUG=false in production"
echo ""
echo "Next Steps:"
echo "  1. Review backend/.env and update if needed"
echo "  2. Review frontend/.env and update if needed"
echo "  3. Start services with: docker-compose up -d"
echo "  4. Run migrations: docker-compose exec backend alembic upgrade head"
echo ""
echo "For detailed instructions, see: ENV_SETUP_GUIDE.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
