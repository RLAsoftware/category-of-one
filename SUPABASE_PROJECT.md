# Supabase Project Configuration

## ⚠️ CRITICAL: Production Database

This project **MUST** always connect to:

```
https://oonsnlwzipwdnbicqysr.supabase.co
```

## Safety Checks

The codebase includes automatic validation in `src/lib/supabase.ts` that will:
- ✅ Verify the correct Supabase URL is being used
- ❌ Throw an error if the wrong project is detected
- 📝 Log confirmation when connected correctly

## Environment Variables

Set these in your deployment platform (Vercel):

```bash
VITE_SUPABASE_URL=https://oonsnlwzipwdnbicqysr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

## For Developers

If you see the error "WRONG SUPABASE PROJECT DETECTED", this means:
1. Your `.env` file has the wrong URL
2. Your Vercel environment variables are incorrect
3. Update to use the production URL shown above

## MCP Configuration

If using Supabase MCP for database operations:
1. Only configure the MCP for `oonsnlwzipwdnbicqysr.supabase.co`
2. Remove any other Supabase MCP connections
3. This prevents accidental migrations to wrong databases

## Project Info

- **Project Name**: Category Of One
- **Project URL**: https://oonsnlwzipwdnbicqysr.supabase.co
- **Project ID**: oonsnlwzipwdnbicqysr

