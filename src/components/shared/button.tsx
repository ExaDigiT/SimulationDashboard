import { HTMLProps } from "react";

export interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  variant: "filled" | "outlined" | "text";
  type: "submit" | "reset" | "button";
}

export function Button({ children, variant, type, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md ${variant === "filled" && "bg-blue-500 text-white"} ${variant === "outlined" && `border-2 ${rest.disabled && "opacity-75"}`}`}
      {...rest}
    >
      {children}
    </button>
  );
}
