import BaseButton from "../../buttons/baseButton";
import style from './styles.module.css';

const MatchCard = () => {
  return (
    <div
      className={style.matchCardContainer}
      style={{ backgroundImage: `url('https://p2.trrsf.com/image/fget/cf/648/0/images.terra.com/2021/10/12/905036494-612aa516eca58.jpeg')` }}>
      <div className={style.colorOverlay} />
      <div className={style.body}>
        <div className={style.header}>
          <h2 className={style.title}>Jogo de quarta da piazada</h2>
          <div className={style.details}>
            <p>Nome do lugar do jogo</p>
            <p>dd/mm hh:mm</p>
          </div>
        </div>
        <div className={style.teams}>
          <h2>Time 1</h2>
          <p>X</p>
          <h2>Time 2</h2>
        </div>
        <div className={style.actions}>
          <BaseButton className={style.acceptBtn}>
            Tô dentro!
          </BaseButton>
          <BaseButton className={style.rejectBtn}>
            Fora
          </BaseButton>
        </div>
      </div >
    </div >
  )
}

export default MatchCard;