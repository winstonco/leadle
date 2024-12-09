import { createSignal } from 'solid-js';

function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <h1>App</h1>
      <button onclick={() => setCount((v) => v + 1)}>{count()}</button>
    </>
  );
}

export default Home;
