import { JSX, ParentProps } from 'solid-js';
import Navbar from '../components/Navbar';
import { redirect, useLocation } from '@solidjs/router';

function App(props: ParentProps): JSX.Element {
  const location = useLocation();

  return (
    <div class="h-full flex flex-col">
      <h1 class="text-xl font-bold text-center" onclick={() => redirect('/')}>
        Leadle
      </h1>
      <Navbar />
      <hr />
      <button
        onclick={() => {
          console.log(location.pathname);
        }}
      >
        path
      </button>
      {props.children}
    </div>
  );
}

export default App;
