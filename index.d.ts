declare module 'reduxsauce' {
  import { AnyAction, Reducer } from 'redux';

  export interface Actions {
    [action: string]: string[] | null;
  }

  export interface ActionTypes {
    [action: string]: string;
  }

  export interface ActionCreators {
    [action: string]: (...args: any[]) => AnyAction;
  }

  export interface Handlers<S> {
    [type: string]: (state: S, action: AnyAction) => S;
  }

  /**
   * Custom options for created types and actions
   *
   * prefix - prepend the string to all created types
   */
  interface Options {
    prefix: string;
  }

  interface CreatedActions {
    Types: ActionTypes;
    Creators: ActionCreators;
  }

  export function createActions(
    actions: Actions,
    options?: Options
  ): CreatedActions;

  export function createReducer<S>(
    initialState: S,
    handlers: Handlers<S>
  ): Reducer<S>;

  export function createTypes(types: string, options?: Options): ActionTypes;
}
