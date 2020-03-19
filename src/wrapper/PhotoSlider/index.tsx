import React, { FC, useCallback, useEffect, useReducer } from 'react';
import './index.scss';
import { SwitchDirection } from '../../enum/MoveOp';
import PhotoView from './PhotoView';
import PhotoViewContext from '../../context/PhotoViewContext';
import ModalWrap from '../Modal';
import Close from '../../assets/icons/Close';
import ArrowLeft from '../../assets/icons/ArrowLeft';
import ArrowRight from '../../assets/icons/ArrowRight';
import classNames from 'classnames';
import { throttle } from 'lodash-es';
import { DomUtils, useKeyboardJs, usePrevious } from '@powerfulyang/utils';
import { AllAction, ImgInfo, MoreAction, ReducerStateType, WindowSize } from './types';
import { PhotoViewConstants } from '../../constants/PhotoViewContants';

interface PhotoSliderProp {
  imgList: ImgInfo[];
  selectedIndex?: number;
  onClose?: () => void;
  className?: string;
  windowSize?: WindowSize;
  offset?: any;
}

const SlideReducer = (state: ReducerStateType, action: AllAction): ReducerStateType => {
  const currentIndex = state.currentIndex;
  const { total } = state;
  const setIndex = action?.payload?.currentIndex;
  if (setIndex !== undefined) {
    if (setIndex < 0 || isNaN(setIndex)) {
      return {
        ...state,
        currentIndex: 0,
      };
    }
    if (setIndex > total - 1) {
      return {
        ...state,
        currentIndex: total - 1,
      };
    }
  }
  switch (action.type) {
    case SwitchDirection.NEXT:
      if (currentIndex >= state.total - 1) {
        return { ...state, current: 0 };
      }
      return {
        ...state,
        currentIndex: currentIndex + 1,
        current: 0,
      };
    case SwitchDirection.PREV:
      if (currentIndex === 0) {
        return { ...state, current: 0 };
      }
      return {
        ...state,
        currentIndex: currentIndex - 1,
        current: 0,
      };
    case SwitchDirection.SPECIFIED:
      return {
        ...state,
        currentIndex: setIndex,
        current: 0,
      };
    case SwitchDirection.INIT:
      return {
        ...state,
        currentIndex: setIndex,
        opacity: 1,
        visible: true,
      };
    case MoreAction.close:
      return {
        ...state,
        opacity: 0,
      };
    case MoreAction.wrapClose:
      return {
        ...state,
        visible: false,
      };
    case MoreAction.open:
      return {
        ...state,
        visible: true,
      };
    case SwitchDirection.SCALE:
      return {
        ...state,
        opacity: action.payload.opacity,
      };
    case MoreAction.reset:
      return {
        ...state,
        current: 0,
        opacity: 1,
      };
    case MoreAction.moveX:
      return {
        ...state,
        current:
          ([0, state.total].includes(state.currentIndex) && action.payload.current / 2) ||
          action.payload.current,
      };
    case MoreAction.setTransformOrigin:
      return {
        ...state,
        ...action.payload,
      };
  }
};
const PhotoSliderWrap: FC<PhotoSliderProp> = ({
  imgList = [],
  selectedIndex = 0,
  onClose,
  className,
  windowSize,
  offset,
}) => {
  const initialState: ReducerStateType = {
    current: 0,
    currentIndex: 0,
    visible: false,
    opacity: 0,
    total: imgList.length,
    imgList,
    windowSize,
    offset,
  };
  const [state, dispatch] = useReducer(SlideReducer, initialState);
  useEffect(() => {
    dispatch({
      type: MoreAction.setTransformOrigin,
      payload: {
        windowSize,
        offset,
      },
    });
  }, [windowSize, offset]);
  const SwitchNext = useCallback(
    throttle(
      dispatch,
      !DomUtils.isMobileDevice()
        ? PhotoViewConstants.switchWideDelayTime
        : PhotoViewConstants.switchMobileDelayTime,
      { trailing: false }
    ),
    []
  );
  const SwitchPrev = useCallback(
    throttle(
      dispatch,
      !DomUtils.isMobileDevice()
        ? PhotoViewConstants.switchWideDelayTime
        : PhotoViewConstants.switchMobileDelayTime,
      { trailing: false }
    ),
    []
  );

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { deltaY, deltaX } = e;
    if (deltaX < -10) {
      SwitchPrev({
        type: SwitchDirection.PREV,
      });
    } else if (deltaX > 10) {
      SwitchNext({
        type: SwitchDirection.NEXT,
      });
    } else if (Math.abs(deltaY) > 10) {
      SwitchNext({ type: MoreAction.close });
    }
  };
  useEffect(() => {
    dispatch({
      type: SwitchDirection.INIT,
      payload: {
        currentIndex: selectedIndex,
      },
    });
  }, [selectedIndex]);
  const previousVisible = usePrevious(state.visible);
  const preventDefault = useCallback((e: any) => {
    return e.preventDefault();
  }, []);
  useEffect(() => {
    if (state.visible && !previousVisible) {
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
    }
    if (!state.visible && previousVisible) {
      window.removeEventListener('wheel', preventDefault, true);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault, true);
      window.removeEventListener('touchmove', preventDefault);
      onClose && onClose();
    }
  }, [state.visible, onClose, previousVisible, preventDefault]);
  const [isPressLeft] = useKeyboardJs('left');
  const [isPressRight] = useKeyboardJs('right');
  const [isPressDown] = useKeyboardJs('down');
  const [isPressEsc] = useKeyboardJs('esc');
  useEffect(() => {
    console.log(isPressEsc);
    isPressLeft && SwitchPrev({ type: SwitchDirection.PREV });
    isPressRight && SwitchNext({ type: SwitchDirection.NEXT });
    (isPressDown || isPressEsc) && SwitchNext({ type: MoreAction.close });
  }, [isPressLeft, SwitchPrev, isPressRight, SwitchNext, isPressDown, isPressEsc, dispatch]);

  const { visible, currentIndex, current, opacity, total } = state;
  const prevOpacity = usePrevious(opacity);
  return (
    <PhotoViewContext.Provider value={[state, dispatch]}>
      {visible && (
        <ModalWrap
          className={classNames('yang-utils-photo-slider-wrap', className, {
            yang__photo_slider_wrap_animate_in: true,
            yang__photo_slider_wrap_animate_out:
              prevOpacity < opacity || prevOpacity === 1 || (prevOpacity !== 0 && opacity === 0),
          })}
          style={{
            backgroundColor: `rgba(0,0,0,${opacity})`,
          }}
        >
          <div
            className="yang-utils-photo-slider-wrap-operation"
            style={
              (!DomUtils.isMobileDevice() && {
                backgroundColor: `rgba(0,0,0,${opacity === 1 ? 0.3 : 0})`,
              }) ||
              {}
            }
          >
            <Close
              className="close"
              onClick={() => {
                dispatch({ type: MoreAction.close });
              }}
            />
            {!DomUtils.isMobileDevice() && currentIndex !== 0 && (
              <ArrowLeft
                className="prev"
                onClick={() => {
                  SwitchPrev({ type: SwitchDirection.PREV });
                }}
              />
            )}
            {!DomUtils.isMobileDevice() && currentIndex !== total - 1 && (
              <ArrowRight
                className="next"
                onClick={() => {
                  SwitchNext({ type: SwitchDirection.NEXT });
                }}
              />
            )}
          </div>
          <div className="yang-utils-photo-slider" onWheel={handleWheel}>
            {imgList
              .slice(Math.max(currentIndex - 1, 0), Math.min(currentIndex + 2, total + 1))
              .map((item, index) => {
                const realIndex =
                  currentIndex === 0 ? currentIndex + index : currentIndex - 1 + index;
                return (
                  <PhotoView
                    SwitchNext={SwitchNext}
                    SwitchPrev={SwitchPrev}
                    src={item.src}
                    realIndex={realIndex}
                    currentIndex={currentIndex}
                    key={item.key || realIndex}
                    viewMovedXPropValue={current}
                    scale={opacity}
                  />
                );
              })}
          </div>
        </ModalWrap>
      )}
    </PhotoViewContext.Provider>
  );
};

export default PhotoSliderWrap;
