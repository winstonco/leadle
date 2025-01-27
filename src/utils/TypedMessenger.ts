import { Hasher } from "./Hasher";

/** source: https://stackoverflow.com/questions/63079777/how-do-i-merge-two-interface-types-with-the-overlapping-properties-types-being */
type Combine<A, B> =
  & Omit<A, keyof B>
  & Omit<B, keyof A>
  & { [K in keyof A & keyof B]: A[K] | B[K] };

type SharedMessages = {
  debug: "log";
};

type ToServiceWorkerMessages = SharedMessages & {
  auth: "signIn" | "refreshSessions" | "getAuthSession" | "getProviderSession";
  nyt: "uid";
};

type ToContentScriptMessages = SharedMessages & {
  nyt: "gameState";
};

type AllMessages = Combine<ToServiceWorkerMessages, ToContentScriptMessages>;

type ChromeMessageListener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => void;

export class TypedMessenger {
  public id: number = Math.floor(Math.random() * 10000);
  // Hasher
  private readonly hasher: Hasher = new Hasher();
  // KV of hashed custom listener functions to actual chrome.runtime.onMessage listener so they can be removed completely
  private readonly listeners: {
    [listenerHash: string]: ChromeMessageListener;
  } = {};

  /** Sends message with format: [target, message, args] */
  public async sendMessage<T extends keyof ToServiceWorkerMessages>(
    target: T,
    message: ToServiceWorkerMessages[T],
    ...args: any[]
  ) {
    return await chrome.runtime.sendMessage([target, message, args]);
  }

  /** Sends message with format: [target, message, args]. Used to send messages to content scripts. */
  public async sendTabMessage<T extends keyof ToContentScriptMessages>(
    tabId: number,
    target: T,
    message: ToContentScriptMessages[T],
    ...args: any[]
  ) {
    return await chrome.tabs.sendMessage(tabId, [target, message, args]);
  }

  /** Adds listener on message: [target, request, args] */
  public addListener<T extends keyof AllMessages>(
    target: T,
    request: AllMessages[T],
    response?: (
      sendResponse: (response?: any) => void,
      sender: chrome.runtime.MessageSender,
      ...args: any[]
    ) => Promise<void>,
  ) {
    const listener: ChromeMessageListener = (message, sender, sendResponse) => {
      const [t, req, args]: [T, AllMessages[T], any[]?] = message;
      if (t !== target) return false;
      if (req !== request) return false;
      if (response) {
        if (args) response(sendResponse, sender, ...args);
        else response(sendResponse, sender);
        return true;
      }
      return false;
    };
    chrome.runtime.onMessage.addListener(listener);
    const hash = this.getFnHashHelper(target, request, response);
    this.listeners[hash] = listener;
  }

  public removeListener<T extends keyof AllMessages>(
    target: T,
    request: AllMessages[T],
    response?: (sendResponse: (response?: any) => void) => void,
  ) {
    const hash = this.getFnHashHelper(target, request, response);
    if (this.listeners[hash] !== undefined) {
      chrome.runtime.onMessage.removeListener(this.listeners[hash]);
      delete this.listeners[hash];
    }
  }

  public once<T extends keyof AllMessages>(
    target: T,
    request: AllMessages[T],
    response?: (sendResponse: (response?: any) => void) => any,
  ) {
    const wrapper = async (...args: any) => {
      response?.(args);
      this.removeListener(target, request, wrapper);
    };
    this.addListener(target, request, wrapper);
  }

  private getFnHashHelper<T extends keyof AllMessages>(
    target: T,
    request: AllMessages[T],
    response?: (...args: any[]) => void,
  ) {
    const hash = this.hasher.hashString(target) +
      this.hasher.hashString(
        Array.isArray(request) ? request.toString() : request,
      ) +
      this.hasher.hashFunc(response ?? (() => {}));
    return hash;
  }
}

export const typedMessenger = new TypedMessenger();
