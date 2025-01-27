export const Game = {
  None: 0,
  Wordle: 1,
} as const;

export type GameType = (typeof Game)[keyof typeof Game];

export function getCurrentGame(url: string): GameType {
  if (url.includes('wordle')) {
    return Game.Wordle;
  }
  return Game.None;
}
