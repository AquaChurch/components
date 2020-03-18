import * as React from 'react';
import { SVGProps } from 'react';

function BrokenImg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="broken_image_svg__icon"
      viewBox="0 0 1024 1024"
      width={200}
      height={200}
      {...props}
    >
      <defs>
        <style />
      </defs>
      <path d="M768 488.021l128 128v194.006q0 34.005-25.984 59.989T810.026 896h-596.01q-34.005 0-59.99-25.984t-25.983-59.99v-280.02l128 128 169.984-171.99 171.989 171.99zm128-274.005v280.021l-128-128-169.984 171.99-171.99-171.99-169.983 171.99-128-130.006V214.016q0-34.005 25.984-59.99t59.989-25.983h596.01q34.006 0 59.99 25.984T896 214.016z" />
    </svg>
  );
}

export default BrokenImg;
