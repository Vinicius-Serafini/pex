import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import style from './Chip.module.css';

type ChipType = DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  filled?: boolean,
  children: ReactNode
}

const Chip = ({ filled = false, children }: ChipType) => {

  return (
    <button className={[style.body, filled ? style.filled : ''].join(' ')}>
      {children}
    </button>
  )
}

export default Chip;