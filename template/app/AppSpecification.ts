/**
 * app/AppSpecification.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of app/AppSpecification.php (namespace NewdichApp).
 *
 * In PHP this used zircote/swagger-php annotations (@OA\Info)
 * to define the USERS AREA documentation title and version.
 *
 * In the TypeScript edition, the title and version are read from
 * the .env automatically (APP_ANNOTATION_TITLE + APP_VERSION) by
 * ansofra-generator.ts, so this class is just the marker of the
 * USERS AREA specification.
 *
 * Document each endpoint with a JSDoc "@openapi" comment on top
 * of its Command/Query class (see app/Query/Login.ts).
 */
export class AppSpecification {}
