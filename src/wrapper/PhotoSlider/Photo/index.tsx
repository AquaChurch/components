import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './index.scss';
import Spinner from '../../../assets/Spinner/Spinner';
import getSuitableImageSize from '../../../utils/getSuitableImageSize';
import PhotoViewContext from '../../../context/PhotoViewContext';
import { useMountedState } from '@powerfulyang/utils';
import { AllAction, MoreAction, ReducerStateType } from '../types';
import ImgList from '../../../assets/imgList';

export interface IPhotoProps extends React.HTMLAttributes<any> {
  src: string;
  className?: string;
  loadingElement?: JSX.Element;
  brokenElement?: JSX.Element;
  realIndex?: number;
}

const Photo: React.FC<IPhotoProps> = ({
  src,
  className,
  loadingElement,
  brokenElement,
  realIndex,
  ...restProps
}) => {
  const [state, dispatch] = useContext(PhotoViewContext) as [
    ReducerStateType,
    (action: AllAction) => void
  ];
  const [loaded, setLoaded] = useState(false);
  const [rect, setRect] = useState([0]);
  const [broken, setBroken] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const natureRect = useRef([0, 0]);
  const isMounted = useMountedState();
  const handleImageLoaded = useCallback(
    (e) => {
      if (isMounted()) {
        const { naturalWidth, naturalHeight } = e.target;
        natureRect.current = [naturalWidth, naturalHeight];
        setLoaded(true);
        setBroken(false);
        const { width, height } = getSuitableImageSize(naturalWidth, naturalHeight);
        setRect([width, height]);
      }
    },
    [isMounted]
  );

  const handleImageBroken = useCallback(() => {
    if (isMounted()) {
      setBroken(true);
    }
  }, [isMounted]);
  React.useEffect(() => {
    const currPhoto = new Image();
    currPhoto.src = src;
    currPhoto.onerror = handleImageBroken;
    currPhoto.onload = handleImageLoaded;
  }, [handleImageLoaded, handleImageBroken, src]);

  useEffect(() => {
    if (state.currentIndex === realIndex) {
      const { x, y } = state.imgList[realIndex].transformOrigin;
      setOrigin({ x, y });
    }
  }, [state.imgList, realIndex, state.offset, state.windowSize, state.currentIndex]);

  useEffect(() => {
    if (natureRect.current) {
      const { width, height } = getSuitableImageSize(natureRect.current[0], natureRect.current[1]);
      setRect([width, height]);
    }
  }, [state.windowSize]);

  const animateEnd = () => {
    if (state.opacity === 0) {
      dispatch({ type: MoreAction.wrapClose });
    }
  };

  if (src && !broken) {
    if (loaded) {
      return (
        <div
          className={classNames('PhotoView__Photo__Wrap', {
            PhotoView__Photo_in: state.visible,
            PhotoView__Photo_out: state.opacity === 0,
          })}
          style={{
            ...restProps.style,
            transformOrigin: `${origin.x}px ${origin.y}px`,
          }}
          onAnimationEnd={animateEnd}
        >
          <img
            className={classNames('PhotoView__Photo')}
            src={src}
            width={rect[0]}
            height={rect[1]}
            {...restProps}
            alt=""
          />
        </div>
      );
    }
    return loadingElement || <Spinner />;
  }
  return (
    brokenElement || (
      <div
        className={classNames('PhotoView__Photo__Wrap', {
          PhotoView__Photo_in: state.visible,
          PhotoView__Photo_out: state.opacity === 0,
        })}
        style={{
          ...restProps.style,
        }}
        onAnimationEnd={animateEnd}
      >
        <img
          className={classNames('PhotoView__Photo')}
          src={ImgList.brokenImg}
          alt=""
          {...restProps}
        />
      </div>
    )
  );
};

Photo.displayName = 'Photo';

export default Photo;
