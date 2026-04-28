#!/bin/bash

# Bifrost Post-Merge Hook
# Automatically syncs the architecture graph after a merge

REPO_ROOT=$(git rev-parse --show-toplevel)

# We no longer sync an automated architecture graph because knowledge is manually maintained.
# This hook can be used for other post-merge validations in the future.
echo "[OK] Hook de post-merge do Bifrost executado. Lembre-se de atualizar o FRONTEND_REPOSITORY_MANUAL.md se necessário!"

exit 0
