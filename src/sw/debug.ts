import { typedMessenger } from '../utils/TypedMessenger';
import { isDev } from '../utils/utils';

console.log('debug.js');

(async () => {
  if (await isDev()) {
    typedMessenger.addListener('debug', 'log', async (sr, _, ...args) => {
      console.log('DEBUG:', ...args);
      sr();
    });
  }
})();
