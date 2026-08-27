import { pino } from 'pino'

const isDevelopment = process.env.NODE_ENV !== "production";

export const createLogger = (name: string) => pino({
  name,
  timestamp: pino.stdTimeFunctions.isoTime,

  ...(isDevelopment && {
  transport: {
    target: require.resolve('pino-pretty'),
      options: {
        colorize: true
      }
    }
  })
})
