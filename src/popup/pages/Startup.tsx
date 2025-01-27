import { Navigate } from '@solidjs/router';

// only used when the popup is opened
function StartupPage() {
  return <Navigate href="/_/redirect" />;
  // return <Navigate href="/signed-in" />;
}

export default StartupPage;
