import React, { SVGProps } from 'react';

function Close(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 768 768"
      {...props}
    >
      <path
        fill="#FFF"
        d="M607.5 205.5l-178.5 178.5 178.5 178.5-45 45-178.5-178.5-178.5 178.5-45-45 178.5-178.5-178.5-178.5 45-45 178.5 178.5 178.5-178.5z"
      />
    </svg>
  );
}

export default Close;
