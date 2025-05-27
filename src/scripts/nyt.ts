import { AuthSession } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { typedMessenger } from "../utils/TypedMessenger";

export enum WordleGameStatus {
  WIN = 0,
  LOSS = 1,
  IN_PROGRESS = 2,
}

export type WordleState = {
  states: {
    data: {
      boardState: string[];
      currentRowIndex: number;
      hardMode: boolean;
      isPlayingArchive: boolean;
      setLegacyStats: {
        autoOptInTimestamp: number;
        currentStreak: number;
        gamesPlayed: number;
        gamesWon: number;
        guesses: {
          1: number;
          2: number;
          3: number;
          4: number;
          5: number;
          6: number;
          fail: number;
        };
        hasMadeStatsChoice: boolean;
        hasPlayed: boolean;
        lastWonDayOffset: number;
        maxStreak: number;
        timestamp: number;
      };
      status: keyof typeof WordleGameStatus;
    };
    printDate: string;
    puzzleId: string;
    schemaVersion: string;
    timestamp: number;
  }[];
};

export type WordleUserData = {
  state: WordleState;
  startTime?: number;
  endTime?: number;
};

(async () => {
  console.log("nyt.js");

  async function getUid(): Promise<string> {
    const uid = await typedMessenger.sendMessage("nyt", "uid");
    return uid;
  }

  async function getLocalWordleGameState(): Promise<WordleState | null> {
    const uid = await getUid();
    const gameStateStorage = window.localStorage.getItem(
      `games-state-wordleV2/${uid}`,
    );
    if (!gameStateStorage) {
      return null;
    }
    const gameState = JSON.parse(gameStateStorage);
    console.log(gameState);
    return gameState as WordleState;
  }

  typedMessenger.addListener(
    "nyt",
    "getWordleState",
    async (sendResponse) => sendResponse(await getLocalWordleGameState()),
  );

  // INIT
  const supabaseUid = (await typedMessenger.sendMessage(
    "auth",
    "getAuthSession",
  ) as AuthSession)
    .user.id;

  // get local game states
  const wordleGameState = await getLocalWordleGameState();
  if (wordleGameState) {
    const todayState = wordleGameState.states[0];
    // compare local with upstream
    const { data, error } = await supabase
      .from("user_wordle_stats")
      .select()
      .eq("user_id", supabaseUid)
      .eq("puzzle_id", Number.parseInt(todayState.puzzleId));
    if (error) {
      // handle error
      console.log("Error fetching from db:", error);
      return;
    }
    if (data) {
      const upstream = data[0];
      if (upstream.board_state !== todayState.data.boardState) {
        // invalid
        // maybe notify about invalid data
      }
      data[0].puzzle_id;
    }
  }
})();
