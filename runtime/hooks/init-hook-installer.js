#!/usr/bin/env node

/**
 * Bifrost Git Hook Installer
 * Automatically symlinks or copies runtime hooks into the target repository's .git/hooks directory.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const GIT_HOOKS_DIR = path.join(REPO_ROOT, '.git', 'hooks');
const BIFROST_HOOKS_DIR = path.join(__dirname);

if (!fs.existsSync(GIT_HOOKS_DIR)) {
    console.error('[ERRO] Diretório .git/hooks não encontrado. Você está na raiz de um repositório git?');
    process.exit(1);
}

const hooksToInstall = [
    { source: 'pre-commit.sh', target: 'pre-commit' },
    { source: 'post-merge.sh', target: 'post-merge' }
];

console.log('[...] Instalando git hooks do Bifrost...');

hooksToInstall.forEach(hook => {
    const sourcePath = path.join(BIFROST_HOOKS_DIR, hook.source);
    const targetPath = path.join(GIT_HOOKS_DIR, hook.target);

    try {
        if (fs.existsSync(targetPath)) {
            console.log(`[AVISO] Hook ${hook.target} já existe. Ignorando.`);
        } else {
            // Symlink to ensure updates to framework propagate
            fs.symlinkSync(sourcePath, targetPath);
            fs.chmodSync(targetPath, '755'); // Make executable
            console.log(`[OK] Hook ${hook.target} instalado.`);
        }
    } catch (error) {
        console.error(`[ERRO] Falha ao instalar ${hook.target}:`, error.message);
    }
});

console.log('[OK] Instalação de git hooks concluída!');
