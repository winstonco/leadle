import {
  createResource,
  createSignal,
  For,
  JSX,
  onMount,
  ParentProps,
} from 'solid-js';
import Navbar from './components/Navbar';
import { A, Route, Router } from '@solidjs/router';
import { User } from '@supabase/supabase-js';
import { render } from 'solid-js/web';

import './app.css';
import { typedMessenger } from '../utils/TypedMessenger';
import { UserContext } from './userContext';

import StartupPage from './pages/Startup';
import HomePage from './pages/Home';
import LeaderboardPageWrapper from './pages/leaderboard/LeaderboardPageWrapper';
import SettingsPage from './pages/Settings';
import SignedIn from './pages/SignedIn';
import Redirect from './pages/Redirect';

const getUser = async () => {
  const { data, error } = await typedMessenger.sendMessage(
    'auth',
    'getAuthSession'
  );
  if (data.session && data.session.user) {
    return {
      user: data.session.user as User | null,
      error: error as Error | null,
    };
  }
  return { user: null, error: error };
};

function App(props: ParentProps): JSX.Element {
  const [res, { refetch }] = createResource(getUser);

  return (
    <div class="h-full flex flex-col">
      <h1 class="text-xl font-bold text-center pt-2">
        <A href="/">Leadle</A>
      </h1>
      <Navbar />
      <hr />
      <UserContext.Provider
        value={{
          data: res,
          refetch: refetch,
        }}
      >
        <div class="p-4 flex-grow">{props.children}</div>
      </UserContext.Provider>
      {/* {JSON.stringify(user())} */}
    </div>
  );
}

const pages = [
  {
    path: '/popup/index.html',
    component: StartupPage,
  },
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/leaderboard',
    component: LeaderboardPageWrapper,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
  {
    path: '/signed-in',
    component: SignedIn,
  },
  {
    path: '/_/redirect',
    component: Redirect,
  },
];

const root = document.getElementById('root');

render(
  () => (
    <Router root={App}>
      <For each={pages}>
        {(page) => <Route path={page.path} component={page.component} />}
      </For>
      <Route path="*paramName" component={() => <h1>Not Found</h1>} />
    </Router>
  ),
  root!
);
