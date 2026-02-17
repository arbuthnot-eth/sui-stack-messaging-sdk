import { MoveStruct, MoveTuple, normalizeMoveArguments } from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
import * as object from "./deps/sui/object.js";
import * as auth from "./auth.js";
import * as table_vec from "./deps/sui/table_vec.js";
import * as message from "./message.js";
import * as encryption_key_history from "./encryption_key_history.js";
const $moduleName = "@local-pkg/sui-stack-messaging::channel";
const Channel = new MoveStruct({
  name: `${$moduleName}::Channel`,
  fields: {
    id: object.UID,
    /** The version of this object, for handling updgrades. */
    version: bcs.u64(),
    /**
     * The Authorization struct, gating actions to member permissions. Note: It also,
     * practically, keeps tracks of the members (MemberCap ID -> Permissions)
     */
    auth: auth.Auth,
    /**
     * The message history of the channel.
     *
     * Using `TableVec` to avoid the object size limit.
     */
    messages: table_vec.TableVec,
    /**
     * The total number of messages, for efficiency, so that we don't have to make a
     * call to messages.length() (Maybe I am overthinking this, need to measure)
     */
    messages_count: bcs.u64(),
    /**
     * A duplicate of the last entry of the messages TableVec,
     *
     * Utilize this for efficient fetching e.g. list of conversations showing the
     * latest message and the user who sent it
     */
    last_message: bcs.option(message.Message),
    /** The timestamp (in milliseconds) when the channel was created. */
    created_at_ms: bcs.u64(),
    /**
     * The timestamp (in milliseconds) when the channel was last updated. (e.g. change
     * in metadata, members, admins, keys)
     */
    updated_at_ms: bcs.u64(),
    /**
     * History of Encryption keys
     *
     * Holds the latest key, the latest_version, and a TableVec of the historical keys
     */
    encryption_key_history: encryption_key_history.EncryptionKeyHistory
  }
});
const SimpleMessenger = new MoveTuple({
  name: `${$moduleName}::SimpleMessenger`,
  fields: [bcs.bool()]
});
function _new(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<${packageAddress}::config::Config>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["config", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "new",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function share(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::creator_cap::CreatorCap`
  ];
  const parameterNames = ["self", "creatorCap"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "share",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function addEncryptedKey(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "vector<u8>"
  ];
  const parameterNames = ["self", "memberCap", "newEncryptionKeyBytes"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "add_encrypted_key",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function addMembers(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "u64",
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["self", "memberCap", "n", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "add_members",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function removeMembers(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "vector<0x0000000000000000000000000000000000000000000000000000000000000002::object::ID>",
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["self", "memberCap", "membersToRemove", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "remove_members",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function sendMessage(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    `${packageAddress}::channel::Channel`,
    `${packageAddress}::member_cap::MemberCap`,
    "vector<u8>",
    "vector<u8>",
    `vector<${packageAddress}::attachment::Attachment>`,
    "0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock"
  ];
  const parameterNames = ["self", "memberCap", "ciphertext", "nonce", "attachments", "clock"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "send_message",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function namespace(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::channel::Channel`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "channel",
    function: "namespace",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
export {
  Channel,
  SimpleMessenger,
  _new,
  addEncryptedKey,
  addMembers,
  namespace,
  removeMembers,
  sendMessage,
  share
};
//# sourceMappingURL=channel.js.map
