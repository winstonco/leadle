import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DiscordSignIn from './DiscordSignIn';
import { User } from '@supabase/supabase-js';
import { useUser } from '../userContext';
import { useNavigate } from '@solidjs/router';

export type OnSignInCallback = (result: {
  data: User | null;
  error: Error | null;
}) => void;

function SignInCard() {
  const navigate = useNavigate();
  const { refetch } = useUser();

  const onSignIn: OnSignInCallback = async ({ data, error }) => {
    if (error !== null) {
      console.error(error.message, error);
      return;
    }
    console.log(data);
    refetch();
    const { showSignedIn } = await chrome.storage.local.get('showSignedIn');
    if (showSignedIn ?? true) {
      navigate('/signed-in');
    }
  };
  return (
    <Card class="w-5/6 my-4 mx-auto">
      <CardHeader>
        <CardTitle class="text-lg">You are not signed in!</CardTitle>
        <CardDescription>
          To see scores from your groups, sign in below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-base mb-3">Sign in with:</p>
        <Tooltip>
          <TooltipTrigger>
            <DiscordSignIn callback={onSignIn} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in with Discord OAuth</p>
          </TooltipContent>
        </Tooltip>
      </CardContent>
      <CardFooter>
        <p>This will open a new window.</p>
      </CardFooter>
    </Card>
  );
}

export default SignInCard;
