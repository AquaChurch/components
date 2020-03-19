import React, { Dispatch, FC, useEffect, useRef } from 'react';
import { Action, ActionType, ImgInfo, WindowSize } from '../types';
import './index.scss';
import { checkWebp } from '../../../utils/checkWebp';
import ImgList from '../../../assets/imgList';
import 'intersection-observer';

interface ThumbnailWrapProps {
  src?: string;
  index?: number;
  dispatch?: Dispatch<Action>;
  originList?: ImgInfo[];
  offset?: any;
  windowSize?: WindowSize;
  webp?: string;
  isScrolling?: boolean;
}
const ThumbnailWrap: FC<ThumbnailWrapProps> = ({
  src,
  index,
  dispatch,
  originList,
  offset,
  windowSize,
  webp,
  isScrolling,
}) => {
  const ref = useRef();
  const refVal = useRef<ImgInfo[]>(originList);

  useEffect(() => {
    const isSupportWebp = checkWebp();
    const io = new IntersectionObserver((entryList, observerChild) => {
      entryList.forEach((entry) => {
        if (entry.isIntersecting && entry.target.getAttribute('data-src')) {
          const currPhoto = new Image();
          currPhoto.src =
            (isSupportWebp && entry.target.getAttribute('data-webp')) ||
            entry.target.getAttribute('data-src');
          entry.target.setAttribute(
            'style',
            `background-image:url('${
              (isSupportWebp && entry.target.getAttribute('data-webp')) ||
              entry.target.getAttribute('data-src')
            }')`
          );
          currPhoto.onerror = () => {
            entry.target.setAttribute('style', `background-image:url('${ImgList.brokenImg}')`);
          };
          entry.target.removeAttribute('data-src');
          entry.target.removeAttribute('data-webp');
          observerChild.unobserve(entry.target);
        }
      });
    });
    const htmlElement = ref.current as HTMLElement;
    io.observe(htmlElement);
  }, []);
  useEffect(() => {
    if (isScrolling) {
      return;
    }
    const htmlElement = ref.current as HTMLElement;
    const { top, left, width, height } = htmlElement.getBoundingClientRect();
    refVal.current[index].transformOrigin = {
      x: left + width / 2,
      y: top + height / 2,
      length: width,
    };
    if (refVal.current.every((item) => item.transformOrigin)) {
      dispatch({
        type: ActionType.INIT_ORIGIN,
        payload: {
          originList: [...refVal.current],
        },
      });
    }
  }, [dispatch, index, offset, windowSize, isScrolling]);
  return (
    <div
      onClick={() => {
        dispatch({
          type: ActionType.INIT,
          payload: { show: true, currentIndex: index },
        });
      }}
      ref={ref}
      className="thumbnail-wrap-re"
      data-src={src}
      data-webp={webp}
    />
  );
};

export default ThumbnailWrap;
