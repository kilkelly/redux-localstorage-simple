import {Middleware} from "redux";
import * as m from 'redux-localstorage-simple';

declare module 'redux-localstorage-simple' {
  interface RLSOptions {
    states?: string[];
    ignoreStates?: string[];
    namespace?: string;
    namespaceSeparator?: string;
    debounce?: number;
    disableWarnings?: boolean;
  }
  interface LoadOptions {
    states?: string[];
    immutablejs?: boolean;
    namespace?: string;
    namespaceSeparator?: string;
    preloadedState?: {};
    disableWarnings?: boolean;
  }
  interface ClearOptions {
    namespace?: string;
    disableWarnings?: boolean;
  }
  export function save(options?:RLSOptions):Middleware
  export function load(options?:LoadOptions):object
  export function clear(options?:ClearOptions):void
  export function combineLoads(...loads:object[]):object
}
