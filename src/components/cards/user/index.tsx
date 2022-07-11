import Card from "../baseCard";
import style from './UserCard.module.css';

const UserCard = () => {

  return (
    <Card className={style.userCard}>
      <div className={style.body}>
        <div
          className={style.userAvatarContainer}>
          <img
            className={style.userAvatar}
            src="https://www.lance.com.br/files/article_main/uploads/2022/05/25/628ea38f22dcc.jpeg"
            alt="" />
        </div>
        <div className={style.title}>
          <h3>
            Nome do jogador
          </h3>
          <p>
            Atacante - titular
          </p>
        </div>
      </div>
    </Card>
  )
}

export default UserCard;