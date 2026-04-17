import pino from "pino";
import config from "../config";
import pretty from "pino-pretty";
import fs from "fs";
import path from "path";

const isProd = config.node.env === "production";

const toDailyLogPath = (logFile: string) => {
  const date = new Date().toISOString().slice(0, 10);

  if (logFile.endsWith(".log")) {
    const parsed = path.parse(logFile);
    return path.join(parsed.dir, `${parsed.name}-${date}${parsed.ext}`);
  }

  return path.join(logFile, `app-${date}.log`);
};

const ensureLogDirExists = (filePath: string) => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
};

const fileDestination = config.logging.file
  ? (() => {
      const filePath = toDailyLogPath(config.logging.file);
      ensureLogDirExists(filePath);
      return pino.destination({ dest: filePath, sync: !isProd });
    })()
  : undefined;

const devStream = pretty({
  colorize: true,
  translateTime: "SYS:standard",
  ignore: "pid,hostname",
});

const logger = pino(
  {
    level: config.logging.level || (isProd ? "info" : "debug"),
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: pino.stdSerializers.err,
    },
  },
  pino.multistream(
    [
      ...(fileDestination ? [{ stream: fileDestination }] : []),
      { stream: isProd ? process.stdout : devStream },
    ],
    { dedupe: true },
  ),
);

export default logger;
