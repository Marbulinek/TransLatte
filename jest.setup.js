// Jest setup file to ensure no global localStorage exists in Node.js environment
if (typeof global.localStorage !== 'undefined') {
  try { delete global.localStorage; } catch (e) { global.localStorage = undefined; }
}
if (typeof globalThis.localStorage !== 'undefined') {
  try { delete globalThis.localStorage; } catch (e) { globalThis.localStorage = undefined; }
}
