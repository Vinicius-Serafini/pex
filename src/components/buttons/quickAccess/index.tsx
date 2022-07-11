import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import style from './QuickAccess.module.css';

type QuickAccess = {
  icon: IconDefinition,
  label: string,
  onClick: Function
}

const QuickAccess = ({ icon, label, onClick }: QuickAccess) => {

  return (
    <div className={style.quickAccess}>
      <button
        id={label}
        onClick={() => onClick}>
        <FontAwesomeIcon icon={icon} />
      </button>
      <label htmlFor={label}>{label}</label>
    </div>
  )
}

export default QuickAccess;