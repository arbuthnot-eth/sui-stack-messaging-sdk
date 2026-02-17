/**
 * Get a logger for the specified category.
 *
 * This is a thin wrapper around LogTape's getLogger function.
 * Use the CATEGORIES constants for consistency.
 *
 * @param category - The logging category (use CATEGORIES constants)
 * @returns A logger instance
 *
 * @example
 * ```typescript
 * import { getLogger, LOG_CATEGORIES } from './logging/index.js';
 *
 * const logger = getLogger(LOG_CATEGORIES.CLIENT_READS);
 * logger.info("Fetching channels", { count: 10 });
 * ```
 */
export declare function getLogger(category: readonly string[]): import("@logtape/logtape").Logger;
export { LOG_CATEGORIES } from './categories.js';
