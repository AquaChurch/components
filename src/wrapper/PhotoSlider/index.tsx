import React, { FC, useReducer } from 'react';
import './index.scss';
import { SwitchDirection } from '../../enum/MoveOp';
import PhotoView from './PhotoView';
import Static from '../../assets/static';
import PhotoViewContext from '../../context/PhotoViewContext';
import ModalWrap from '../Modal';

interface PhotoSliderProp {}
interface ReducerStateType {
  current?: number;
  currentIndex?: number;
  visible?: boolean;
  scale?: number;
  total?: number;
}
export enum MoreAction {
  close = 'close',
  moveX = 'moveX',
  reset = 'reset',
}
export interface AllAction {
  type: SwitchDirection | MoreAction;
  payload?: ReducerStateType;
}
const SlideReducer = (state: ReducerStateType, action: AllAction) => {
  const currentIndex = state.currentIndex;
  switch (action.type) {
    case SwitchDirection.NEXT:
      if (currentIndex === state.total - 1) {
        return { ...state, current: 0 };
      }
      return {
        ...state,
        current: 0,
        currentIndex: currentIndex + 1,
      };
    case SwitchDirection.PREV:
      if (currentIndex === 0) {
        return { ...state, current: 0 };
      }
      return {
        ...state,
        current: 0,
        currentIndex: currentIndex - 1,
      };
    case MoreAction.close:
      return {
        ...state,
        visible: false,
      };
    case SwitchDirection.SCALE:
      return {
        ...state,
        scale: action.payload.scale,
      };
    case MoreAction.reset:
      return {
        ...state,
        current: 0,
        scale: 1,
      };
    case MoreAction.moveX:
      return {
        ...state,
        current: action.payload.current,
      };
  }
};
const PhotoSlider: FC<PhotoSliderProp> = () => {
  const list = ['http://baidu.com', Static.bg, Static.lm, Static.rem, Static.bg, Static.lm];
  const initialSate = {
    current: 0,
    currentIndex: 0,
    visible: true,
    scale: 1,
    total: list.length,
  };

  const [state, dispatch] = useReducer(SlideReducer, initialSate);
  const { visible, currentIndex, current, scale } = state;
  return (
    <PhotoViewContext.Provider value={dispatch}>
      <ModalWrap
        className="yang-utils-photo-slider-wrap"
        style={!visible ? { display: 'none' } : { backgroundColor: `rgba(0,0,0,${scale})` }}
      >
        <div className="yang-utils-photo-slider">
          {list
            .slice(Math.max(currentIndex - 1, 0), Math.min(currentIndex + 2, list.length + 1))
            .map((item, index) => {
              const realIndex =
                currentIndex === 0 ? currentIndex + index : currentIndex - 1 + index;
              return (
                <PhotoView
                  src={item}
                  realIndex={realIndex}
                  currentIndex={currentIndex}
                  key={index}
                  viewMovedXPropValue={current}
                />
              );
            })}
        </div>
      </ModalWrap>
    </PhotoViewContext.Provider>
  );
};

export default PhotoSlider;
