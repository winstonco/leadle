import { cyrb53, randomNumber } from './utils';

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
