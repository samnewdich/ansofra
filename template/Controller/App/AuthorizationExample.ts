/**
 * Controller/App/AuthorizationExample.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Controller/App/AuthorizationExample.php.
 *
 * Use this pattern at the top of any controller that should only
 * work for logged-in users:
 *
 *   const newAuth = new Authorization(req);
 *   const auth = JSON.parse(newAuth.authorize());
 *   if (auth.status !== "success") { ...reject... }
 *   // auth.response.user_id and auth.response.role are available
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import { Authorization } from "../../Auth/Authorization";
import { sendJson } from "../../route/helpers";

export async function AuthorizationExample(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const newAuth = new Authorization(req);
  const auth = newAuth.authorize();
  // returns an encoded object of {"status":"failed or success", "response":"user id or error response"}
  sendJson(res, auth);
}
