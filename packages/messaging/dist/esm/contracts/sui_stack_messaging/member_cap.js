import { MoveStruct, normalizeMoveArguments } from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
import * as object from "./deps/sui/object.js";
const $moduleName = "@local-pkg/sui-stack-messaging::member_cap";
const MemberCap = new MoveStruct({
  name: `${$moduleName}::MemberCap`,
  fields: {
    id: object.UID,
    channel_id: bcs.Address
  }
});
function transferToRecipient(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::member_cap::MemberCap`,
    `${packageAddress}::creator_cap::CreatorCap`,
    "address"
  ];
  const parameterNames = ["cap", "creatorCap", "recipient"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "member_cap",
    function: "transfer_to_recipient",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function transferMemberCaps(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    "vector<address>",
    `vector<${packageAddress}::member_cap::MemberCap>`,
    `${packageAddress}::creator_cap::CreatorCap`
  ];
  const parameterNames = ["memberAddresses", "memberCaps", "creatorCap"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "member_cap",
    function: "transfer_member_caps",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function channelId(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::member_cap::MemberCap`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "member_cap",
    function: "channel_id",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
export {
  MemberCap,
  channelId,
  transferMemberCaps,
  transferToRecipient
};
//# sourceMappingURL=member_cap.js.map
