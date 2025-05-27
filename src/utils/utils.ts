export async function isDev(): Promise<boolean> {
  const self = await chrome.management.getSelf();
  return self.installType === "development";
}

/**
 * https://developer.chrome.com/docs/extensions/reference/api/tabs#get_the_current_tab
 */
export async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * source: github.com/bryc
 * https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
 */
export const cyrb53 = function (str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/**
 * Source: ChatGPT
 */
export class Hasher {
  private funcHashes = new WeakMap<WeakKey, number>();
  public hashFunc(func: (...args: any[]) => any): number {
    while (!this.funcHashes.has(func)) {
      const uniqueId = randomNumber();
      this.funcHashes.set(func, uniqueId);
    }
    return this.funcHashes.get(func)!;
  }

  public hashString(input: string): number {
    const k = cyrb53(input);
    return k;
  }
}

export function randomNumber(): number {
  if (typeof globalThis === "undefined") {
    const v = cyrb53(Math.random().toString());
    return v;
  }
  const values: Uint32Array = new Uint32Array(1);
  return globalThis.crypto.getRandomValues(values)[0];
}

// AI
export function msToMMSS(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(minutes)}:${pad(remainingSeconds)}`;
}
