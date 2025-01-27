// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

async function refreshToken(
  API_ENDPOINT: string,
  CLIENT_ID: string,
  CLIENT_SECRET: string,
  refreshToken: string,
): Promise<Response> {
  const res = await fetch(`${API_ENDPOINT}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "client_id": CLIENT_ID,
      "client_secret": CLIENT_SECRET,
      "grant_type": "refresh_token",
      "refresh_token": refreshToken,
    }),
  });
  const newRes = new Response(res.body, {
    headers: res.headers,
    status: res.status,
    statusText: res.statusText,
  });
  newRes.headers.append(
    "leadle-API-Version",
    "leadle.supabase.discord-auth.refreshToken.v1",
  );
  return newRes;
}

async function getSelf(
  API_ENDPOINT: string,
  accessToken: string,
): Promise<Response> {
  const res = await fetch(`${API_ENDPOINT}/users/@me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const newRes = new Response(res.body, {
    headers: res.headers,
    status: res.status,
    statusText: res.statusText,
  });
  newRes.headers.append(
    "leadle-API-Version",
    "leadle.supabase.discord-auth.getSelf.v1",
  );
  return newRes;
}

class ErrorResponse extends Response {
  constructor(message: string) {
    super(
      JSON.stringify({
        error: message,
      }),
      {
        status: 400,
      },
    );
  }
}

// ChatGPT
Deno.serve(async (req) => {
  try {
    const reqBody = await req.json();
    console.log(reqBody);
    const action = reqBody.action;
    if (!action) {
      return new ErrorResponse("Missing function action");
    }
    const API_ENDPOINT = "https://discord.com/api/v10";
    const CLIENT_ID = Deno.env.get("CLIENT_ID");
    if (!CLIENT_ID) {
      return new ErrorResponse(
        "Missing env vars CLIENT_ID",
      );
    }
    const CLIENT_SECRET = Deno.env.get("CLIENT_SECRET");
    if (!CLIENT_SECRET) {
      return new ErrorResponse(
        "Missing env vars CLIENT_SECRET",
      );
    }

    switch (action) {
      case "validate":
      case "getSelf": {
        if (!reqBody.accessToken) {
          return new ErrorResponse("Missing accessToken in body");
        }
        return await getSelf(API_ENDPOINT, reqBody.accessToken);
      }
      case "refreshToken": {
        if (!reqBody.refreshToken) {
          return new ErrorResponse("Missing refreshToken in body");
        }
        return await refreshToken(
          API_ENDPOINT,
          CLIENT_ID,
          CLIENT_SECRET,
          reqBody.refreshToken,
        );
      }
      default:
        return new ErrorResponse("Unknown function action");
    }
  } catch (e) {
    console.error("Error:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
});
