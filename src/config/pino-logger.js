const pino = require("pino");

const pinoLogger = pino({
  level: "info",
  base: { pid: false },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

module.exports = pinoLogger;
