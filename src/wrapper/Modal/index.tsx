import React, { FC, HTMLAttributes, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import './index.scss';

const ModalWrap: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...restProps }) => {
  const dialogNode = useMemo(() => {
    const dialogNode = document.createElement('div');
    document.body.appendChild(dialogNode);
    return dialogNode;
  }, []);
  const originalOverflowCallback = useRef('');

  useEffect(() => {
    const { style } = document.body;
    originalOverflowCallback.current = style.overflow;
    style.overflow = 'hidden';

    return () => {
      const { style } = document.body;
      style.overflow = originalOverflowCallback.current;
      document.body.removeChild(dialogNode);
    };
  }, [dialogNode]);

  return createPortal(
    <div className={classNames('yang-utils-modal-wrap', className)} {...restProps}>
      {children}
    </div>,
    dialogNode
  );
};

ModalWrap.displayName = 'ModalWrap';

export default ModalWrap;
