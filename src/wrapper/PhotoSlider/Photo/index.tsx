import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import './index.scss';
import useMountedState from '../../../hooks/useMounted';
import Spinner from '../../../assets/Spinner/Spinner';
import getSuitableImageSize from '../../../utils/getSuitableImageSize';
import BrokenImg from '../../../assets/icons/BrokenImg';

export interface IPhotoProps extends React.HTMLAttributes<any> {
  src: string;
  className?: string;
  loadingElement?: JSX.Element;
  brokenElement?: JSX.Element;
}

const Photo: React.FC<IPhotoProps> = ({
  src,
  className,
  loadingElement,
  brokenElement,
  ...restProps
}) => {
  const [loaded, setLoaded] = useState(false);
  const isMounted = useMountedState();
  const [rect, setRect] = useState([0]);
  const [broken, setBroken] = useState(false);

  const handleImageLoaded = useCallback(
    e => {
      const { naturalWidth, naturalHeight } = e.target;
      if (isMounted()) {
        setLoaded(true);
      }
      const { width, height } = getSuitableImageSize(naturalWidth, naturalHeight);
      setRect([width, height]);
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
    currPhoto.onload = handleImageLoaded;
    currPhoto.onerror = handleImageBroken;
    currPhoto.src = src;
  }, [handleImageLoaded, handleImageBroken, isMounted, src]);

  if (src && !broken) {
    if (loaded) {
      return (
        <img
          className={classNames('PhotoView__Photo', className)}
          src={src}
          width={rect[0]}
          height={rect[1]}
          alt=""
          {...restProps}
        />
      );
    }
    return loadingElement || <Spinner />;
  }
  return brokenElement || <BrokenImg fill={'#fff'} />;
};

Photo.displayName = 'Photo';

export default Photo;
