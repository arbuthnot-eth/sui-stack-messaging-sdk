import { getLogger as getLogTapeLogger } from "@logtape/logtape";
function getLogger(category) {
  return getLogTapeLogger(category);
}
import { LOG_CATEGORIES } from "./categories.js";
export {
  LOG_CATEGORIES,
  getLogger
};
//# sourceMappingURL=index.js.map
