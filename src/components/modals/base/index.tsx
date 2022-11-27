import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useState } from 'react';
import Card from 'src/components/cards/baseCard';
import styles from './styles.module.css';
import { faClose } from '@fortawesome/free-solid-svg-icons';

type BaseModalProps = {
  isOpened: boolean,
  isClosable: boolean,
  withBackdrop: boolean,
  header: ReactNode,
  body: ReactNode,
  closeModal?: Function
}

const BaseModal = ({ isOpened, header, body, isClosable, closeModal, withBackdrop }: BaseModalProps) => {

  return (
    <>
      {isOpened ? (
        <div className={withBackdrop ? [styles.backdrop, styles['backdrop-bg']].join(' ') : styles.backdrop}>
          <Card className={styles.body}>
            <div className={styles.header}>
              <div>
                {header}
              </div>
              {isClosable ? (
                <button
                  onClick={() => { if (isClosable) { closeModal?.() } }}
                  className={styles.closeBtn}>
                  <FontAwesomeIcon icon={faClose} />
                </button>
              ) : null}
            </div>
            <div className={styles.body}>
              {body}
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}

export default BaseModal;