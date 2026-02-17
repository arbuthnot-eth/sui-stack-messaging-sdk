"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var config_exports = {};
__export(config_exports, {
  Config: () => Config,
  EditConfig: () => EditConfig,
  _default: () => _default,
  _new: () => _new,
  configEmitEvents: () => configEmitEvents,
  configMaxChannelMembers: () => configMaxChannelMembers,
  configMaxChannelRoles: () => configMaxChannelRoles,
  configMaxMessageAttachments: () => configMaxMessageAttachments,
  configMaxMessageTextChars: () => configMaxMessageTextChars,
  configRequireInvitation: () => configRequireInvitation,
  configRequireRequest: () => configRequireRequest,
  isValidConfig: () => isValidConfig,
  none: () => none
});
module.exports = __toCommonJS(config_exports);
var import_utils = require("../utils/index.js");
var import_bcs = require("@mysten/sui/bcs");
const $moduleName = "@local-pkg/sui-stack-messaging::config";
const EditConfig = new import_utils.MoveTuple({
  name: `${$moduleName}::EditConfig`,
  fields: [import_bcs.bcs.bool()]
});
const Config = new import_utils.MoveStruct({
  name: `${$moduleName}::Config`,
  fields: {
    max_channel_members: import_bcs.bcs.u64(),
    max_channel_roles: import_bcs.bcs.u64(),
    max_message_text_chars: import_bcs.bcs.u64(),
    max_message_attachments: import_bcs.bcs.u64(),
    require_invitation: import_bcs.bcs.bool(),
    require_request: import_bcs.bcs.bool(),
    emit_events: import_bcs.bcs.bool()
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
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
    arguments: (0, import_utils.normalizeMoveArguments)(options.arguments, argumentsTypes, parameterNames)
  });
}
//# sourceMappingURL=config.js.map
