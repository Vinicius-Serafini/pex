import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type BaseButtonType =
  DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    loading?: boolean,
    children: ReactNode,
  }

const BaseButton = (props: BaseButtonType) => {
  return (
    <button  {...props}>
      {props.children}
    </button>
  )
}

export default BaseButton;