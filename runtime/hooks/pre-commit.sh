#!/bin/bash

# Bifrost Pre-Commit Hook
# Validates STATE.md before allowing a commit

# Get the root of the repository
REPO_ROOT=$(git rev-parse --show-toplevel)
STATE_FILE="$REPO_ROOT/.bifrost/STATE.md"

# If no .bifrost directory, skip validation (might not be a Bifrost feature project)
if [ ! -d "$REPO_ROOT/.bifrost" ]; then
    exit 0
fi

if [ ! -f "$STATE_FILE" ]; then
    echo "[ERRO] .bifrost/STATE.md não encontrado, mas o diretório .bifrost existe."
    echo "Execute 'bifrost status' ou verifique a inicialização do seu projeto."
    exit 1
fi

echo "[🔍] Validando estado do Bifrost..."

# Use the runtime state manager to validate
# We'll use a small node script to perform the check
node -e "
const sm = require('$REPO_ROOT/runtime/state-manager.js');
try {
    const state = sm.loadState('$STATE_FILE');
    const errors = [];
    
    if (!state.id) errors.push('ID da funcionalidade ausente');
    if (!state.feature) errors.push('Nome da funcionalidade ausente');
    if (!state.status) errors.push('Status ausente');
    if (!sm.VALID_STATUSES.includes(state.status)) {
        errors.push('Status inválido: ' + state.status);
    }
    
    if (errors.length > 0) {
        console.error('[ERRO] Validação do STATE.md falhou:');
        errors.forEach(e => console.error('  - ' + e));
        process.exit(1);
    }
    
    console.log('[OK] STATE.md é válido (Status: ' + state.status + ')');
} catch (err) {
    console.error('[ERRO] Falha ao analisar STATE.md: ' + err.message);
    process.exit(1);
}
"

RESULT=$?

if [ $RESULT -ne 0 ]; then
    echo "[!] Commit abortado. Por favor, corrija o STATE.md e tente novamente."
    exit 1
fi

exit 0
