/// <reference types="node" />
import stream = require('stream');

type JavaScriptString = string;
type Options = {
  /**
   * If true (default), the WebSocket server is
   * started immediately. If false, start()
   * method needs to be manually called to start
   * listening for changes.
   */
  start?: boolean;
  /**
   * Port number for the WebSocket server.
   * Default: 3100
   */
  port?: number;
  /**
   * JavaScript expression that will be
   * evaluated to get a reference to angular.
   * Default: "angular"
   */
  angular?: JavaScriptString;
  /**
   * Whether to reload window automatically
   * when a change in source files can't be
   * hot-reloaded.
   * Default: true
   */
  forceRefresh?: boolean;
  /**
   * If true, the library attempts to
   * preserve some state in scope and controller
   * instances when they are reloaded.
   * Default: true
   */
  preserveState?: boolean;
  /**
   * Print console messages from the library.
   */
  logLevel?: 'debug'|'warn'|'error'|'none';
};

type StreamOptions = {
  /**
   * Automatically add the ng-hot-reload-core
   * client to the first source file that
   * goes through the stream. If this is set to false,
   * you need to manually add the client.
   * Default: true
   */
  includeClient?: boolean;
  /**
   * Skip files in node_modules and
   * bower_components.
   * Default: true
   */
  ignoreModules?: boolean;
};

interface NgHotReloadStandalone {
  /**
   * Starts the server. You only need to call
   * this if the library was initialized with
   * option `start: false`.
   */
  start(): void;
  /**
   * Wraps a file using the `wrap` function
   * and sends a reload command to the client.
   * This is a very "manual" way of doing reloads.
   * If you are using gulp etc, you might want to
   * use `stream` function instead.
   * @param path Path to the updated file on disk
   * @pram file The file contents as a string
   * @return Result of calling `wrap` for the file
   */
  reload(path: string, file: string): string;
  /**
   * Wraps a file with the library so that the
   * modules can be hot reloaded.
   * Note that both `reload` and `stream` call
   * this function automatically, so it's quite
   * rare that you'd need to call it yourself.
   */
  wrap(path: string, file: string): string;

  /**
   * Returns a stream transofrm that can be used
   * with gulp pipes. This transform automatically
   * calls `wrap` and `reload` for the files that
   * are passed through. 
   */
  stream(options?: StreamOptions): stream.Transform;

  /**
   * A client script that needs to be included in
   * the loaded before the other source files
   * unless you use `stream` function with option
   * `includeClient: true`.
   */
  client: JavaScriptString;
}

/**
 * Library for hot-reloading angular projects
 * using gulp or similar tools.
 */
declare function ngHotReloadStandalone(options?: Options): NgHotReloadStandalone;
export = ngHotReloadStandalone;
