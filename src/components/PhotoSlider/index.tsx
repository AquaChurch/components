import PhotoSliderWrap from '../../wrapper/PhotoSlider';
import React, { FC, Reducer, useEffect, useReducer, useRef } from 'react';
import ThumbnailWrap from '../../wrapper/PhotoSlider/ThumbnailWrap';
import { Action, ActionType, ImgInfo, State } from '../../wrapper/PhotoSlider/types';
import classNames from 'classnames';
import './index.scss';
import { useMedia, useScrolling, useWindowScroll, useWindowSize } from '@powerfulyang/utils';

const reducer: Reducer<State, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.INIT_ORIGIN:
      return {
        ...state,
        originList: action.payload.originList,
        render: true,
      };
    case ActionType.INIT:
      return {
        ...state,
        ...action.payload,
      };
  }
};

export interface PhotoSliderProp {
  imgList: ImgInfo[];
  className?: string;
}

export const PhotoSlider: FC<PhotoSliderProp> = ({ imgList, className }) => {
  const thumbnailList = imgList.map((item) => ({
    src: item.thumbnail || item.origin || item.src,
    webp: item.webp,
    ...item,
  }));
  const originList = imgList.map((item) => ({
    src: item.origin || item.src,
    ...item,
  }));
  const initialState: State = {
    show: false,
    currentIndex: 0,
  };
  const offset = useWindowScroll();
  const windowSize = useWindowSize();
  const element = useRef();
  const isScrolling = useScrolling(element);
  useEffect(() => {
    const orientationchange = () => {
      const { innerWidth, innerHeight } = window;
      dispatch({
        type: ActionType.INIT,
        payload: {
          windowSize: {
            width: innerWidth,
            height: innerHeight,
          },
        },
      });
    };
    dispatch({ type: ActionType.INIT, payload: { windowSize } });
    window.addEventListener('orientationchange', orientationchange, false);
    return () => {
      window.removeEventListener('orientationchange', orientationchange);
    };
  }, [windowSize]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMinWidth1500 = useMedia('(min-width: 1500px)');
  const isMinWidth768 = useMedia('(min-width: 768px)');
  const clearRequire =
    (isMinWidth1500 && thumbnailList.length % 10 !== 0 && 10 - (thumbnailList.length % 10)) ||
    (!isMinWidth1500 &&
      isMinWidth768 &&
      thumbnailList.length % 8 !== 0 &&
      8 - (thumbnailList.length % 8)) ||
    (!isMinWidth768 && thumbnailList.length % 3 !== 0 && 3 - (thumbnailList.length % 3)) ||
    0;
  return (
    <>
      <div className={classNames(className, 'photo-slider-wrapper')} ref={element}>
        {thumbnailList.map((x, index) => (
          <ThumbnailWrap
            key={index}
            originList={originList}
            index={index}
            dispatch={dispatch}
            src={x.src}
            webp={x.webp}
            offset={offset}
            windowSize={state.windowSize}
            isScrolling={isScrolling}
          />
        ))}
        {new Array(clearRequire).fill(1).map((_, index) => (
          <div key={index + 'clear'} className="thumbnail-wrap-re thumbnail-wrap-re-clear" />
        ))}
      </div>
      {state.show && (
        <PhotoSliderWrap
          onClose={() => dispatch({ type: ActionType.INIT, payload: { show: false } })}
          selectedIndex={state.currentIndex}
          imgList={state.originList}
          windowSize={state.windowSize}
          offset={offset}
        />
      )}
    </>
  );
};
