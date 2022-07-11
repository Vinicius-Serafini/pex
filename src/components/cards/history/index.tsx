import style from './HistoryCard.module.css';

const HistoryCard = () => {
  return (
    <div className={style.body}>
      <div className={style.team}>
        <h3>
          Time 1
        </h3>
      </div>
      <div className={style.score}>
        <h2>1</h2>
        <p>x</p>
        <h2>0</h2>
      </div>
      <div className={style.team}>
        <h3>
          Time 2
        </h3>
      </div>
    </div>
  );
}

export default HistoryCard;