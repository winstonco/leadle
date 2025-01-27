import { AuthResponse, Session } from "@supabase/supabase-js";
import { typedMessenger } from "../utils/TypedMessenger";
import { createClient } from "@supabase/supabase-js";

console.log("auth.js");

export const supabaseUrl = "https://whufepqlmhkcqqvbbvri.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodWZlcHFsbWhrY3FxdmJidnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MzQ0NTEsImV4cCI6MjA0OTMxMDQ1MX0.nP5_zjMGiiBGw5GfmmnwV5rIcGuIix_NuxIGP6FpER8";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type ProviderSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
};

// #region utilities
async function getAuthSessionFromStorage(): Promise<Session | undefined> {
  const { authSession } = await chrome.storage.local.get("authSession");
  if (!authSession || typeof authSession !== "string") {
    return undefined;
  }
  return JSON.parse(authSession) as Session;
}

async function setAuthSessionInStorage(data: Session) {
  await chrome.storage.local.set({
    authSession: JSON.stringify(data),
  });
}

async function removeAuthSessionFromStorage() {
  await chrome.storage.local.remove("authSession");
}

async function getProviderSessionFromStorage(): Promise<
  ProviderSession | undefined
> {
  const { providerSession } = await chrome.storage.local.get("providerSession");
  if (!providerSession || typeof providerSession !== "string") {
    return undefined;
  }
  return JSON.parse(providerSession) as ProviderSession;
}

async function setProviderSessionInStorage(data: ProviderSession) {
  await chrome.storage.local.set({
    providerSession: JSON.stringify(data),
  });
}

async function removeProviderSessionFromStorage() {
  await chrome.storage.local.remove("providerSession");
}
// #endregion

// #region session utilities
/**
 * Returns a new session, regardless of expiry status.
 * @returns The new Discord auth session. If `data` or `error` !== `null`, the
 * other will be `null`.
 * @see https://supabase.com/docs/reference/javascript/auth-refreshsession
 */
async function refreshDiscordSession(
  currentSession: { refresh_token: string },
): Promise<{ data: ProviderSession | null; error: Error | null }> {
  const { refresh_token } = currentSession;

  const LOCAL_SUPABASE = createClient(
    "http://127.0.0.1:54321",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
  );

  const { data, error } = await LOCAL_SUPABASE.functions.invoke(
    "discord-auth",
    {
      body: { action: "refreshToken", refreshToken: refresh_token },
    },
  );
  if (error) {
    return { data: null, error };
  }
  const session: ProviderSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
    expires_in: data.expires_in,
    token_type: data.token_type,
  };
  return { data: session, error: null };
}

/**
 * Returns the session, refreshing it if necessary. If there is no current
 * session. Both `data` and `error` will be `null`.
 * @returns The Discord auth session, if any.
 * @see https://supabase.com/docs/reference/javascript/auth-getsession
 */
async function getDiscordSession(): Promise<
  { data: ProviderSession | null; error: Error | null }
> {
  const providerSession = await getProviderSessionFromStorage();
  if (!providerSession) {
    return { data: null, error: null };
  }
  console.log("Session found", providerSession);
  // check expiration date
  if (Math.floor(Date.now() / 1000) < providerSession.expires_at) {
    // still valid
    return { data: providerSession, error: null };
  }
  // invalid, try refresh
  return await refreshDiscordSession(providerSession);
}

/**
 * Returns the session, refreshing it if necessary.
 * @returns The Supabase auth session, if any.
 * @see https://supabase.com/docs/reference/javascript/auth-getsession
 */
async function getAuthSession(): Promise<AuthResponse> {
  const authSession = await getAuthSessionFromStorage();
  if (!authSession) {
    return { data: { session: null, user: null }, error: null };
  }
  console.log("Session found", authSession);
  // check expiration date
  const todayEpoch = Math.floor(Date.now() / 1000);
  if (todayEpoch < authSession.expires_at!) {
    // still valid
    return {
      data: { session: authSession, user: authSession.user },
      error: null,
    };
  }
  // invalid, try refresh
  return await supabase.auth.refreshSession(authSession);
}
// #endregion

type Sessions = {
  supabase: Session;
  discord: ProviderSession;
};

/**
 * Refreshes both Supabase auth and Discord user sessions and saves them in
 * extension local storage if both are refreshed successfully.
 */
async function refreshSessions(): Promise<
  { data: Sessions | null; error: Error | null }
> {
  try {
    console.log("Refreshing sessions...");
    let newSupabaseSession: Session;
    let newDiscordSession: ProviderSession;

    // get saved supabase session
    {
      console.log("Retrieving current auth session...");
      const authSession = await getAuthSessionFromStorage();
      if (!authSession) {
        console.log("No auth session found.");
        return { data: null, error: new Error("No auth session found.") };
      }
      // try refresh
      console.log("Supabase auth session found.");
      const { data, error } = await supabase.auth.refreshSession(authSession);
      if (error !== null) {
        // something went wrong!
        console.log(
          "Error refreshing Supabase auth session. Removing old tokens...",
        );
        await removeAuthSessionFromStorage();
        return { data: null, error };
      } else {
        // successful refresh
        newSupabaseSession = data.session!;
      }
    }

    // get saved discord session
    {
      const providerSession = await getProviderSessionFromStorage();
      console.log("Retrieving current provider session...");
      if (!providerSession) {
        console.log("No provider session found.");
        return { data: null, error: new Error("No provider session found.") };
      }
      // try refresh
      console.log("Discord user session found.");
      const { data, error } = await refreshDiscordSession(providerSession);
      if (error !== null) {
        // something went wrong!
        console.log(
          "Error refreshing Discord user session. Removing old tokens...",
        );
        await removeProviderSessionFromStorage();
        return { data: null, error };
      } else {
        // successful refresh
        newDiscordSession = data!;
      }
    }

    console.log("Successfully refreshed sessions.");
    console.log("Saving new sessions...");
    await setAuthSessionInStorage(newSupabaseSession);
    await setProviderSessionInStorage(newDiscordSession);

    return {
      data: {
        supabase: newSupabaseSession,
        discord: newDiscordSession,
      },
      error: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        data: null,
        error: error,
      };
    }
    return { data: null, error: new Error("An unknown error occurred.") };
  }
}

async function signInWithDiscord(
  callback: (responseUrl?: string) => Promise<void>,
) {
  const chromeRedirectUrl = encodeURI(chrome.identity.getRedirectURL());

  const url = new URL(`${supabaseUrl}/auth/v1/authorize`);
  url.searchParams.set("provider", "discord");
  url.searchParams.set("redirect_to", chromeRedirectUrl);
  url.searchParams.set("scope", "identify guilds");

  chrome.identity.launchWebAuthFlow(
    {
      url: url.href,
      interactive: true,
    },
    callback,
  );
}

typedMessenger.addListener("auth", "refreshSessions", async (sendResponse) => {
  const { data, error } = await refreshSessions();
  sendResponse({ data, error });
});

typedMessenger.addListener("auth", "signIn", async (sendResponse) => {
  const { data, error } = await refreshSessions();
  if (error === null) {
    sendResponse({ data, error });
    return;
  }

  // session not found, so go through full oauth flow
  await signInWithDiscord(async (redirectedTo) => {
    if (chrome.runtime.lastError) {
      // auth was not successful
      sendResponse({ data: null, error: chrome.runtime.lastError });
    } else {
      // auth was successful, extract the ID token from the redirectedTo URL
      const url = new URL(redirectedTo!);
      const params = new URLSearchParams(url.hash.slice(1));
      const access_token = params.get("access_token")!;
      const refresh_token = params.get("refresh_token")!;
      const provider_token = params.get("provider_token")!;
      const provider_refresh_token = params.get("provider_refresh_token")!;
      const expires_at = Number.parseInt(params.get("expires_at")!);
      const expires_in = Number.parseInt(params.get("expires_in")!);
      const token_type = params.get("token_type")!;
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (error !== null) {
        sendResponse({ data, error });
        return;
      }
      await setAuthSessionInStorage(data.session!);
      await setProviderSessionInStorage({
        access_token: provider_token,
        refresh_token: provider_refresh_token,
        expires_at: expires_at,
        expires_in: expires_in,
        token_type: token_type,
      });

      sendResponse({ data, error });
    }
  });
});

typedMessenger.addListener("auth", "getAuthSession", async (sendResponse) => {
  sendResponse(await getAuthSession());
});

typedMessenger.addListener(
  "auth",
  "getProviderSession",
  async (sendResponse) => {
    sendResponse(await getDiscordSession());
  },
);
