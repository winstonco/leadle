import { typedMessenger } from '../utils/TypedMessenger';

{
  console.log('nyt.js');

  async function getUid(): Promise<string> {
    // const uid = await chrome.runtime.sendMessage({ nyt: 'uid' });
    const uid2 = await typedMessenger.sendMessage('nyt', 'uid');
    return uid2;
  }

  typedMessenger.addListener('nyt', 'gameState', async (sendResponse) => {
    const uid = await getUid();
    const gameStateStorage = localStorage.getItem(
      `games-state-wordleV2/${uid}`
    );
    if (!gameStateStorage) {
      sendResponse(null);
      return;
    }
    const gameState = JSON.parse(gameStateStorage);
    sendResponse(gameState);
  });
}
