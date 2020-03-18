import React, { FC, MouseEvent, useCallback, useContext, useRef, useState } from 'react';
import './index.scss';
import { MoveOp, SwitchDirection } from '../../../enum/MoveOp';
import { debounce } from 'lodash';
import { PhotoViewConstants } from '../../../constants/PhotoViewContants';
import PhotoViewContext from '../../../context/PhotoViewContext';
import { AllAction, MoreAction } from '../';
import Photo from '../Photo';

export interface PhotoViewProps {
  src?: string;
  currentIndex: number;
  realIndex: number;
  viewMovedXPropValue: number;
}

const PhotoView: FC<PhotoViewProps> = ({ src, currentIndex, realIndex, viewMovedXPropValue }) => {
  const dispatch = useContext(PhotoViewContext) as (action: AllAction) => void;
  let isMovingRef = useRef(false);
  let startPositionRef = useRef([0, 0]);
  let op = useRef(MoveOp.Init);
  const [movedX, setMovedX] = useState(() => 0);
  const [movedY, setMovedY] = useState(() => 0);
  const [scale, setScale] = useState(1);
  const touchStart = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    op.current = MoveOp.Init;
    isMovingRef.current = true;
    const { clientX, clientY } = e;
    startPositionRef.current = [clientX, clientY];
  };
  const touchOver = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isMovingRef.current === false) {
      return;
    }
    isMovingRef.current = false;
    startPositionRef.current = [0, 0];
    op.current = MoveOp.Init;
    debounceOnMove.cancel();
    setMoved(0, 0);
    setScale(1);
    if (movedY >= PhotoViewConstants.minMovedClosedHeight) {
      // 关闭预览
      dispatch({ type: MoreAction.close });
    }
    if (Math.abs(viewMovedXPropValue) > PhotoViewConstants.minMovedSwitchWidth) {
      if (viewMovedXPropValue < 0) {
        dispatch({ type: MoreAction.moveX, payload: { current: -innerWidth } });
        dispatch({ type: SwitchDirection.NEXT });
      } else {
        dispatch({ type: MoreAction.moveX, payload: { current: innerWidth } });
        dispatch({ type: SwitchDirection.PREV });
      }
    } else {
      dispatch({ type: MoreAction.reset });
    }
  };
  const touchMove = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isMovingRef.current) {
      const { clientX, clientY } = e;
      debounceOnMove(clientX, clientY);
    }
  };
  const setMoved = (X: number, Y: number) => {
    let scale = 1;
    setScale(prevScale => {
      const maxScale = Math.max(
        (window.innerHeight - Y) / window.innerHeight,
        PhotoViewConstants.minScale
      );
      scale = Math.min(prevScale, maxScale);
      return scale;
    });
    dispatch({ type: SwitchDirection.SCALE, payload: { scale } });
    setMovedX(X);
    setMovedY(Y);
  };
  const onMove = (newClientX: number, newClientY: number) => {
    op.current === MoveOp.Init && checkOp(newClientX, newClientY);
    const X = newClientX - startPositionRef.current[0];
    const Y = newClientY - startPositionRef.current[1];
    if (op.current === MoveOp.Drag) {
      setMoved(X, Y);
    } else if (op.current === MoveOp.Switch) {
      dispatch({ type: MoreAction.moveX, payload: { current: X } });
    }
  };
  const debounceOnMove = useCallback(debounce(onMove, 8), []);
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
  const transform = `translate3d(${movedX}px, ${movedY}px, 0) scale(${scale})`;
  const transition = 'transform 0.5s';
  const { innerWidth } = window;
  const viewTransform = `translateX(${viewMovedXPropValue +
    (currentIndex > realIndex && -PhotoViewConstants.horizontalOffset) +
    (currentIndex < realIndex && PhotoViewConstants.horizontalOffset) -
    innerWidth * currentIndex +
    'px'})`;
  const viewTransition = 'transform 0.5s';
  const left = `${innerWidth * realIndex}px`;
  return (
    <div
      onMouseDown={touchStart}
      onMouseUp={touchOver}
      onMouseLeave={touchOver}
      onMouseMove={touchMove}
      className="yang-utils-photo-view"
      style={{
        transform: viewTransform,
        transition: viewTransition,
        left,
      }}
    >
      <Photo src={src} style={{ transform, transition }} />
    </div>
  );
};

export default PhotoView;
