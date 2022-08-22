import { changeGoogleAvatarSize } from 'src/utils';
import { User } from 'src/types';
import styles from './styles.module.css';

type UserStickerType = {
  user: User
}

const UserSticker = ({ user }: UserStickerType) => {
  return (
    <div className={styles.stickerContainer}>
      <div className={styles.stickerBody}>
        <div className={styles.userNameContainer}>
          {user.avatar ? (
            <img
              className={styles.userAvatar}
              src={changeGoogleAvatarSize(user.avatar)}
              referrerPolicy="no-referrer" />
          ) : null}
          <div className={styles.userNameWrapper}>
            <span>
              <h3 className={styles.userName}>{user.name}</h3>
              <hr />
            </span>
          </div>
        </div>
      </div>
    </div >
  )
}

export default UserSticker;