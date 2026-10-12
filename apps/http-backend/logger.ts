import { createHttpLogger, createLogger } from "logger";

const logger = createLogger("backend");
const httpLogger = createHttpLogger(logger);

export { logger, httpLogger };
