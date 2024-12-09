import { typedMessenger } from '../utils/TypedMessenger';
import { isDev } from '../utils/utils';

(async () => {
  if (await isDev()) {
    typedMessenger.addListener('debug', 'log', (_, __, ...args) => {
      console.log('DEBUG:', ...args);
    });
  }
})();
