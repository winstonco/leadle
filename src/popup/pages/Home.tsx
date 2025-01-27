import { Show } from 'solid-js';
import { useUser } from '../userContext';
import SignInCard from '../components/SignInCard';

function HomePage() {
  const { data } = useUser();

  return (
    <div class="flex flex-col items-center">
      <Show when={!data.loading && !data()?.user}>
        <SignInCard />
      </Show>
      <h1>Home</h1>
      <Show when={!data.loading && data()?.user}>
        <h2>Hello, {data()?.user?.user_metadata.full_name}</h2>
      </Show>
    </div>
  );
}

export default HomePage;
