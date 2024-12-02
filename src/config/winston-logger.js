const winston = require("winston");

// const logger = winston.createLogger({
//   level: "info",
//   //format: winston.format.cli(),
//   format: winston.format.combine(
//     winston.format.colorize({ all: true }),
//     winston.format.timestamp({
//       format: "YYYY-MM-DD hh:mm:ss.SSS A",
//     }),
//     // winston.format.json()
//     winston.format.align(),
//     winston.format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`)
//   ),
//   transports: [new winston.transports.Console()],
// });

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    winston.format.json()
    // winston.format.printf(
    //   (info) => `[${info.timestamp}] ${info.level} ${info.message}`
    // )
  ),
  transports: [new winston.transports.Console()],
});

module.exports = winstonLogger;
