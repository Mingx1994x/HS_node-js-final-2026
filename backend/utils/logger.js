const pino = require('pino')
const pretty = require('pino-pretty')

const errorSerializer = (err) => {
  const serialized = pino.stdSerializers.err(err);
  if (Array.isArray(err.errors)) {
    // 展開巢狀錯誤
    // causes 陣列列出每個底層失敗原因
    serialized.causes = err.errors.map((e) => pino.stdSerializers.err(e))
  }
  return serialized
}

const logLevel = "debug";
const logger = pino(
  {
    level: logLevel,
    serializers: { err: errorSerializer }
  },
  pretty({
    messageFormat: '[{module}]: {msg}',
    colorize: true,
    sync: true,
  })
)

module.exports = logger;