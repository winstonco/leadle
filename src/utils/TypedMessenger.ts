import { Hasher } from './Hasher';

type GenericMessageTargets = {
  debug: 'log';
};

type ServiceWorkerMessageTargets =
  | GenericMessageTargets & {
      nyt: 'uid';
    };

type ContentScriptMessageTargets =
  | GenericMessageTargets & {
      nyt: 'gameState';
    };

type AllMessageTargetsUnion =
  | ServiceWorkerMessageTargets
  | ContentScriptMessageTargets;

type ChromeMessageListener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

export class TypedMessenger {
  // Hasher
  private readonly hasher: Hasher = new Hasher();
  // KV of hashed custom listener functions to actual chrome.runtime.onMessage listener so they can be removed completely
  private readonly listeners: {
    [listenerHash: string]: ChromeMessageListener;
  } = {};

  public async sendMessage<T extends keyof ServiceWorkerMessageTargets>(
    target: T,
    message: ServiceWorkerMessageTargets[T],
    ...args: any[]
  ) {
    return await chrome.runtime.sendMessage([target, message, args]);
  }

  /** Used to send messages to content scripts. */
  public async sendTabMessage<T extends keyof ContentScriptMessageTargets>(
    tabId: number,
    target: T,
    message: ContentScriptMessageTargets[T],
    ...args: any[]
  ) {
    return await chrome.tabs.sendMessage(tabId, [target, message, args]);
  }

  public addListener<T extends keyof AllMessageTargetsUnion>(
    target: T,
    request: AllMessageTargetsUnion[T],
    response?: (
      sendResponse: (response?: any) => void,
      sender: chrome.runtime.MessageSender,
      ...args: any[]
    ) => void
  ) {
    const listener: ChromeMessageListener = (message, sender, sendResponse) => {
      const [t, req, args]: [T, AllMessageTargetsUnion[T], any[]] = message;
      if (t !== target) return false;
      if (req !== request) return false;
      if (response) response(sendResponse, sender, ...args);
      return true;
    };
    chrome.runtime.onMessage.addListener(listener);
    const hash = this.getFnHashHelper(target, request, response);
    this.listeners[hash] = listener;
  }

  public removeListener<T extends keyof AllMessageTargetsUnion>(
    target: T,
    request: AllMessageTargetsUnion[T],
    response?: (sendResponse: (response?: any) => void) => void
  ) {
    const hash = this.getFnHashHelper(target, request, response);
    if (this.listeners[hash] !== undefined) {
      chrome.runtime.onMessage.removeListener(this.listeners[hash]);
      delete this.listeners[hash];
    }
  }

  public once<T extends keyof AllMessageTargetsUnion>(
    target: T,
    request: AllMessageTargetsUnion[T],
    response?: (sendResponse: (response?: any) => void) => any
  ) {
    const wrapper = (...args: any) => {
      response?.(args);
      this.removeListener(target, request, wrapper);
    };
    this.addListener(target, request, wrapper);
  }

  private getFnHashHelper<T extends keyof AllMessageTargetsUnion>(
    target: T,
    request: AllMessageTargetsUnion[T],
    response?: (...args: any[]) => void
  ) {
    const hash =
      this.hasher.hashString(target) +
      this.hasher.hashString(
        Array.isArray(request) ? request.toString() : request
      ) +
      this.hasher.hashFunc(response ?? (() => {}));
    return hash;
  }
}

export const typedMessenger = new TypedMessenger();
