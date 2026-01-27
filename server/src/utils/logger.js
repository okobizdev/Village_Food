const colors = require("colors");

/**
 * Custom logger utility with colored output
 */
class Logger {
    static info(message, ...args) {
        console.log(colors.cyan(`[INFO] ${message}`), ...args);
    }

    static success(message, ...args) {
        console.log(colors.green(`[SUCCESS] ${message}`), ...args);
    }

    static warn(message, ...args) {
        console.warn(colors.yellow(`[WARNING] ${message}`), ...args);
    }

    static error(message, ...args) {
        console.error(colors.red(`[ERROR] ${message}`), ...args);
    }

    static debug(message, ...args) {
        if (process.env.NODE_ENV === "development") {
            console.log(colors.magenta(`[DEBUG] ${message}`), ...args);
        }
    }

    static http(message, ...args) {
        console.log(colors.blue(`[HTTP] ${message}`), ...args);
    }
}

module.exports = Logger;
