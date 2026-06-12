/**
 * Controller/App/AuthenticationExample.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Controller/App/AuthenticationExample.php.
 *
 * This is the LOGIN controller pattern:
 *   1. read the incoming JSON body
 *   2. wrap it in the AnsofraDto
 *   3. run the Login query (app/Query/Login)
 *   4. if login succeeds, authenticate the user with JWT
 *      (Auth/Authentication sets the HttpOnly cookie)
 *   5. send the result back
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import { AnsofraDto } from "../../Dto/AnsofraDto";
import { Index as Middleware } from "../../Middleware/Index";
import { Authentication } from "../../Auth/Authentication";
import { Login } from "../../app/Query/Login";
import { readJsonBody, sendJson } from "../../route/helpers";

export async function AuthenticationExample(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const incoming = await readJsonBody(req);
  const newdto = new AnsofraDto(incoming);
  const newMiddleware = new Middleware();

  const newLogin = new Login(newdto, newMiddleware);
  const newLoginProcess = await newLogin.process();
  const newLoginRes = JSON.parse(newLoginProcess);

  if (newLoginRes.status === "success") {
    // Now authenticate the user via JWT
    const newAuth = new Authentication();
    const auth = newAuth.auth(res, newMiddleware.cleanData(incoming?.email ?? ""), "user");
    const authRes = JSON.parse(auth);

    if (authRes.status === "success") {
      sendJson(res, JSON.stringify({ status: "success", response: newLoginRes.response }, null, 4));
    } else {
      sendJson(res, auth);
    }
  } else {
    sendJson(res, newLoginProcess);
  }
}
