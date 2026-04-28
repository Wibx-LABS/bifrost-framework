#!/bin/bash

# Bifrost Zero-Config Installer
# Designed for high-fidelity frontend orchestration

set -e

# Colors for professional output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ASCII Art
print_logo() {
    echo -e "${PURPLE}${BOLD}"
    echo "██████╗ ██╗███████╗██████╗  ██████╗ ███████╗████████╗"
    echo "██╔══██╗██║██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝"
    echo "██████╔╝██║█████╗  ██████╔╝██║   ██║███████╗   ██║"
    echo "██╔══██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║   ██║"
    echo "██████╔╝██║██║     ██║  ██║╚██████╔╝███████║   ██║"
    echo "╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝"
    echo -e "${NC}"
    echo -e "${BOLD}  WiBX Labs  |  Agentic Coding Framework  |  Installer${NC}"
    echo ""
}

print_logo
echo -e "${BOLD}Iniciando a instalação do Bifrost Framework...${NC}"
echo "------------------------------------------------"

# 1. Environment Detection
OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}" in
    Darwin)  PLATFORM="macos" ;;
    Linux)   PLATFORM="linux" ;;
    *)       echo -e "${RED}Erro: Sistema operacional não suportado: ${OS}${NC}"; exit 1 ;;
esac

case "${ARCH}" in
    x86_64) BIN_ARCH="x64" ;;
    arm64)  BIN_ARCH="arm64" ;;
    *)      echo -e "${RED}Erro: Arquitetura não suportada: ${ARCH}${NC}"; exit 1 ;;
esac

echo -e "${BLUE}[1/5]${NC} Detectado: ${BOLD}${PLATFORM} (${ARCH})${NC}"

# 2. Prepare Directory
BIFROST_HOME="$HOME/.bifrost-framework"
BIFROST_BIN_DIR="$BIFROST_HOME/bin"

if [ -d "$BIFROST_HOME" ]; then
    echo -e "${YELLOW}Atualizando instalação existente em $BIFROST_HOME...${NC}"
else
    echo -e "${BLUE}[2/5]${NC} Criando diretório base em $BIFROST_HOME..."
    mkdir -p "$BIFROST_HOME"
fi

# Clone repository for knowledge and templates
# We clone because Bifrost needs the raw markdown and template files to work
if [ -d "$BIFROST_HOME/.git" ]; then
    cd "$BIFROST_HOME" && git pull origin main
else
    git clone --depth 1 https://github.com/Wibx-LABS/bifrost-framework.git "$BIFROST_HOME"
fi

mkdir -p "$BIFROST_BIN_DIR"

# 3. Download Standalone Binary
BINARY_URL="https://github.com/Wibx-LABS/bifrost-framework/releases/latest/download/bifrost-${PLATFORM}-${BIN_ARCH}"
echo -e "${BLUE}[3/5]${NC} Baixando o binário executável..."

# Temporary fallback while first release is not out: 
# If the user has node, we could build it, but the goal is zero-config.
# For now, we attempt the download.
if ! curl -sL --fail -o "$BIFROST_BIN_DIR/bifrost" "$BINARY_URL"; then
    echo -e "${YELLOW}Aviso: Não foi possível baixar o binário pré-compilado.${NC}"
    echo -e "Tentando instalar via NPM (requer Node.js)..."
    if command -v npm >/dev/null 2>&1; then
        cd "$BIFROST_HOME/tools/bifrost-cli"
        npm install && npm run build
        ln -sf "$BIFROST_HOME/tools/bifrost-cli/bin/run.js" "$BIFROST_BIN_DIR/bifrost"
        chmod +x "$BIFROST_BIN_DIR/bifrost"
    else
        echo -e "${RED}Erro: Binário não encontrado e Node.js não instalado.${NC}"
        echo "Por favor, instale o Node.js ou aguarde o primeiro release oficial."
        exit 1
    fi
else
    chmod +x "$BIFROST_BIN_DIR/bifrost"
fi

# 4. Configuration
echo -e "${BLUE}[4/5]${NC} Configurando o ambiente..."

RC_FILE="$HOME/.bifrostrc.json"
cat > "$RC_FILE" <<EOF
{
  "bifrostFrameworkPath": "$BIFROST_HOME",
  "knowledgePath": "$BIFROST_HOME/knowledge",
  "defaultAutonomyLevel": "task-gated",
  "targetApps": []
}
EOF

# 5. Path Setup
SHELL_RC=""
if [[ "$SHELL" == */zsh ]]; then
    SHELL_RC="$HOME/.zshrc"
elif [[ "$SHELL" == */bash ]]; then
    if [ -f "$HOME/.bashrc" ]; then
        SHELL_RC="$HOME/.bashrc"
    else
        SHELL_RC="$HOME/.bash_profile"
    fi
fi

if [ -n "$SHELL_RC" ]; then
    if ! grep -q ".bifrost-framework/bin" "$SHELL_RC"; then
        echo -e "\n# Bifrost CLI\nexport PATH=\"\$HOME/.bifrost-framework/bin:\$PATH\"" >> "$SHELL_RC"
        echo -e "${GREEN}Sucesso: PATH adicionado ao seu $SHELL_RC${NC}"
    fi
else
    echo -e "${YELLOW}Aviso: Não foi possível detectar o seu shell. Por favor, adicione manualmente:${NC}"
    echo "export PATH=\"\$HOME/.bifrost-framework/bin:\$PATH\""
fi

echo "------------------------------------------------"
echo -e "${GREEN}${BOLD}Bifrost instalado com sucesso!${NC}"
echo ""
echo -e "Para começar, reinicie o seu terminal ou execute:"
echo -e "${CYAN}source $SHELL_RC${NC}"
echo ""
echo -e "Depois, execute seu primeiro comando:"
echo -e "${BOLD}bifrost init${NC}"
echo ""
