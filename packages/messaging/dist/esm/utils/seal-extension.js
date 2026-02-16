import { SealClient } from "@mysten/seal";
function sealClientExtension(options) {
  return {
    name: "seal",
    register: (client) => {
      return new SealClient({
        suiClient: client,
        serverConfigs: options.serverConfigs,
        verifyKeyServers: options.verifyKeyServers ?? true,
        timeout: options.timeout
      });
    }
  };
}
export {
  sealClientExtension
};
//# sourceMappingURL=seal-extension.js.map
