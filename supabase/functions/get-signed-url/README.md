Deployment & configuration

1) Ensure you have the Supabase CLI installed and you're logged in.

2) From repo root, deploy the function:

```bash
supabase functions deploy get-signed-url --project-ref <your-project-ref>
```

3) In Supabase Console -> Edge Functions -> select the function -> Settings, add environment variables:

- AVATAR_SERVICE_ROLE_KEY = <your service role key from Project -> Settings -> API>
- SUPABASE_URL = <your supabase url>

4) Grant permission for the function to run (if needed) or set up CORS as required.

Notes:
- Do NOT expose the service_role key to the frontend.
- After deploying, the function will be available at: `https://<region>-<project>.functions.supabase.co/get-signed-url` and can be invoked from the client via `supabase.functions.invoke('get-signed-url', { body: { path, expires } })`.
