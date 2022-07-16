import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import style from './styles.module.css';

type CardType = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children: ReactNode
}

const Card = ({ children, ...props }: CardType) => {

  return (
    <div
      {...props}
      className={[style.card, props.className].join(' ')}>
      {children}
    </div>
  )
}

export default Card;