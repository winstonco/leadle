import { AuthSession } from "@supabase/supabase-js";
import { WordleGameStatus, WordleState, WordleUserData } from "../scripts/nyt";
import { typedMessenger } from "../utils/TypedMessenger";
import { getCurrentTab } from "../utils/utils";
import { supabase } from "../utils/supabase";
import { webRequestObservable } from "./intercept";

console.log("nyt.js");

async function onStateChange(prev: WordleState, curr: WordleState) {
  const a = prev.states[0];
  const b = curr.states[0];
  // check if new puzzle
  if (a.puzzleId !== b.puzzleId) {
    // different puzzle id
    return;
  }
  // check if board has changed
  if (a.data.currentRowIndex === b.data.currentRowIndex) {
    // no board change
  }
  // board updated
  // update database
  console.log(b.data);
  const sbUid =
    (await typedMessenger.sendMessage("auth", "getAuthSession") as AuthSession)
      .user.id;

  const userData = chrome.storage.local.get("wordleUserData");
  // if just started
  let startTime = -1;
  if (a.data.currentRowIndex === 0 && b.data.currentRowIndex === 1) {
    // is this init stuff?
    startTime = Date.now();
    // TODO MAYBE ABOVE
    // check if the row for today exists already and compare with now
  }

  supabase.from("user_wordle_stats").upsert({
    user_id: sbUid,
    puzzle_id: Number.parseInt(b.puzzleId),
    puzzle_date: b.printDate,
    status: WordleGameStatus[b.data.status],
    hard_mode: b.data.hardMode,
    board_state: b.data.boardState,
    updated_at: (new Date()).toISOString(),
    start_time: "",
    end_time: "",
  });
}

// Listen for when NYT sends data back to their server (this happens when the player updates their game state)
webRequestObservable.subscribe(async (_) => {
  // Get new game state
  const t = await getCurrentTab();
  if (!t || !t.id || !t.url || !t.url.includes("://www.nytimes.com")) return;
  const gameState = await typedMessenger.sendTabMessage(
    t.id,
    "nyt",
    "getWordleState",
  ) as WordleState;
  const { wordleState } = await chrome.storage.local.get("wordleState");
  onStateChange(wordleState, gameState);
  await chrome.storage.local.set({ wordleState: gameState });
});

export async function getUid(): Promise<string> {
  const c = await chrome.cookies.get({
    name: "nyt-jkidd",
    url: "https://www.nytimes.com",
  });
  if (c) {
    // ["x=a&y=b&z=c"]
    const kvString = decodeURI(c.value).split("&");
    // ["x=a", "y=b", "z=c"]
    for (const kv of kvString) {
      const [k, v] = kv.split("=");
      if (k === "uid") {
        return v;
      }
    }
  }
  return "ANON";
}

typedMessenger.addListener("nyt", "uid", async (sendResponse) => {
  const uid = await getUid();
  sendResponse(uid);
});
