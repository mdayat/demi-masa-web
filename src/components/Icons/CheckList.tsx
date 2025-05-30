import type { ComponentPropsWithoutRef } from "react";

function CheckList({ className }: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V5H20V19Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.41 10.42L17.99 9L14.82 12.17L13.41 10.75L12 12.16L14.82 15L19.41 10.42Z"
      />
      <path d="M10 7H5V9H10V7Z" />
      <path d="M10 11H5V13H10V11Z" />
      <path d="M10 15H5V17H10V15Z" />
    </svg>
  );
}

export { CheckList };
