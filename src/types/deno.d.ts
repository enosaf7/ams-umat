
// This file provides type definitions for the Deno runtime
// which is used by Supabase Edge Functions

declare namespace Deno {
  export const env: {
    get(key: string): string | undefined;
  };
}

// Add declarations for Deno modules that we're using
declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(url: string, key: string, options?: any): any;
}
