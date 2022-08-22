import { User } from "src/types";
import Card from "../baseCard";
import style from './styles.module.css';

type UserCardProp = {
  user: User
}

const UserCard = ({ user }: UserCardProp) => {

  return (
    <Card className={style.userCard}>
      <div className={style.body}>
        <div
          className={style.userAvatarContainer}>
          <img
            className={style.userAvatar}
            src={user?.avatar}
            alt={user.name}
            referrerPolicy="no-referrer" />
        </div>
        <div className={style.title}>
          <h3>
            {user?.name}
          </h3>
        </div>
      </div>
    </Card>
  )
}

export default UserCard;