import style from './PlayerCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

const PlayerCard = () => {
  return (
    <div className={style.card}>
      <div>
        <span className={style.title}>
          <FontAwesomeIcon icon={faCrown} />
          <h3>
            Time 1
          </h3>
        </span>
        <p>Atacante</p>
      </div>
      <div className={style.players}>
        {Array.from(Array(11).keys()).map(() => (
          // <div
          //   style={{ backgroundImage: `url('https://www.lance.com.br/files/article_main/uploads/2022/05/25/628ea38f22dcc.jpeg')` }}
          //   className={style.userAvatar} />
          <img
            src="https://www.lance.com.br/files/article_main/uploads/2022/05/25/628ea38f22dcc.jpeg"
            alt=""
            className={style.userAvatar} />
        ))}
      </div>
    </div>
  )
}

export default PlayerCard;