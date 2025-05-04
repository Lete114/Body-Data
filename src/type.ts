/**
 * Options for customizing body data parsing.
 */
export interface IBodyOptions {
  /**
   * Whether to return the raw request body as a string, skipping parsing.
   * @default false
   */
  raw?: boolean

  /**
   * Encoding used to decode the body. Default is 'utf-8'.
   */
  encoding?: BufferEncoding

  /**
   * Override the content-type for parsing the body.
   * This will take priority over the request header.
   */
  contentType?: string

  /**
   * Fallback content-type to use when neither `contentType` nor request header is available.
   */
  backContentType?: string

  /**
   * Error handler for parsing or stream errors
   */
  onError?: (err: Error) => void
}

/**
 * Options for `bodyData`. Extends `IBodyOptions`.
 */
export interface IOptions extends IBodyOptions {

}
