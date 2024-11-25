import { Observable } from '../utils/Observable';

console.log('intercept.js');

export const webRequestObservable =
  new Observable<chrome.webRequest.WebResponseCacheDetails>();

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.initiator?.startsWith('chrome-extension://')) return;

    // console.log('intercept!');
    webRequestObservable.notify(details);
    return { cancel: false };
  },
  {
    urls: [
      '*://www.nytimes.com/svc/games/*',
      '*://www.nytimes.com/svc/strands/*',
    ],
  }
);
