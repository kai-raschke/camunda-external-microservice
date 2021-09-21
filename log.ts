import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from "path";

export let log;

export function creatLogger() {
    let logPath = path.join(__dirname, 'logs');

    var transport = new (winston.transports.DailyRotateFile)({
        filename: 'application-%DATE%.log',
        dirname: logPath,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '15m',
        maxFiles: '7d'
    });

    // transport.on('rotate', function(oldFilename, newFilename) {
        // do something fun
    // });

    var winstonLogger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            transport
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        winstonLogger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    log = winstonLogger;
}
