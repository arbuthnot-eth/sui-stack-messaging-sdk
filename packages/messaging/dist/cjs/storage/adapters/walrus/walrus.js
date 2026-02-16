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
var walrus_exports = {};
__export(walrus_exports, {
  WalrusStorageAdapter: () => WalrusStorageAdapter
});
module.exports = __toCommonJS(walrus_exports);
var import_logging = require("../../../logging/index.js");
var _WalrusStorageAdapter_instances, uploadQuilts_fn, downloadQuilts_fn, extractBlobId_fn, extractQuiltsPatchIds_fn;
class WalrusStorageAdapter {
  constructor(_client, config) {
    this._client = _client;
    this.config = config;
    __privateAdd(this, _WalrusStorageAdapter_instances);
  }
  /**
   * Upload data to Walrus storage
   * @param data - Array of data to upload
   * @param _options - Storage options (currently unused)
   * @returns Upload result with blob IDs
   */
  async upload(data, _options) {
    const logger = (0, import_logging.getLogger)(import_logging.LOG_CATEGORIES.STORAGE_WALRUS);
    const totalBytes = data.reduce((sum, d) => sum + d.length, 0);
    logger.debug("Uploading to Walrus", {
      count: data.length,
      totalBytes,
      publisherUrl: this.config.publisher,
      epochs: this.config.epochs
    });
    const result = await __privateMethod(this, _WalrusStorageAdapter_instances, uploadQuilts_fn).call(this, data);
    logger.info("Uploaded to Walrus", {
      count: result.ids.length,
      blobIds: result.ids,
      totalBytes
    });
    return result;
  }
  /**
   * Download data from Walrus storage
   * @param ids - Array of blob IDs to download
   * @returns Array of downloaded data
   */
  async download(ids) {
    const logger = (0, import_logging.getLogger)(import_logging.LOG_CATEGORIES.STORAGE_WALRUS);
    logger.debug("Downloading from Walrus", {
      count: ids.length,
      ids,
      aggregatorUrl: this.config.aggregator
    });
    if (ids.length === 0) {
      return [];
    }
    const result = await __privateMethod(this, _WalrusStorageAdapter_instances, downloadQuilts_fn).call(this, ids);
    logger.info("Downloaded from Walrus", {
      count: result.length,
      totalBytes: result.reduce((sum, d) => sum + d.length, 0)
    });
    return result;
  }
}
_WalrusStorageAdapter_instances = new WeakSet();
uploadQuilts_fn = async function(data) {
  const formData = new FormData();
  for (let i = 0; i < data.length; i++) {
    const identifier = `attachment${i}`;
    const blob = new Blob([new Uint8Array(data[i])]);
    formData.append(identifier, blob);
  }
  const response = await fetch(
    `${this.config.publisher}/v1/quilts?epochs=${this.config.epochs}`,
    {
      method: "PUT",
      body: formData
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    const logger = (0, import_logging.getLogger)(import_logging.LOG_CATEGORIES.STORAGE_WALRUS);
    logger.error("Walrus upload failed", {
      status: response.status,
      statusText: response.statusText,
      errorText,
      publisherUrl: this.config.publisher
    });
    throw new Error(
      `Walrus upload failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }
  const result = await response.json();
  return { ids: __privateMethod(this, _WalrusStorageAdapter_instances, extractQuiltsPatchIds_fn).call(this, result) };
};
downloadQuilts_fn = async function(patchIds) {
  const response = await Promise.all(
    patchIds.map(
      async (id) => await fetch(`${this.config.aggregator}/v1/blobs/by-quilt-patch-id/${id}`)
    )
  );
  const data = await Promise.all(response.map(async (response2) => await response2.arrayBuffer()));
  return data.map((data2) => new Uint8Array(data2));
};
/**
 * Extract blob ID from Walrus response
 * @param response - Walrus API response
 * @returns Extracted blob ID
 */
// @ts-expect-error Method is currently unused but kept for future implementation
extractBlobId_fn = function(response) {
  if (response.newlyCreated?.blobObject?.blobId) {
    return response.newlyCreated.blobObject.blobId;
  }
  if (response.alreadyCertified?.blobId) {
    return response.alreadyCertified.blobId;
  }
  if (response.blobStoreResult?.newlyCreated?.blobObject?.blobId) {
    return response.blobStoreResult.newlyCreated.blobObject.blobId;
  }
  throw new Error("Unable to extract blob ID from response");
};
/**
 * Extract quilt patch IDs from Walrus response
 * @param response - Walrus API response
 * @returns Array of quilt patch IDs
 */
extractQuiltsPatchIds_fn = function(response) {
  if (response.storedQuiltBlobs) {
    return response.storedQuiltBlobs.map((quilt) => quilt.quiltPatchId);
  }
  throw new Error("Unable to extract quilt patch IDs from response");
};
//# sourceMappingURL=walrus.js.map
