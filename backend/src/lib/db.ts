import { PrismaClient } from '@prisma/client'
import logger from '../config/logger.config';

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

// Log Prisma events
(prisma as any).$on('query', (e: any) => {
  logger.debug('Database query:', {
    query: e.query,
    params: e.params,
    duration: `${e.duration}ms`,
  });
});

(prisma as any).$on('error', (e: any) => {
  logger.error('Database error:', {
    error: e.message,
    target: e.target,
  });
});

(prisma as any).$on('info', (e: any) => {
  logger.info('Database info:', { message: e.message });
});

(prisma as any).$on('warn', (e: any) => {
  logger.warn('Database warning:', { message: e.message });
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma