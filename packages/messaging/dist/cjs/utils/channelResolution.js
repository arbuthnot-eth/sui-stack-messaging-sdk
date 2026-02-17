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
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var channelResolution_exports = {};
__export(channelResolution_exports, {
  LocalChannelRegistry: () => LocalChannelRegistry,
  PersistentChannelRegistry: () => PersistentChannelRegistry,
  formatChannelName: () => formatChannelName,
  isChannelName: () => isChannelName,
  normalizeChannelName: () => normalizeChannelName
});
module.exports = __toCommonJS(channelResolution_exports);
var _nameToId, _idToName, _storageKey, _storage, _PersistentChannelRegistry_instances, persist_fn;
function isChannelName(input) {
  if (!input || input.length === 0) {
    return false;
  }
  if (input.startsWith("#")) {
    return true;
  }
  if (input.startsWith("0x")) {
    return false;
  }
  return true;
}
function normalizeChannelName(name) {
  let normalized = name.trim().toLowerCase();
  if (normalized.startsWith("#")) {
    normalized = normalized.slice(1);
  }
  return normalized;
}
function formatChannelName(name) {
  const normalized = normalizeChannelName(name);
  return `#${normalized}`;
}
class LocalChannelRegistry {
  /**
   * Create a new LocalChannelRegistry with optional initial mappings.
   * @param initialMappings - Optional initial name-to-ID mappings
   */
  constructor(initialMappings) {
    __privateAdd(this, _nameToId, /* @__PURE__ */ new Map());
    __privateAdd(this, _idToName, /* @__PURE__ */ new Map());
    if (initialMappings) {
      const entries = initialMappings instanceof Map ? initialMappings.entries() : Object.entries(initialMappings);
      for (const [name, channelId] of entries) {
        const normalized = normalizeChannelName(name);
        __privateGet(this, _nameToId).set(normalized, channelId);
        __privateGet(this, _idToName).set(channelId, normalized);
      }
    }
  }
  async resolve(nameOrId) {
    if (!isChannelName(nameOrId)) {
      return nameOrId;
    }
    const normalized = normalizeChannelName(nameOrId);
    const channelId = __privateGet(this, _nameToId).get(normalized);
    if (!channelId) {
      throw new Error(`Channel name not found: ${formatChannelName(nameOrId)}`);
    }
    return channelId;
  }
  async resolveMany(namesOrIds) {
    return Promise.all(namesOrIds.map((nameOrId) => this.resolve(nameOrId)));
  }
  async reverseLookup(channelId) {
    const name = __privateGet(this, _idToName).get(channelId);
    return name ? formatChannelName(name) : null;
  }
  async register(name, channelId) {
    const normalized = normalizeChannelName(name);
    const existingId = __privateGet(this, _nameToId).get(normalized);
    if (existingId && existingId !== channelId) {
      throw new Error(
        `Channel name ${formatChannelName(name)} is already registered to ${existingId}`
      );
    }
    const existingName = __privateGet(this, _idToName).get(channelId);
    if (existingName && existingName !== normalized) {
      __privateGet(this, _nameToId).delete(existingName);
    }
    __privateGet(this, _nameToId).set(normalized, channelId);
    __privateGet(this, _idToName).set(channelId, normalized);
  }
  async unregister(name) {
    const normalized = normalizeChannelName(name);
    const channelId = __privateGet(this, _nameToId).get(normalized);
    if (channelId) {
      __privateGet(this, _nameToId).delete(normalized);
      __privateGet(this, _idToName).delete(channelId);
    }
  }
  async list() {
    const result = /* @__PURE__ */ new Map();
    for (const [name, channelId] of __privateGet(this, _nameToId)) {
      result.set(formatChannelName(name), channelId);
    }
    return result;
  }
  /**
   * Export the registry data for persistence.
   * @returns JSON-serializable object of name-to-ID mappings
   */
  export() {
    const result = {};
    for (const [name, channelId] of __privateGet(this, _nameToId)) {
      result[name] = channelId;
    }
    return result;
  }
  /**
   * Import registry data from a previously exported object.
   * @param data - The exported registry data
   * @param merge - If true, merge with existing data; if false, replace
   */
  import(data, merge = true) {
    if (!merge) {
      __privateGet(this, _nameToId).clear();
      __privateGet(this, _idToName).clear();
    }
    for (const [name, channelId] of Object.entries(data)) {
      const normalized = normalizeChannelName(name);
      __privateGet(this, _nameToId).set(normalized, channelId);
      __privateGet(this, _idToName).set(channelId, normalized);
    }
  }
  /**
   * Clear all registered channel names.
   */
  clear() {
    __privateGet(this, _nameToId).clear();
    __privateGet(this, _idToName).clear();
  }
  /**
   * Get the number of registered channel names.
   */
  get size() {
    return __privateGet(this, _nameToId).size;
  }
}
_nameToId = new WeakMap();
_idToName = new WeakMap();
class PersistentChannelRegistry extends LocalChannelRegistry {
  /**
   * Create a new PersistentChannelRegistry.
   * @param storageKey - The key to use for storage (default: 'sui-messaging-channels')
   */
  constructor(storageKey = "sui-messaging-channels") {
    let initialData;
    const storage = typeof localStorage !== "undefined" ? localStorage : null;
    if (storage) {
      try {
        const stored = storage.getItem(storageKey);
        if (stored) {
          initialData = JSON.parse(stored);
        }
      } catch {
      }
    }
    super(initialData);
    __privateAdd(this, _PersistentChannelRegistry_instances);
    __privateAdd(this, _storageKey);
    __privateAdd(this, _storage);
    __privateSet(this, _storageKey, storageKey);
    __privateSet(this, _storage, storage);
  }
  async register(name, channelId) {
    await super.register(name, channelId);
    __privateMethod(this, _PersistentChannelRegistry_instances, persist_fn).call(this);
  }
  async unregister(name) {
    await super.unregister(name);
    __privateMethod(this, _PersistentChannelRegistry_instances, persist_fn).call(this);
  }
  /**
   * Force a save to storage.
   */
  save() {
    __privateMethod(this, _PersistentChannelRegistry_instances, persist_fn).call(this);
  }
  /**
   * Reload data from storage, discarding any unsaved changes.
   */
  reload() {
    if (__privateGet(this, _storage)) {
      try {
        const stored = __privateGet(this, _storage).getItem(__privateGet(this, _storageKey));
        if (stored) {
          this.import(JSON.parse(stored), false);
        }
      } catch {
      }
    }
  }
}
_storageKey = new WeakMap();
_storage = new WeakMap();
_PersistentChannelRegistry_instances = new WeakSet();
persist_fn = function() {
  if (__privateGet(this, _storage)) {
    try {
      __privateGet(this, _storage).setItem(__privateGet(this, _storageKey), JSON.stringify(this.export()));
    } catch {
    }
  }
};
//# sourceMappingURL=channelResolution.js.map
