/**
 * Controller/App/UploadExampleController.ts
 * --------------------------------------------------------------
 * EXAMPLE CONTROLLER for uploading files.
 *
 * NOTE: THE REQUEST MUST NOT COME VIA DTO/JSON. IT MUST COME AS
 * multipart/form-data DIRECTLY TO THIS CONTROLLER. THEN FROM THE
 * CONTROLLER, THE REQUEST GOES TO Files/Upload.
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import { Upload } from "../../Files/Upload";
import { sendJson } from "../../route/helpers";

export async function UploadExampleController(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const newUpload = new Upload(req);
  const result = await newUpload.process();
  sendJson(res, result);
}
