import { render } from 'solid-js/web';
import { Navigate, Route, Router } from '@solidjs/router';
import './app.css';
import App from './pages/App';
import Home from './pages/Home';
import LeaderboardPageWrapper from './pages/leaderboard/LeaderboardPageWrapper';

const root = document.getElementById('root');

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route
        path="/popup/index.html"
        component={() => <Navigate href="/leaderboard" />}
      />
      <Route path="/leaderboard" component={LeaderboardPageWrapper} />
      <Route path="*paramName" component={() => <h1>Not Found</h1>} />
    </Router>
  ),
  root!
);
