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
var compose_exports = {};
__export(compose_exports, {
  appendThunderMessage: () => appendThunderMessage
});
module.exports = __toCommonJS(compose_exports);
var import_channel = require("./contracts/sui_stack_messaging/channel.js");
var import_attachment = require("./contracts/sui_stack_messaging/attachment.js");
var import_thunder = require("./thunder.js");
async function appendThunderMessage(tx, options, envelopeEncryption) {
  const { packageId, channelId, memberCapId, action, encryptedKey, sender } = options;
  const messageBytes = (0, import_thunder.serializeThunderAction)(action);
  const messageText = new TextDecoder().decode(messageBytes);
  const { encryptedBytes: ciphertext, nonce } = await envelopeEncryption.encryptText({
    text: messageText,
    channelId,
    sender,
    memberCapId,
    encryptedKey
  });
  const attachmentType = import_attachment.Attachment.name.replace("@local-pkg/sui-stack-messaging", packageId);
  const emptyAttachments = tx.moveCall({
    package: "0x1",
    module: "vector",
    function: "empty",
    arguments: [],
    typeArguments: [attachmentType]
  });
  tx.add(
    (0, import_channel.sendMessage)({
      package: packageId,
      arguments: {
        self: tx.object(channelId),
        memberCap: tx.object(memberCapId),
        ciphertext: tx.pure.vector("u8", ciphertext),
        nonce: tx.pure.vector("u8", nonce),
        attachments: emptyAttachments
      }
    })
  );
}
//# sourceMappingURL=compose.js.map
