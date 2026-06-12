/**
 * Files/Upload.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Files/Upload.php (namespace NewdichFiles).
 *
 * NOTE: THE REQUEST COMING MUST NOT COME VIA DTO, IT MUST COME AS A
 * multipart/form-data REQUEST DIRECTLY TO THE CONTROLLER.
 * THEN FROM THE CONTROLLER, THE REQUEST COMES HERE.
 * CHECK Controller/App/UploadExampleController.ts TO SEE AN EXAMPLE
 * OF HOW THE CONTROLLER FOR UPLOADING FILES SHOULD BE.
 *
 * Uses formidable to parse the multipart upload (the Node.js way
 * of doing what PHP's $_FILES + move_uploaded_file did).
 * --------------------------------------------------------------
 */
import { IncomingMessage } from "http";
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";
import formidable from "formidable";
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Upload {
  private req: IncomingMessage;
  private uploadDir = Settings.UPLOAD_DIRECTORY; // folder where the files will be uploaded to
  private rootDir = Settings.ROOT_DIRECTORY;
  private maxFileSize = Settings.MAX_UPLOAD_SIZE;

  constructor(req: IncomingMessage) {
    this.req = req;
    // NOTE THE FILE(S) TO UPLOAD SHOULD COME AS multipart/form-data
  }

  public async process(): Promise<string> {
    // Configuration
    const baseDirCandidates = [
      path.join(__dirname, "..", "ansofra"),
      path.join(__dirname, "..", "..", "ansofra"),
      path.join(process.cwd(), "ansofra")
    ];
    const baseDir = baseDirCandidates.find((p) => fs.existsSync(p)) ?? baseDirCandidates[0];
    const uploadDir = path.join(baseDir, this.uploadDir);
    const maxFiles = 20;
    const maxFileSize = this.maxFileSize * 1024 * 1024;
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",

      // Videos
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mpeg",
      "video/quicktime", // .mov
      "video/x-msvideo",

      // Audio
      "audio/mpeg", // mp3
      "audio/wav",
      "audio/ogg",
      "audio/webm",
      "audio/aac",
      "audio/mp4",

      // Documents
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "text/plain", // .txt
      "text/csv",
      "text/markdown",

      // Archives (VERY important for software)
      "application/zip",
      "application/x-zip-compressed",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/gzip",
      "application/x-tar",

      // Code / Dev files
      "application/json",
      "application/xml",
      "text/html",
      "text/css",
      "application/javascript",
      "text/javascript",

      // Executables / Installers (USE WITH CAUTION)
      "application/octet-stream",
      "application/x-msdownload", // .exe
      "application/x-ms-installer", // .msi
      "application/vnd.apple.installer+xml" // .pkg
    ];

    // make sure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      multiples: true,
      maxFiles: maxFiles,
      maxFileSize: maxFileSize,
      uploadDir: uploadDir,
      keepExtensions: true
    });

    let files: formidable.Files;
    try {
      [, files] = await form.parse(this.req);
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }

    // flatten all uploaded files
    const allFiles: formidable.File[] = [];
    for (const value of Object.values(files)) {
      if (Array.isArray(value)) allFiles.push(...value);
      else if (value) allFiles.push(value as unknown as formidable.File);
    }

    // Validate input
    if (allFiles.length < 1) {
      return pretty({ status: "failed", response: "No media files received" });
    }

    if (allFiles.length > maxFiles) {
      return pretty({ status: "failed", response: `Maximum of ${maxFiles} files allowed` });
    }

    const uploadedFiles: string[] = [];
    const errors: string[] = [];

    for (const file of allFiles) {
      // FILE SIZE VALIDATION
      if (file.size > maxFileSize) {
        errors.push(`File too large: ${file.originalFilename} (Max: ${this.maxFileSize}MB)`);
        fs.unlinkSync(file.filepath);
        continue;
      }

      // Validate MIME type
      const mimeType = file.mimetype ?? "";
      if (!allowedTypes.includes(mimeType)) {
        errors.push("Invalid file type: " + file.originalFilename);
        fs.unlinkSync(file.filepath);
        continue;
      }

      // Get extension safely
      const extension = path.extname(file.originalFilename ?? "").replace(".", "");

      // Generate unique file name
      const newName = "media_" + crypto.randomBytes(8).toString("hex") + Date.now() + "." + extension;
      const destination = path.join(uploadDir, newName);

      try {
        fs.renameSync(file.filepath, destination);
        uploadedFiles.push(newName);
      } catch {
        errors.push("Failed to move file: " + file.originalFilename);
      }
    }

    if (uploadedFiles.length > 0) {
      return pretty({
        status: "success",
        response: uploadedFiles
      });
      // array of the files that was uploaded was sent back
    } else {
      return pretty({ status: "failed", response: errors });
    }
  }
}
