# Leadle

It's a dles leaderboard chrome extension. It tracks and sells your data in exchange for money. Discord bot coming soon.

# Developers

Use the watch script to get live extension updates

## Supabase

### Local development

You may need to update with `npm update supabase --save-dev`

Initialize with: `npx supabase init`

Start: `npx supabase start`

In sw/auth.ts make sure the project url and anon key are correct.

#### Env vars

`supabase/.env`
- SUPABASE_AUTH_EXTERNAL_DISCORD_SECRET
`supabase/functions/.env`
- CLIENT_ID
- CLIENT_SECRET