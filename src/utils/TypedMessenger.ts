import { Hasher } from './Hasher';

export type MessageTargets = {
  nyt: 'uid' | 'gameState';
  pokedoku: 'test';
};

type ChromeMessageListener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

export class TypedMessenger {
  public async sendMessage<T extends keyof MessageTargets>(
    target: T,
    message: MessageTargets[T]
  ) {
    return await chrome.runtime.sendMessage({ [target]: message });
  }

  /** Used to send messages to content scripts. */
  public async sendTabMessage<T extends keyof MessageTargets>(
    tabId: number,
    target: T,
    message: MessageTargets[T]
  ) {
    return await chrome.tabs.sendMessage(tabId, { [target]: message });
  }

  private readonly hasher: Hasher = new Hasher();
  private readonly listeners: {
    [listenerHash: string]: ChromeMessageListener;
  } = {};

  public addListener<T extends keyof MessageTargets>(
    target: T,
    request: MessageTargets[T],
    response?: (sendResponse: (response?: any) => void) => void
  ) {
    const listener: ChromeMessageListener = (message, sender, sendResponse) => {
      const [t, req] = Object.entries(message)[0];
      if (t !== target) return false;
      if (req !== request) return false;
      if (response) response(sendResponse);
      return true;
    };
    chrome.runtime.onMessage.addListener(listener);
    const hash = this.getFnHashHelper(target, request, response);
    this.listeners[hash] = listener;
  }

  public removeListener<T extends keyof MessageTargets>(
    target: T,
    request: MessageTargets[T],
    response?: (sendResponse: (response?: any) => void) => void
  ) {
    const hash = this.getFnHashHelper(target, request, response);
    if (this.listeners[hash] !== undefined) {
      chrome.runtime.onMessage.removeListener(this.listeners[hash]);
      delete this.listeners[hash];
    }
  }

  public once<T extends keyof MessageTargets>(
    target: T,
    request: MessageTargets[T],
    response?: (sendResponse: (response?: any) => void) => any
  ) {
    const wrapper = (...args: any) => {
      response?.(args);
      this.removeListener(target, request, wrapper);
    };
    this.addListener(target, request, wrapper);
  }

  private getFnHashHelper<T extends keyof MessageTargets>(
    target: T,
    request: MessageTargets[T],
    response?: (sendResponse: (response?: any) => void) => void
  ) {
    const hash =
      this.hasher.hashString(target) +
      this.hasher.hashString(request) +
      this.hasher.hashFunc(response ?? (() => {}));
    return hash;
  }
}

export const typedMessenger = new TypedMessenger();
