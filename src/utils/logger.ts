import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // colors in terminal
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss', // proper timestamp
      ignore: 'pid,hostname', // remove extra fields
    },
  },
  base: {}, // remove pid & hostname from logs
});

export default logger;
