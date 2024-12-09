import { DATA_ACCESS } from '../data/data';
import { typedMessenger } from '../utils/TypedMessenger';

(async () => {
  console.log('nyt.js');

  async function getUid(): Promise<string> {
    // const uid = await chrome.runtime.sendMessage({ nyt: 'uid' });
    const uid2 = await typedMessenger.sendMessage('nyt', 'uid');
    return uid2;
  }

  async function getWordleState(): Promise<any> {
    const uid = await getUid();
    const gameStateStorage = window.localStorage.getItem(
      `games-state-wordleV2/${uid}`
    );
    if (!gameStateStorage) {
      return null;
    }
    const gameState = JSON.parse(gameStateStorage);
    return gameState;
  }

  typedMessenger.addListener('nyt', 'gameState', (sendResponse) => {
    getWordleState().then(sendResponse);
    return true;
  });

  // INIT
  const wordleState = await getWordleState();
  await DATA_ACCESS.setData('userData', wordleState);
})();
