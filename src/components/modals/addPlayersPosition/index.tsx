import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react";
import UserCard from "src/components/cards/user";
import { useCurrentTeam } from "src/hooks/useCurrentTeam";
import BaseModal from "../base";
import styles from "./styles.module.css";
import { Position, User } from "src/types";

type AddPlayersPositionModalProps = {
  modalState: { is_substitute: null | boolean, is_opened: boolean };
  close: Function;
  addPlayer: Function
}

export function AddPlayersPositionModal({ modalState, close, addPlayer }: AddPlayersPositionModalProps) {

  const { team, lineup } = useCurrentTeam();

  const availablePlayers = team.players ? team.players.filter(player => {
    const duplicate_player = lineup.get().flat().find((position: Position) => {
      if (!position) {
        return false;
      }

      if (position.first.uid == player.uid) {
        return true;
      }

      if (position.substitutes.find((p: User) => p.uid == player.uid)) {
        return true;
      }

      return false;
    });

    if (duplicate_player) {
      return false;
    }

    return true;
  }) : [];


  return (
    <BaseModal
      isClosable={true}
      closeModal={close}
      isOpened={modalState.is_opened}
      withBackdrop={true}
      header={(
        <h2>Escolha um jogador</h2>
      )}
      body={(
        <div className={styles.modalBody}>
          {availablePlayers.length > 0 ? (
            <>
              {availablePlayers.map((player, idx) => (
                <button
                  className={styles.playerItem}
                  key={idx}
                  onClick={() => addPlayer(player, modalState.is_substitute)}>
                  <UserCard user={player} />
                  <span className={styles.icon}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      size="2x"
                    />
                  </span>
                </button>
              ))}
            </>
          ) : (
            <span>Sem jogadores disponíveis</span>
          )}
        </div>
      )}
    />
  )
}