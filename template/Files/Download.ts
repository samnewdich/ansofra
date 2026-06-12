/**
 * Files/Download.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Files/Download.php (namespace NewdichFiles).
 * Streams a file to the client as a download.
 * --------------------------------------------------------------
 */
import { ServerResponse } from "http";
import * as fs from "fs";
import * as path from "path";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Download {
  private path: string;

  constructor(filePath: string) {
    this.path = filePath;
  }

  public process(res: ServerResponse): string {
    const filePath = this.path;

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      const out = pretty({ status: "failed", response: "File not found" });
      res.setHeader("Content-Type", "application/json");
      res.end(out);
      return out;
    }

    const stat = fs.statSync(filePath);

    res.setHeader("Content-Description", "File Transfer");
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.setHeader("Pragma", "public");

    fs.createReadStream(filePath).pipe(res);
    return pretty({ status: "success", response: "Download Initiated" });
  }
}
