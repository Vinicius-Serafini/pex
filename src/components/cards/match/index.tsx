import Link from "next/link";
import Router from "next/router";
import React, { MouseEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "src/hooks/useAuth";
import { acceptMatch, rejectMatch } from "src/services/matchService";
import { Match, User } from "src/types";
import BaseButton from "../../buttons/baseButton";
import style from './styles.module.css';

type MatchCardProps = {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {

  const [_match, setMatch] = useState<Match>(match);

  const { user } = useAuth();

  const isMatchAccepted = () => {
    if (!_match.confirmed) {
      return null;
    }

    const u = _match.confirmed.find(c => c.user.uid == user?.uid);

    if (u?.status == "ACCEPTED") {
      return true;
    }

    if (u?.status == "REJECTED") {
      return false;
    }
  }

  const formatMatchDate = (date: Date): string => {
    return `${date.getDate()}/${(date.getMonth() + 1)} - ${date.getHours()}:${date.getMinutes()}`
  }

  const handleAcceptMatch = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    match = await acceptMatch(_match, user as User) as Match;

    setMatch(match);

    toast('Convite aceito!',
      {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }

  const handleRejectMatch = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    match = await rejectMatch(match, user as User) as Match;
    setMatch(match);

    toast('Convite recusado!',
      {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }

  return (
    <Link href={`/match/${_match.uid}`}>
      <div
        className={style.matchCardContainer}
        style={{ backgroundImage: `url('${_match.imgUrl}')` }}>
        <div className={style.colorOverlay} />
        <div className={style.body}>
          <div className={style.header}>
            <h2 className={style.title}>{_match.name}</h2>
            <div className={style.details}>
              <p>{_match.place.name}</p>
              <p>{formatMatchDate(_match.date)}</p>
            </div>
          </div>
          <div className={style.teams}>
            <h2>{typeof _match.owner != 'string' ? _match.owner.name : ''}</h2>
            <p>X</p>
            <h2>{_match.invitedTeam ? _match.invitedTeam.name : 'A definir'}</h2>
          </div>
          <div className={style.actions}>
            {isMatchAccepted() == null ? (
              <>
                <BaseButton
                  className={style.acceptBtn}
                  onClick={handleAcceptMatch}>
                  Tô dentro!
                </BaseButton>
                <BaseButton
                  className={style.rejectBtn}
                  onClick={handleRejectMatch}>
                  Fora
                </BaseButton>
              </>
            ) : (<>
              {isMatchAccepted() == true && (
                <span className={style.acceptBtn}>
                  Aceito!
                </span>
              )}
              {isMatchAccepted() == false && (
                <span className={style.rejectBtn}>
                  Rejeitado
                </span>
              )}
            </>)}
          </div>
        </div >
      </div >
    </Link>
  )
}

export default MatchCard;