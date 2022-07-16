import UserAvatar from "../../userAvatar";
import Card from "../baseCard";
import style from "./styles.module.css";

const GoalsCard = () => {

  return (
    <Card className={style.goalsCard}>
      <div className={style.user}>
        <UserAvatar
          src="https://www.lance.com.br/files/article_main/uploads/2022/05/25/628ea38f22dcc.jpeg"
          alt=""
          size='4rem'
        />
        <div className={style.userInfo}>
          <h3>
            Username
          </h3>
          <p>
            Time 1
          </p>
        </div>
      </div>
      <div className={style.goals}>
        <h2>
          2
        </h2>
      </div>
    </Card>
  )
}

export default GoalsCard;