import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BaseButton from "../buttons/baseButton";
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

type FABType = {
  icon: IconDefinition,
  onClick: Function
}

export const FAB = ({ icon, onClick }: FABType) => {

  return (
    <div className={styles.FAB}>
      <BaseButton
        className={styles.btn}
        onClick={() => onClick()}>
        <FontAwesomeIcon
          className={styles.icon}
          icon={icon} />
      </BaseButton>
    </div>
  );
}