
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${JSON.stringify(meta)}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console()
  ]
});

export function log(level: string, message: string, meta: object = {}) {
  logger.log(level, message, meta);
}

export function info(message: string, meta: object = {}) {
  log('info', message, meta);
}

export function error(message: string, meta: object = {}) {
  log('error', message, meta);
}
                