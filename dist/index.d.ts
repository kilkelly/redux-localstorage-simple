import {Middleware} from "redux";
import * as m from 'redux-localstorage-simple';

declare module 'redux-localstorage-simple' {
  interface RLSOptions {
    states?: string[];
    namespace?: string;
    debounce?: number;
  }
  export function save(options?:RLSOptions):Middleware
  export function load():object
}