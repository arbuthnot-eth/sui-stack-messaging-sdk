import { MoveTuple } from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
const $moduleName = "@local-pkg/sui-stack-messaging::admin";
const Admin = new MoveTuple({ name: `${$moduleName}::Admin`, fields: [bcs.bool()] });
export {
  Admin
};
//# sourceMappingURL=admin.js.map
