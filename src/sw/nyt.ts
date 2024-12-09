import { DATA_ACCESS } from '../data/data';
import { typedMessenger } from '../utils/TypedMessenger';
import { getCurrentTab } from '../utils/utils';
import { webRequestObservable } from './intercept';

console.log('nyt.js');

// Listen for when NYT sends data back to their server (this happens when the player updates their game state)
webRequestObservable.subscribe(async (_) => {
  // Get new game state
  const t = await getCurrentTab();
  if (!t || !t.id || !t.url || !t.url.includes('://www.nytimes.com')) return;
  const gameState = await typedMessenger.sendTabMessage(
    t.id,
    'nyt',
    'gameState'
  );
  await DATA_ACCESS.setData('userData', gameState);
});

export async function getUid(): Promise<string> {
  const c = await chrome.cookies.get({
    name: 'nyt-jkidd',
    url: 'https://www.nytimes.com',
  });
  if (c) {
    // ["x=a&y=b&z=c"]
    const kvString = decodeURI(c.value).split('&');
    // ["x=a", "y=b", "z=c"]
    for (const kv of kvString) {
      const [k, v] = kv.split('=');
      if (k === 'uid') {
        return v;
      }
    }
  }
  return 'ANON';
  // return '228153123';
}

typedMessenger.addListener('nyt', 'uid', (sendResponse) => {
  getUid().then(sendResponse);
  return true;
});
