import { Button } from '@/components/ui/button';

import { typedMessenger } from '../../utils/TypedMessenger';
import { OnSignInCallback } from './SignInCard';

function DiscordSignIn(props: { callback: OnSignInCallback }) {
  const signIn = async () => {
    console.log('Sign in');
    try {
      const { data, error } = await typedMessenger.sendMessage(
        'auth',
        'signIn'
      );
      props.callback({ data, error });
    } catch (error) {
      // why did I write such complete error handling here?
      if (error instanceof Error) {
        console.error(error);
        props.callback({ data: null, error });
      } else if (typeof error === 'string') {
        props.callback({ data: null, error: new Error(error) });
      } else if (error != null) {
        props.callback({ data: null, error: new Error(error.toString()) });
      } else {
        props.callback({
          data: null,
          error: new Error('An unknown error occured.'),
        });
      }
    }
  };

  return (
    <Button variant="outline" onclick={signIn} class="flex flex-row gap-2">
      <img
        src="../../assets/discord_logo_full.svg"
        alt="Discord Icon"
        class="h-full"
      />
      {/* Discord */}
    </Button>
  );
}

export default DiscordSignIn;
