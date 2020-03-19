import { SwitchDirection } from '../../../enum/MoveOp';

export interface ReducerStateType {
  current?: number;
  currentIndex?: number;
  visible?: boolean;
  opacity?: number;
  total?: number;
  windowSize?: WindowSize;
  offset?: any;
  imgList?: ImgInfo[];
}
export enum MoreAction {
  close = 'close',
  moveX = 'moveX',
  reset = 'reset',
  open = 'open',
  wrapClose = 'wrapClose',
  setTransformOrigin = 'setTransformOrigin',
}
export interface AllAction {
  type: SwitchDirection | MoreAction;
  payload?: ReducerStateType;
}
export enum ActionType {
  INIT,
  INIT_ORIGIN,
}
export type WindowSize = { width: number; height: number };
export interface State {
  show?: boolean;
  currentIndex?: number;
  originList?: ImgInfo[];
  windowSize?: WindowSize;
}
export interface Action {
  payload: State;
  type: ActionType;
}
export type ImgInfo = {
  webp?: string;
  thumbnail?: string;
  origin?: string;
  src?: string;
  key?: string;
  transformOrigin?: { x: number; y: number; length: number };
};
