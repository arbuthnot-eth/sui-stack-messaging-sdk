"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var error_exports = {};
__export(error_exports, {
  ApiNotImplementedFeatureError: () => ApiNotImplementedFeatureError,
  GeneralError: () => GeneralError,
  MessagingAPIError: () => MessagingAPIError,
  MessagingClientError: () => MessagingClientError,
  NotImplementedFeatureError: () => NotImplementedFeatureError,
  UserError: () => UserError,
  toMajorityError: () => toMajorityError
});
module.exports = __toCommonJS(error_exports);
var _MessagingAPIError_static, generate_fn;
class MessagingClientError extends Error {
}
class UserError extends MessagingClientError {
}
const _MessagingAPIError = class _MessagingAPIError extends MessagingClientError {
  constructor(message, requestId, status) {
    super(message);
    this.requestId = requestId;
    this.status = status;
  }
  static async assertResponse(response, requestId) {
    var _a;
    if (response.ok) {
      return;
    }
    let errorInstance;
    try {
      const text = await response.text();
      const error = JSON.parse(text)["error"];
      const message = JSON.parse(text)["message"];
      errorInstance = __privateMethod(_a = _MessagingAPIError, _MessagingAPIError_static, generate_fn).call(_a, error, message, requestId);
    } catch {
      errorInstance = new GeneralError(response.statusText, requestId, response.status);
    }
    throw errorInstance;
  }
};
_MessagingAPIError_static = new WeakSet();
generate_fn = function(error, message, requestId, status) {
  switch (error) {
    case "NotImplementedFeature":
      return new ApiNotImplementedFeatureError(requestId);
    default:
      return new GeneralError(message, requestId, status);
  }
};
__privateAdd(_MessagingAPIError, _MessagingAPIError_static);
let MessagingAPIError = _MessagingAPIError;
class ApiNotImplementedFeatureError extends MessagingAPIError {
  constructor(requestId) {
    super("API: Not implemented yet", requestId);
  }
}
class GeneralError extends MessagingAPIError {
}
class NotImplementedFeatureError extends UserError {
  constructor() {
    super("SDK: Not implemented yet");
  }
}
function toMajorityError(errors) {
  let maxCount = 0;
  let majorityError = errors[0];
  const counts = /* @__PURE__ */ new Map();
  for (const error of errors) {
    const errorName = error.constructor.name;
    const newCount = (counts.get(errorName) || 0) + 1;
    counts.set(errorName, newCount);
    if (newCount > maxCount) {
      maxCount = newCount;
      majorityError = error;
    }
  }
  return majorityError;
}
//# sourceMappingURL=error.js.map
