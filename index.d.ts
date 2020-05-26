declare module 'reduxsauce' {
  import { Action, AnyAction, Reducer, ActionCreator } from 'redux';

  export interface Actions {
    [action: string]: (string[] | ActionTypes | ActionCreator<ActionTypes>) | null;
  }

  export interface ActionTypes {
    [action: string]: string | number | DefaultActionTypes | null;
  }

  export interface DefaultActionTypes {
    [action: string]: string;
  }

  export interface DefaultActionCreators {
    [action: string]: (...args: any[]) => AnyAction;
  }

  export interface Handlers<S> {
    [type: string]: (state: S, action: any) => S;
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
    handlers: Handlers<S>
  ): Reducer<S, A>;

  export function createTypes<T = DefaultActionTypes>(types: string, options?: Options): T;

  export function resettableReducer(
    typeToReset: string
  ): <S, A extends Action = AnyAction>(originalReducer: Reducer<S, A>) => Reducer<S, A>;

  export function resettableReducer<S, A extends Action = AnyAction>(
    typeToReset: string,
    originalReducer: Reducer<S, A>
  ): Reducer<S, A>;
}
