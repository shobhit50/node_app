const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app.log' })
    ]
});

module.exports = logger;
