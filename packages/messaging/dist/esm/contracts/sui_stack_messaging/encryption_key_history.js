import { MoveStruct, MoveTuple } from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
import * as table_vec from "./deps/sui/table_vec.js";
const $moduleName = "@local-pkg/sui-stack-messaging::encryption_key_history";
const EncryptionKeyHistory = new MoveStruct({
  name: `${$moduleName}::EncryptionKeyHistory`,
  fields: {
    latest: bcs.vector(bcs.u8()),
    latest_version: bcs.u32(),
    history: table_vec.TableVec
  }
});
const EditEncryptionKey = new MoveTuple({
  name: `${$moduleName}::EditEncryptionKey`,
  fields: [bcs.bool()]
});
export {
  EditEncryptionKey,
  EncryptionKeyHistory
};
//# sourceMappingURL=encryption_key_history.js.map
