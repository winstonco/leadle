import { Button } from '@/components/ui/button';

function GameUndetected() {
  const goToGame = (url: string) => {
    chrome.tabs.create({
      active: true,
      url: url,
    });
  };
  return (
    <>
      <h2 class="text-base font-normal">Game not detected.</h2>
      <h2 class="text-base font-normal mb-4">Did you mean one of these?</h2>
      <Button
        variant="link"
        onclick={() => goToGame('https://www.nytimes.com/games/wordle')}
      >
        NYT Wordle
      </Button>
      <Button
        variant="link"
        onclick={() => goToGame('https://www.nytimes.com/games/connections')}
      >
        NYT Connections
      </Button>
    </>
  );
}
export default GameUndetected;
