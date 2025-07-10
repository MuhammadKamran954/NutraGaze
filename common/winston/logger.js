const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, './../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Helper to get the caller file and line number
function getCallerFileAndLine() {
    const originalStack = new Error().stack.split('\n');

    for (let i = 2; i < originalStack.length; i++) {
        const line = originalStack[i].trim();

        if (
            line.includes('node_modules') ||
            line.includes('(internal/') ||
            line.includes('bootstrap_node.js') ||
            line.includes('winston') ||
            line.includes('logform')
        ) {
            continue;
        }

        const match = line.match(/\(([^)]+)\)/) || line.match(/at (.+)/);
        if (match && match[1]) {
            return match[1];
        }
    }

    return 'unknown';
}

const baseLogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, caller }) => {
            return `${timestamp} [${level}] (${caller || 'unknown'}) - ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
            filename: path.join(logDir, '%DATE%-app.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'info'
        }),
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
    ]
});

function formatMsg(msg) {
    if (typeof msg === 'object') {
        return JSON.stringify(msg, null, 2); // Pretty print with indentation
    }
    return msg;
}const logger = {
    info: (msg) => baseLogger.info({ message: formatMsg(msg), caller: getCallerFileAndLine() }),
    warn: (msg) => baseLogger.warn({ message: formatMsg(msg), caller: getCallerFileAndLine() }),
    error: (msg) => baseLogger.error({ message: formatMsg(msg), caller: getCallerFileAndLine() }),
    debug: (msg) => baseLogger.debug({ message: formatMsg(msg), caller: getCallerFileAndLine() }),
};

module.exports = logger;
