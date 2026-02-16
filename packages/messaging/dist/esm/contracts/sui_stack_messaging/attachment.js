import { MoveStruct, normalizeMoveArguments } from "../utils/index.js";
import { bcs } from "@mysten/sui/bcs";
const $moduleName = "@local-pkg/sui-stack-messaging::attachment";
const Attachment = new MoveStruct({
  name: `${$moduleName}::Attachment`,
  fields: {
    blob_ref: bcs.string(),
    encrypted_metadata: bcs.vector(bcs.u8()),
    data_nonce: bcs.vector(bcs.u8()),
    metadata_nonce: bcs.vector(bcs.u8()),
    key_version: bcs.u32()
  }
});
function _new(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [
    "0x0000000000000000000000000000000000000000000000000000000000000001::string::String",
    "vector<u8>",
    "vector<u8>",
    "vector<u8>",
    "u32"
  ];
  const parameterNames = [
    "blobRef",
    "encryptedMetadata",
    "dataNonce",
    "metadataNonce",
    "keyVersion"
  ];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "attachment",
    function: "new",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function blobRef(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::attachment::Attachment`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "attachment",
    function: "blob_ref",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
function dataNonce(options) {
  const packageAddress = options.package ?? "@local-pkg/sui-stack-messaging";
  const argumentsTypes = [`${packageAddress}::attachment::Attachment`];
  const parameterNames = ["self"];
  return (tx) => tx.moveCall({
    package: packageAddress,
    module: "attachment",
    function: "data_nonce",
    arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames)
  });
}
export {
  Attachment,
  _new,
  blobRef,
  dataNonce
};
//# sourceMappingURL=attachment.js.map
