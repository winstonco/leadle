import { Navigate } from '@solidjs/router';
import { Game, getCurrentGame } from '../../games';
import { createResource, Show } from 'solid-js';
import { getCurrentTab } from '../../utils/utils';

function Redirect() {
  const [tab] = createResource(getCurrentTab);

  return (
    <Show when={!tab.loading}>
      <Show
        when={getCurrentGame(tab()?.url ?? '') === Game.None}
        fallback={<Navigate href="/leaderboard" />}
      >
        <Navigate href="/" />
      </Show>
    </Show>
  );
}

export default Redirect;
