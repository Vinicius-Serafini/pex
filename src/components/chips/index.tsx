import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import style from './styles.module.css';

type ChipType = DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  filled?: boolean,
  children: ReactNode
}

const Chip = ({ filled = false, children, ...props }: ChipType) => {

  return (
    <button className={[style.body, filled ? style.filled : ''].join(' ')} {...props}>
      {children}
    </button>
  )
}

export default Chip;