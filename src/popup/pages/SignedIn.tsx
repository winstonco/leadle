import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { useUser } from '../userContext';
import { Card, CardHeader } from '@/components/ui/card';
import { createSignal } from 'solid-js';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@solidjs/router';

function SignedIn() {
  const [checked, setChecked] = createSignal(false);
  const { data } = useUser();
  const navigate = useNavigate();

  const onClickDone = async () => {
    await chrome.storage.local.set({ showSignedIn: !checked() });
    navigate('/_/redirect');
  };

  return (
    <div class="h-full flex flex-col items-center justify-center gap-4">
      <p class="text-base">Signed in as</p>
      <Card>
        <CardHeader>
          <div class="flex flex-row items-center gap-4">
            <img
              class="w-[50px] rounded-full outline outline-1"
              src={data()?.user?.user_metadata.avatar_url}
              alt="User avatar"
            />
            <span class="text-base font-medium">
              {data()?.user?.user_metadata.full_name}
            </span>
          </div>
        </CardHeader>
      </Card>
      <div class="mt-4"></div>
      <Checkbox
        class="flex items-start space-x-2"
        checked={checked()}
        onChange={setChecked}
      >
        <CheckboxControl />
        <CheckboxLabel class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Don&apos;t show this again
        </CheckboxLabel>
      </Checkbox>
      <Button variant="secondary" onclick={onClickDone}>
        Done
      </Button>
    </div>
  );
}

export default SignedIn;
