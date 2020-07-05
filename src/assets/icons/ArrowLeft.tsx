import React, { SVGProps } from 'react';

function ArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 768 768"
      {...props}
      fill="#fff"
    >
      <path d="M640.5 352.5v63h-390l178.5 180-45 45-256.5-256.5 256.5-256.5 45 45-178.5 180h390z" />
    </svg>
  );
}

export default ArrowLeft;
