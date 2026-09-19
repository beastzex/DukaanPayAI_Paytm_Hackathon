import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, service, correlationId, ...meta }) => {
  return `[${timestamp}] [${service || 'service'}] [${correlationId || 'no-trace'}] ${level}: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ''
  }`;
});

export const createServiceLogger = (serviceName: string) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return winston.createLogger({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    defaultMeta: { service: serviceName },
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      isProduction ? json() : combine(colorize(), customFormat)
    ),
    transports: [
      new winston.transports.Console(),
      ...(isProduction
        ? [
            new winston.transports.File({ filename: `logs/${serviceName}-error.log`, level: 'error' }),
            new winston.transports.File({ filename: `logs/${serviceName}-combined.log` }),
          ]
        : []),
    ],
  });
};
