import { sendMessage } from "./contracts/sui_stack_messaging/channel.js";
import { Attachment } from "./contracts/sui_stack_messaging/attachment.js";
import { serializeThunderAction } from "./thunder.js";
async function appendThunderMessage(tx, options, envelopeEncryption) {
  const { packageId, channelId, memberCapId, action, encryptedKey, sender } = options;
  const messageBytes = serializeThunderAction(action);
  const messageText = new TextDecoder().decode(messageBytes);
  const { encryptedBytes: ciphertext, nonce } = await envelopeEncryption.encryptText({
    text: messageText,
    channelId,
    sender,
    memberCapId,
    encryptedKey
  });
  const attachmentType = Attachment.name.replace("@local-pkg/sui-stack-messaging", packageId);
  const emptyAttachments = tx.moveCall({
    package: "0x1",
    module: "vector",
    function: "empty",
    arguments: [],
    typeArguments: [attachmentType]
  });
  tx.add(
    sendMessage({
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
export {
  appendThunderMessage
};
//# sourceMappingURL=compose.js.map
