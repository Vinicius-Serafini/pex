import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserCard from "src/components/cards/user";
import UserAvatar from "src/components/userAvatar";
import { isCurrentUserTheTeamOwner, isObjectEmpty } from "src/utils";
import BaseModal from "../base";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons"
import style from "./style.module.css";
import { AddPlayersPositionModal } from "../addPlayersPosition";
import { useState } from "react";
import { useCurrentTeam } from "src/hooks/useCurrentTeam";
import { User } from "src/types";
import { useAuth } from "src/hooks/useAuth";

type FormationModalType = {
  isOpened: boolean,
  closeModal: Function,
  position?: any
}

export function FormationModal({ isOpened, closeModal, position }: FormationModalType) {
  const { lineup, team } = useCurrentTeam();

  const { user } = useAuth();

  const [modalState, setmodalState] = useState<any>({ is_substitute: null, is_opened: false });

  const openAddPlayerModal = (is_substitute: boolean) => {
    setmodalState({ is_substitute: is_substitute, is_opened: true });
  }

  const closeAddPlayerModal = () => {
    setmodalState({ is_substitute: null, is_opened: false });
  }

  const addPlayer = (player: User, is_substitute: boolean) => {
    if (!isCurrentUserTheTeamOwner(team, user)) {
      return;
    }

    if (is_substitute) {
      lineup.addSubstitutePlayer(position.position, player);
    } else {
      lineup.addPlayer(position.position, player);
    }

    closeAddPlayerModal();
  }

  return (
    <>
      <BaseModal
        isOpened={isOpened}
        isClosable={true}
        withBackdrop={true}
        closeModal={closeModal}
        header={(
          <h2>Adicionar jogador</h2>
        )}
        body={(
          <div className={style.bodyModal}>
            <div className={style.content}>
              <h3 className={style.contentHeader}>Titular:</h3>
              {position && !isObjectEmpty(position.first) ? (
                <div>
                  <div className={style.userBtn}>
                    <UserCard
                      user={position.first}
                    />
                    {isCurrentUserTheTeamOwner(team, user) && (
                      <div className={style.actions}>
                        <button
                          className={style.editBtn}
                          onClick={() => openAddPlayerModal(false)}>
                          <FontAwesomeIcon
                            icon={faPen}
                            size="lg" />
                        </button>
                        {position.substitutes.length == 0 && (
                          <button
                            className={style.deleteBtn}
                            onClick={() => { lineup.remove(position.first); closeModal() }}>
                            <FontAwesomeIcon
                              icon={faTrash}
                              size="lg" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {!lineup.isLineupFull && isCurrentUserTheTeamOwner(team, user) ? (
                    <button
                      className={style.addPlayerBtn}
                      onClick={() => openAddPlayerModal(false)}>
                      <p>
                        <span className={style.icon}>
                          <FontAwesomeIcon icon={faPlus} />
                        </span> Adicionar jogador
                      </p>
                    </button>
                  ) : (
                    <span>Sem jogador titular</span>
                  )}
                </>
              )}
            </div>
            {(position && !isObjectEmpty(position.first)) && (
              <div className={style.content}>
                <h3 className={style.contentHeader}>Reservas:</h3>
                <div>
                  {position?.substitutes?.length > 0 ? (
                    <>
                      {isCurrentUserTheTeamOwner(team, user) && (
                        <button
                          className={style.addPlayerBtn}
                          onClick={() => openAddPlayerModal(true)}>
                          <p>
                            <span className={style.icon}>
                              <FontAwesomeIcon icon={faPlus} />
                            </span> Adicionar jogador
                          </p>
                        </button>
                      )}
                      <div className={style.contentList}>
                        {position.substitutes.map((player: User) => (
                          <div className={style.userBtn} key={Math.random()}>
                            <UserCard
                              user={player}
                            />
                            {isCurrentUserTheTeamOwner(team, user) && (
                              <div className={style.actions}>
                                <button
                                  className={style.deleteBtn}
                                  onClick={() => lineup.remove(player)}>
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    size="lg" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {isCurrentUserTheTeamOwner(team, user) && (
                        <button
                          className={style.addPlayerBtn}
                          onClick={() => openAddPlayerModal(true)}>
                          <p>
                            <span className={style.icon}>
                              <FontAwesomeIcon icon={faPlus} />
                            </span> Adicionar jogador
                          </p>
                        </button>
                      )}
                      <span>Sem jogadores reservas...</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      />

      <AddPlayersPositionModal
        modalState={modalState}
        close={closeAddPlayerModal}
        addPlayer={addPlayer}
      />

    </>
  )
}