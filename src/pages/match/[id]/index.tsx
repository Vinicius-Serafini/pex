import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import Image from "next/image";
import Card from "../../../components/cards/baseCard";
import UserCard from "../../../components/cards/user";
import Chip from "../../../components/chips";
import Tabs from "../../../components/tabs";
import style from './styles.module.css';
import { faClock, faMapMarkedAlt, faAngleRight, faTrophy } from '@fortawesome/free-solid-svg-icons';
import BaseButton from "../../../components/buttons/baseButton";
import FormationCard from "../../../components/cards/formation";
import GoalsCard from "../../../components/cards/goals";

const InfoTab = () => (
  <>
    <Card className={style.dateTimeCard}>
      <div className={style.dateTimeCardBody}>
        <FontAwesomeIcon
          icon={faClock}
          className={style.icon} />
        <div className={style.dateTime}>
          <h4 className={style.date}>
            6 de Junho, Quarta-Feira
          </h4>
          <p className={style.time}>
            20h54 - 22h
          </p>
        </div>
      </div>
    </Card>

    <Card className={style.locationCard}>
      <BaseButton className={style.locationCardBody}>
        <span className={style.locationWrapper}>
          <FontAwesomeIcon
            icon={faMapMarkedAlt}
            className={style.icon} />
          <div className={style.location}>
            <h4 className={style.district}>
              Vila Belmiro
            </h4>
            <p className={style.street}>
              Rua Princesa Isabel, S/N, Vila Belmiro, Santos - SP...
            </p>
          </div>
        </span>
        <div className={style.locationIconWrapper}>
          <FontAwesomeIcon
            icon={faAngleRight} />
        </div>
      </BaseButton>
    </Card>

    <div className={style.players}>
      <h2 className={style.playersTitle}>
        Confirmados <span>5 / 22</span>
      </h2>
      <div className={style.playersFilter}>
        {['Todos', 'Time 1', 'Time 2'].map((label, idx) => (
          <Chip key={idx}>
            {label}
          </Chip>
        ))}
      </div>
      <div className={style.playersList}>
        {Array.from(Array(5).keys()).map((_, idx) => (
          <UserCard key={idx} />
        ))}
      </div>
    </div>
  </>


)

const LineupTab = () => (
  <div className={style.lineupTab}>
    <div className={style.lineupTeamBtn}>
      <button className={style.active}>
        Time 1
      </button>
      <button>
        Time 2
      </button>
    </div>

    <FormationCard />
  </div>
)

const ResultTab = () => (
  <div className={style.resultTab}>
    <Card className={style.winnerCard}>
      {[{ name: 'Team 1', goals: 3, winner: true }, { name: 'Team 2', goals: 1, winner: false }].map((team, index) => (
        <div className={[style.team, (team.winner ? style.winner : '')].join(" ")}>
          {/* <FontAwesomeIcon icon={faTrophy} className={style.winnerIcon} /> */}
          <h2 className={style.teamName}>{team.winner && <span>🏆</span>} {team.name}</h2>
          <h2>{team.goals}</h2>
        </div>
      ))}
    </Card>

    <BaseButton className={style.statsBtn}>
      <h2>
        Estatísticas completas
      </h2>
    </BaseButton>

    <div className={style.goals}>
      <h2>
        Gols
      </h2>
      <div className={style.goalsList}>
        {Array.from(Array(5).keys()).map((_, index) => (
          <GoalsCard key={index} />
        ))}
      </div>
    </div>
  </div>
)


const Match: NextPage = () => {
  return (
    <div>
      <main>
        <div
          className={style.header}
          style={{ backgroundImage: `url('https://p2.trrsf.com/image/fget/cf/648/0/images.terra.com/2021/10/12/905036494-612aa516eca58.jpeg')` }}>
          <div className={style.colorOverlay} />
          <div className={style.headerBody}>
            <h2>Jogo de quarta da piazada</h2>
          </div>
        </div>

        <div className={style.tabs}>
          <Tabs tabs={[
            { title: 'Info', component: <InfoTab /> },
            { title: 'Escalação', component: <LineupTab /> },
            { title: 'Resultado', component: <ResultTab /> },
          ]} />
        </div>
      </main>
      <div className={style.fabAcceptMatch}>
        <button className={style.accept}>
          <h3>
            To dentro!
          </h3>
        </button>
        <button className={style.reject}>
          <h3>
            To fora
          </h3>
        </button>
      </div>
    </div>
  );
}

export default Match;