import style from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { Team } from 'src/types';

type TeamProps = {
  team: Team,
  isUserOwner: boolean
}

const TeamCard = ({ team, isUserOwner }: TeamProps) => {
  return (
    <div className={style.card}>
      <div>
        <span className={style.title}>
          {isUserOwner ? (
            <FontAwesomeIcon icon={faCrown} />
          )
            : (<></>)}
          <h3>
            {team.name}
          </h3>
        </span>
      </div>
      <div className={style.players}>
        {team.players?.slice(0, 11).map(({ avatar }, index) => (
          <img
            key={index}
            src={avatar}
            alt=""
            className={style.userAvatar}
            referrerPolicy="no-referrer" />
        )
        )}
      </div>
    </div>
  )
}

export default TeamCard;