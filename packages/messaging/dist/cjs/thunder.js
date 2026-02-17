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
var thunder_exports = {};
__export(thunder_exports, {
  THUNDER_TOOLS: () => THUNDER_TOOLS,
  THUNDER_VERSION: () => THUNDER_VERSION,
  createThunderAction: () => createThunderAction,
  deserializeThunderAction: () => deserializeThunderAction,
  serializeThunderAction: () => serializeThunderAction
});
module.exports = __toCommonJS(thunder_exports);
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
//# sourceMappingURL=thunder.js.map
