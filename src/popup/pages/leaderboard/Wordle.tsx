import {
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { DATA_ACCESS } from '../../../data/data';
import { Star } from 'lucide-solid';
import { msToMMSS } from '../../../utils/utils';

async function fetchUserData() {
  const { userData } = await DATA_ACCESS.getData('userData');
  return userData?.states[0];
}

async function fetchGameLeaderboardData() {
  // artificial wait time
  await new Promise((res) => setTimeout(res, 500));
  const data = [
    {
      user: {
        name: 'ethan',
      },
      gameData: {
        data: {
          boardState: [],
          currentRowIndex: 3,
          hardMode: false,
          isPlayingArchive: false,
          setLegacyStats: {},
          status: 'WIN',
        },
      },
    },
    {
      user: {
        name: 'otherguy',
      },
      gameData: {
        data: {
          boardState: [],
          currentRowIndex: 6,
          hardMode: true,
          isPlayingArchive: false,
          setLegacyStats: {},
          status: 'LOSS',
        },
      },
    },
    {
      user: {
        name: 'toby',
      },
      gameData: {
        data: {
          boardState: [],
          currentRowIndex: 2,
          hardMode: true,
          isPlayingArchive: false,
          setLegacyStats: {},
          status: 'WIN',
        },
      },
    },
  ];
  return data;
}

/**
 * Props:
 * name: string
 * time: number (ms)
 * currentRowIndex: number
 * hardMode: boolean
 * status: string (IN_PROGRESS, WIN)
 */
function LeaderboardLine({
  name,
  time,
  currentRowIndex,
  hardMode,
  status,
}: {
  name: string;
  time: number;
  currentRowIndex: number;
  hardMode: boolean;
  status: string;
}) {
  let outer!: HTMLLIElement;
  let inner!: HTMLDivElement;

  onMount(() => {
    // get score fraction
    let x: number;
    if (status != 'IN_PROGRESS') {
      x = currentRowIndex / 6;
    } else {
      x = 1;
    }
    inner.style.width = `${outer.clientWidth * x}px`;
  });

  return (
    <li ref={outer} class="relative w-full h-10 flex flex-row items-center">
      <div class="absolute z-10 flex flex-row gap-4 items-center">
        <span>{name}</span>
        <Star fill={hardMode ? 'black' : 'none'} size={12} />
      </div>
      <span class="absolute z-10 right-0">
        {time === -1 ? 'DNF' : msToMMSS(time)}
      </span>
      <div
        ref={inner}
        class="absolute z-0 bg-neutral-200 h-full transition-[width] ease-in-out duration-300"
        style={{ width: 0 }}
      ></div>
    </li>
  );
}

function Wordle() {
  const [lastFetch, setLastFetch] = createSignal(Date.now());

  const [userData, { refetch }] = createResource(fetchUserData);

  const [gameLeaderboardData] = createResource(fetchGameLeaderboardData);

  const toSorted = (a: any) =>
    a.toSorted(
      (a: any, b: any) =>
        a.gameData.data.currentRowIndex - b.gameData.data.currentRowIndex
    );

  return (
    <>
      <h1>Wordle</h1>
      <div>
        <ul>
          <Show
            when={!userData.loading}
            fallback={<span>Loading today&apos;s stats...</span>}
          >
            {((u) => (
              <LeaderboardLine
                name="winstonco"
                time={999}
                currentRowIndex={u.data.currentRowIndex}
                hardMode={u.data.hardMode}
                status={u.data.status}
              />
            ))(userData())}
          </Show>
          <Show
            when={!gameLeaderboardData.loading}
            fallback={<span>Fetching leaderboard...</span>}
          >
            <For each={toSorted(gameLeaderboardData())}>
              {(entry, i) => (
                <LeaderboardLine
                  name={entry.user.name}
                  time={123456}
                  currentRowIndex={entry.gameData.data.currentRowIndex}
                  hardMode={entry.gameData.data.hardMode}
                  status={entry.gameData.data.status}
                />
              )}
            </For>
          </Show>
        </ul>
      </div>

      <span class="mt-auto">
        Last Updated:{' '}
        {Intl.DateTimeFormat(navigator.language, {
          timeStyle: 'medium',
        }).format(new Date(lastFetch()))}
      </span>
    </>
  );
}

export default Wordle;
