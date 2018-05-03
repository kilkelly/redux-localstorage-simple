import {Middleware} from "redux";
import * as m from 'redux-localstorage-simple';

declare module 'redux-localstorage-simple' {
  interface RLSOptions {
    states?: string[];
    namespace?: string;
    debounce?: number;
  }
  interface LoadOptions {
    states?: string[];
    namespace?: string;
    immutablejs?: boolean;
    preloadedState?: {};
    disableWarnings?: boolean;
  }
  export function save(options?:RLSOptions):Middleware
  export function load(options?:LoadOptions):object
}