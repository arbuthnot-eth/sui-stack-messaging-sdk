const THUNDER_VERSION = 1;
const THUNDER_TOOLS = {
  REGISTER: "sui:register",
  TRANSFER: "sui:transfer",
  SWAP: "sui:swap",
  STAKE: "sui:stake",
  SKI: "sui:ski",
  MESSAGE: "sui:message"
};
function createThunderAction(tool, input, origin) {
  return {
    v: THUNDER_VERSION,
    method: "tools/call",
    tool,
    input,
    origin
  };
}
function serializeThunderAction(action) {
  return new TextEncoder().encode(JSON.stringify(action));
}
function deserializeThunderAction(bytes) {
  const text = new TextDecoder().decode(bytes);
  const parsed = JSON.parse(text);
  if (parsed.v !== THUNDER_VERSION) {
    throw new Error(`Unsupported Thunder action version: ${parsed.v}`);
  }
  if (parsed.method !== "tools/call") {
    throw new Error(`Unsupported Thunder action method: ${parsed.method}`);
  }
  return parsed;
}
export {
  THUNDER_TOOLS,
  THUNDER_VERSION,
  createThunderAction,
  deserializeThunderAction,
  serializeThunderAction
};
//# sourceMappingURL=thunder.js.map
