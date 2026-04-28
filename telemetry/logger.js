/**
 * Bifrost Standardized Logger
 * Provides consistent formatting for CLI output and telemetry logging.
 */

function info(message) {
    console.log(`[INFO] [BIFROST] ${message}`);
}

function success(message) {
    console.log(`[OK] [BIFROST] ${message}`);
}

function warn(message) {
    console.warn(`[AVISO] [BIFROST] ${message}`);
}

function error(message, err = null) {
    console.error(`[ERRO] [BIFROST] ${message}`);
    if (err) {
        console.error(err);
    }
}

function track(event, data = {}) {
    // In the future, this could write to a central metrics file
    // For now, it just logs telemetry events silently or to debug
    if (process.env.BIFROST_DEBUG) {
        console.log(`[TELEMETRIA] [TELEMETRY] ${event}`, data);
    }
}

module.exports = {
    info,
    success,
    warn,
    error,
    track
};
