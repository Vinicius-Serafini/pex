import { Team, User } from "src/types";
import UserAvatar from "../../userAvatar";
import Card from "../baseCard";
import style from "./styles.module.css";

type GoalsCardProps = {
  user: User,
  team: { uid: string, name: string },
  quantity: number
}

const GoalsCard = ({ user, team, quantity }: GoalsCardProps) => {

  return (
    <Card className={style.goalsCard}>
      <div className={style.user}>
        <UserAvatar
          src={user.avatar}
          alt=""
          size='4rem'
        />
        <div className={style.userInfo}>
          <h3>
            {user.name}
          </h3>
          <p>
            {team.name}
          </p>
        </div>
      </div>
      <div className={style.goals}>
        <h2>
          {quantity}
        </h2>
      </div>
    </Card>
  )
}

export default GoalsCard;