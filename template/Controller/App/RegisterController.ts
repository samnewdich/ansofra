/**
 * Controller/App/RegisterController.ts
 * --------------------------------------------------------------
 * EXAMPLE CONTROLLER for the USERS AREA (/api/register).
 *
 * A controller in Ansofra does only 4 things:
 *   1. read the incoming JSON body
 *   2. wrap it inside the AnsofraDto
 *   3. call the business logic (app/Command or app/Query)
 *   4. echo the JSON result back
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import { AnsofraDto } from "../../Dto/AnsofraDto";
import { Index as Middleware } from "../../Middleware/Index";
import { Register } from "../../app/Command/Register";
import { readJsonBody, sendJson } from "../../route/helpers";

export async function RegisterController(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const incoming = await readJsonBody(req);
  const newdto = new AnsofraDto(incoming);
  const newMiddleware = new Middleware();

  const newRegister = new Register(newdto, newMiddleware);
  const result = await newRegister.process();

  sendJson(res, result);
}
