# Supabase Edge Function: seed-sentences

This Edge Function securely seeds sentence topics, full sentences, words, and relational sentence blocks from a JSON payload into Supabase PostgreSQL.

## Environment Variables Required

In Supabase Dashboard -> Edge Functions -> `seed-sentences` -> Settings (or secrets via CLI):

- `SUPABASE_URL`: Your Supabase project URL (`https://<project-ref>.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY`: Service role secret key (never exposed to client).

## Deployment

Deploy using the Supabase CLI:

```bash
supabase functions deploy seed-sentences --project-ref <your-project-ref>
```

## Invoking the Function

You can invoke the function by sending an HTTP POST with the array of sentence objects in the request body:

```bash
curl -X POST 'https://<project-ref>.functions.supabase.co/seed-sentences' \
  -H 'Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>' \
  -H 'Content-Type: application/json' \
  --data-binary @dataset.json
```
