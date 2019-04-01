declare module 'reduxsauce' {
  import { Action, AnyAction, Reducer } from 'redux';

  export interface Actions {
    [action: string]: string[] | null;
  }

  export interface DefaultActionTypes {
    [action: string]: string;
  }

  export interface DefaultActionCreators {
    [action: string]: (...args: any[]) => AnyAction;
  }

  export interface Handlers<S, A = AnyAction> {
    [type: string]: (state: S, action: A) => S;
  }

  /**
   * Custom options for created types and actions
   *
   * prefix - prepend the string to all created types
   */
  interface Options {
    prefix: string;
  }

  export interface CreatedActions<T = DefaultActionTypes, C = DefaultActionCreators> {
    Types: T;
    Creators: C;
  }

  export function createActions<T = DefaultActionTypes, C = DefaultActionCreators>(
    actions: Actions,
    options?: Options
  ): CreatedActions<T, C>;

  export function createReducer<S = {}, A extends Action = AnyAction>(
    initialState: S,
    handlers: Handlers<S, A>
  ): Reducer<S, A>;

  export function createTypes<T = DefaultActionTypes>(types: string, options?: Options): T;
}
