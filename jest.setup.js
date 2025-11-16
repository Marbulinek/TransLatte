// Jest setup file to ensure no globalThis.localStorage exists in Node.js environment
if (globalThis.localStorage !== undefined) {
  // Only attempt to delete if configurable, otherwise set to undefined
  try {
    delete globalThis.localStorage;
  } catch {
    globalThis.localStorage = undefined;
  }
}
