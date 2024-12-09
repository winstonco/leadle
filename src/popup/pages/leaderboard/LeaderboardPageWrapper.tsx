import { Component, createResource, Show } from 'solid-js';
import { getCurrentTab } from '../../../utils/utils';

import Wordle from './Wordle';
import { Game, GameType, getCurrentGame } from '../../../games';
import { Dynamic } from 'solid-js/web';

function LeaderboardPageWrapper() {
  const [tab] = createResource(getCurrentTab);

  const options: Record<GameType, Component> = {
    [Game.None]: () => <span>Game not detected.</span>,
    [Game.Wordle]: Wordle,
  };

  return (
    <div class="h-full flex flex-col grow">
      <h1>Leaderboard</h1>
      <Show when={!tab.loading} fallback={<span>Loading...</span>}>
        <Dynamic component={options[getCurrentGame(tab()?.url ?? '')]} />
      </Show>
    </div>
  );
}

export default LeaderboardPageWrapper;
