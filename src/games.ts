export const Game = {
  None: 0,
  Wordle: 1,
} as const;

export type GameType = (typeof Game)[keyof typeof Game];

export function getCurrentGame(url: string): GameType {
  if (url === 'https://www.nytimes.com/games/wordle/index.html') {
    return Game.Wordle;
  }
  return Game.None;
}
