import { Component, createResource, createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Info } from 'lucide-solid';

import { getCurrentTab } from '../../../utils/utils';
import { Game, GameType, getCurrentGame } from '../../../games';
import { useUser } from '../../userContext';
import SignInCard from '../../components/SignInCard';
import GameUndetected from './GameUndetected';
import Wordle from './Wordle';

function LeaderboardPageWrapper() {
  const { data } = useUser();
  const [tab] = createResource(getCurrentTab);

  const options: Record<GameType, Component> = {
    [Game.None]: GameUndetected,
    [Game.Wordle]: Wordle,
  };

  const header: Record<GameType, string> = {
    [Game.None]: 'Leaderboard',
    [Game.Wordle]: 'Wordle',
  };

  const [noteExpanded, setNoteExpanded] = createSignal(false);

  const notes: Record<GameType, string> = {
    [Game.None]: '',
    [Game.Wordle]: 'Wordle time is calculated starting from the first word.',
  };

  const currentGame = () => getCurrentGame(tab()?.url ?? '');

  return (
    <div class="h-full flex flex-col grow">
      <div class="mb-4 flex flex-row">
        <h1 class="text-2xl font-bold leading-none tracking-tight">
          {header[currentGame()]}
        </h1>
        <Show when={notes[currentGame()].length > 0}>
          <button class="ml-auto" onclick={() => setNoteExpanded((v) => !v)}>
            <Info size={16} />
          </button>
        </Show>
      </div>
      <section
        class="h-12 transition-[height] duration-100"
        style={{
          height: noteExpanded() ? '3rem' : '0',
          opacity: noteExpanded() ? '100%' : '0%',
        }}
      >
        <p class="text-sm">{notes[currentGame()]}</p>
      </section>
      <Show when={!data.loading && !data()?.user}>
        <SignInCard />
      </Show>
      <Show when={!tab.loading} fallback={<span>Loading...</span>}>
        <Dynamic component={options[getCurrentGame(tab()?.url ?? '')]} />
      </Show>
    </div>
  );
}

export default LeaderboardPageWrapper;
