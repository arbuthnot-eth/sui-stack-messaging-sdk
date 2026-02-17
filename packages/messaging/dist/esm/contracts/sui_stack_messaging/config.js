import { MoveTuple, MoveStruct, normalizeMoveArguments } from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
const $moduleName = "@local-pkg/sui-stack-messaging::config";
const EditConfig = new MoveTuple({
  name: `${$moduleName}::EditConfig`,
  fields: [bcs.bool()]
});
const Config = new MoveStruct({
  name: `${$moduleName}::Config`,
  fields: {
    max_channel_members: bcs.u64(),
    max_channel_roles: bcs.u64(),
    max_message_text_chars: bcs.u64(),
    max_message_attachments: bcs.u64(),
    require_invitation: bcs.bool(),
    require_request: bcs.bool(),
    emit_events: bcs.bool()
  }
});
function _default(options = {}) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "default"
  });
}
function _new(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = ["u64", "u64", "u64", "u64", "bool", "bool", "bool"];
  const parameterNames = [
    "maxChannelMembers",
    "maxChannelRoles",
    "maxMessageTextChars",
    "maxMessageAttachments",
    "requireInvitation",
    "requireRequest",
    "emitEvents"
  ];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "new",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function none(options = {}) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "none"
  });
}
function isValidConfig(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["config"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "is_valid_config",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function configMaxChannelMembers(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "config_max_channel_members",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function configMaxChannelRoles(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "config_max_channel_roles",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function configMaxMessageTextChars(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "config_max_message_text_chars",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function configMaxMessageAttachments(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "config_max_message_attachments",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function configRequireInvitation(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "config_require_invitation",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function configRequireRequest(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "config_require_request",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function configEmitEvents(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::config::Config`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "config",
    function: "config_emit_events",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
export {
  Config,
  EditConfig,
  _default,
  _new,
  configEmitEvents,
  configMaxChannelMembers,
  configMaxChannelRoles,
  configMaxMessageAttachments,
  configMaxMessageTextChars,
  configRequireInvitation,
  configRequireRequest,
  isValidConfig,
  none
};
//# sourceMappingURL=config.js.map
