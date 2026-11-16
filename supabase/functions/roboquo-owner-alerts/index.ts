// Server-only, opt-in. Deploy only after provider accounts, consent, and secrets are configured.
import { makeHandler } from "./notifications.mjs";
Deno.serve(makeHandler({getEnv:(name:string)=>Deno.env.get(name)}));
