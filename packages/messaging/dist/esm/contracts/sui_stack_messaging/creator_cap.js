import { MoveStruct, normalizeMoveArguments } from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
import * as object from "./deps/sui/object.js";
const $moduleName = "@local-pkg/sui-stack-messaging::creator_cap";
const CreatorCap = new MoveStruct({
  name: `${$moduleName}::CreatorCap`,
  fields: {
    id: object.UID,
    channel_id: bcs.Address
  }
});
function transferToSender(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::creator_cap::CreatorCap`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "creator_cap",
    function: "transfer_to_sender",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
export {
  CreatorCap,
  transferToSender
};
//# sourceMappingURL=creator_cap.js.map
