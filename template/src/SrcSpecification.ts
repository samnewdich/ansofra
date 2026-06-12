/**
 * src/SrcSpecification.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of src/SrcSpecification.php (namespace NewdichSrc).
 *
 * In PHP this used zircote/swagger-php annotations (@OA\Info)
 * to define the ADMINS AREA documentation title and version.
 *
 * In the TypeScript edition, the title and version are read from
 * the .env automatically (SRC_ANNOTATION_TITLE + APP_VERSION) by
 * ansofra-generator.ts, so this class is just the marker of the
 * ADMINS AREA specification.
 *
 * Document each endpoint with a JSDoc "@openapi" comment on top
 * of its Command/Query class (see src/Query/GetUsers.ts).
 */
export class SrcSpecification {}
