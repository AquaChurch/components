import React, {
  FC,
  MouseEvent,
  TouchEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import './index.scss';
import { MoveOp, SwitchDirection } from '../../../enum/MoveOp';
import { PhotoViewConstants } from '../../../constants/PhotoViewContants';
import PhotoViewContext from '../../../context/PhotoViewContext';
import Photo from '../Photo';
import classNames from 'classnames';
import { AllAction, MoreAction, ReducerStateType } from '../types';
import { usePrevious } from '@powerfulyang/utils';
import getMultipleTouchPosition from '../../../utils/getMultipleTouchPosition';

export interface PhotoViewProps {
  src?: string;
  currentIndex?: number;
  realIndex: number;
  viewMovedXPropValue: number;
  SwitchNext?: any;
  SwitchPrev?: any;
  scale?: number;
}

const PhotoView: FC<PhotoViewProps> = ({
  SwitchNext,
  SwitchPrev,
  src,
  currentIndex,
  realIndex,
  viewMovedXPropValue,
  scale,
}) => {
  const [state, dispatch] = useContext(PhotoViewContext) as [
    ReducerStateType,
    (action: AllAction) => void
  ];
  let isMovingRef = useRef(0); // 初始 0  点击 1 拖动 2 缩放 3
  let startPositionRef = useRef([0, 0]);
  const endPositionRef = useRef([0, 0]);
  const touchLengthRef = useRef(0);
  let op = useRef(MoveOp.Init);
  const [movedX, setMovedX] = useState(() => 0);
  const [movedY, setMovedY] = useState(() => 0);

  const touchStart = (e: MouseEvent<HTMLDivElement> & TouchEvent<HTMLDivElement>) => {
    op.current = MoveOp.Init;
    const { touchLength } = getMultipleTouchPosition(e);
    const { clientX, clientY } = e.changedTouches && e.changedTouches[0];
    startPositionRef.current = [clientX, clientY];
    if (touchLength === 0 && touchLengthRef.current === 0 && scale === 1) {
      isMovingRef.current = 1;
    } else {
      isMovingRef.current = 2;
      touchLengthRef.current = touchLength;
    }
  };
  const touchOver = () => {
    if (isMovingRef.current === 2) {
      endPositionRef.current = [movedX, movedY];
    }
    if (isMovingRef.current !== 1) {
      if (scale < 1 && state.opacity !== 0) {
        dispatch({ type: MoreAction.reset });
        setMoved(0, 0);
      }
      return;
    }
    isMovingRef.current = 0;
    if (movedY >= PhotoViewConstants.minMovedClosedHeight) {
      // 关闭预览
      return dispatch({ type: MoreAction.close });
    }

    if (Math.abs(viewMovedXPropValue) > PhotoViewConstants.minMovedSwitchWidth) {
      if (viewMovedXPropValue < 0) {
        SwitchNext({
          type: SwitchDirection.NEXT,
        });
      } else {
        SwitchPrev({
          type: SwitchDirection.PREV,
        });
      }
    }
    setMoved(0, 0);
    dispatch({ type: MoreAction.reset });
  };
  const setMoved = useCallback(
    (X: number, Y: number) => {
      const maxScale = Math.max(
        (window.innerHeight - Y) / window.innerHeight,
        PhotoViewConstants.minScale
      );
      setMovedX(X);
      setMovedY(Y);
      if (isMovingRef.current === 1) {
        dispatch({ type: SwitchDirection.SCALE, payload: { opacity: maxScale } });
      }
      if (X === 0 && Y === 0) {
        endPositionRef.current = [0, 0];
        isMovingRef.current = 0;
        touchLengthRef.current = 0;
      }
    },
    [setMovedX, setMovedY, dispatch]
  );
  useEffect(() => {
    dispatch({ type: MoreAction.reset });
    setMoved(0, 0);
    if (currentIndex === realIndex) {
      const scrollInfo = state.offset.y;
      const { y: locationY, length } = state.imgList[realIndex].transformOrigin;
      const style = window.getComputedStyle(
        document.getElementsByClassName('photo-slider-wrapper').item(0)
      );
      const styleThumbnail = window.getComputedStyle(
        document.getElementsByClassName('thumbnail-wrap-re').item(0)
      );
      const paddingTop = style?.paddingTop?.match(/\d+(\.\d+)?/gi)[0] || Infinity;
      const gridRowGap = styleThumbnail?.marginTop?.match(/\d+(\.\d+)?/gi)[0] || Infinity;
      const innerHeight = state.windowSize.height;
      locationY + length / 2 > innerHeight &&
        window.scrollTo(
          0,
          scrollInfo +
            length / 2 -
            (innerHeight - locationY) +
            Math.min(Number(paddingTop), Number(gridRowGap))
        );
      locationY - length / 2 < 0 &&
        window.scrollTo(
          0,
          scrollInfo - length / 2 + locationY - Math.min(Number(paddingTop), Number(gridRowGap))
        );
    }
  }, [currentIndex, realIndex, state.imgList, state.offset, state.windowSize, dispatch, setMoved]);

  const onMove = useCallback(
    (newClientX: number, newClientY: number) => {
      const X = newClientX - startPositionRef.current[0];
      const Y = newClientY - startPositionRef.current[1];
      op.current === MoveOp.Init && checkOp(newClientX, newClientY);
      if (op.current === MoveOp.Drag) {
        setMoved(X, Y);
      } else if (op.current === MoveOp.Switch) {
        dispatch({ type: MoreAction.moveX, payload: { current: X } });
      }
    },
    [dispatch, setMoved]
  );
  const ondblclick = () => {
    if (scale === 1) {
      dispatch({ type: SwitchDirection.SCALE, payload: { opacity: 2 } });
      isMovingRef.current = 2;
    } else if (scale > 1) {
      dispatch({ type: MoreAction.reset });
      setMoved(0, 0);
    }
  };
  const touchMove = useCallback(
    (e: MouseEvent<HTMLDivElement> & TouchEvent<HTMLDivElement>) => {
      const { clientX, clientY } = (e.changedTouches && e.changedTouches[0]) || e;
      if (isMovingRef.current === 1) {
        onMove(clientX, clientY);
      } else if (isMovingRef.current === 2) {
        const { touchLength } = getMultipleTouchPosition(e);
        if (touchLength) {
          const endScale = scale + ((touchLength - touchLengthRef.current) / 100 / 2) * scale;
          // 限制最大倍数和最小倍数
          const toScale = Math.max(
            Math.min(endScale, PhotoViewConstants.maxScale),
            PhotoViewConstants.minScale
          );
          dispatch({ type: SwitchDirection.SCALE, payload: { opacity: toScale } });
          touchLengthRef.current = touchLength;
        } else {
          const X = clientX - startPositionRef.current[0];
          const Y = clientY - startPositionRef.current[1];
          setMoved(X + endPositionRef.current[0], Y + endPositionRef.current[1]);
        }
      }
    },
    [setMoved, onMove, scale, dispatch]
  );
  const mouseStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    startPositionRef.current = [clientX, clientY];
  };
  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    if (isMovingRef.current === 2) {
      const X = (clientX - startPositionRef.current[0]) * 2.1;
      const Y = (clientY - startPositionRef.current[1]) * 2.1;
      setMoved(X + endPositionRef.current[0], Y + endPositionRef.current[1]);
    }
  };
  const mouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isMovingRef.current === 2) {
      endPositionRef.current = [movedX, movedY];
    }
  };
  const checkOp = (newClientX: number, newClientY: number) => {
    const [clientX, clientY] = startPositionRef.current;
    const movedWidth = Math.abs(newClientX - clientX);
    const movedHeight = Math.abs(newClientY - clientY);
    if (movedHeight >= movedWidth) {
      // 下拉移动图片
      op.current = MoveOp.Drag;
    } else {
      // 左右切换图片
      op.current = MoveOp.Switch;
    }
  };
  const prevScale = usePrevious(scale);
  const transform = `translate3d(${movedX}px, ${movedY}px, 0) scale(${
    scale ? (realIndex === currentIndex && scale) || 1 : prevScale
  })`;
  const viewTransform = `translateX(${
    viewMovedXPropValue -
    state.windowSize.width * currentIndex +
    (currentIndex > realIndex && -PhotoViewConstants.horizontalOffset) +
    (currentIndex < realIndex && PhotoViewConstants.horizontalOffset) +
    'px'
  })`;
  const viewTransition = viewMovedXPropValue ? '' : 'transform .4s ease';
  const left = `${state.windowSize.width * realIndex}px`;

  return (
    <div
      onMouseDown={mouseStart}
      onMouseUp={mouseOver}
      onMouseLeave={mouseOver}
      onMouseMove={mouseMove}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchOver}
      onTouchCancel={touchOver}
      onDoubleClick={ondblclick}
      className={classNames('yang-utils-photo-view')}
      style={{
        transform: viewTransform,
        transition: viewTransition,
        left,
      }}
    >
      <Photo realIndex={realIndex} src={src} style={{ transform }} />
    </div>
  );
};

export default PhotoView;
