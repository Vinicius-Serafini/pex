import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { isCurrentUserTheTeamOwner, isObjectEmpty } from "src/utils";
import UserAvatar from "../../userAvatar";
import Card from "../baseCard";
import style from "./styles.module.css";
import { FormationModal } from "src/components/modals/formationModal";
import { useEffect, useState } from "react";
import { useCurrentTeam } from "src/hooks/useCurrentTeam";
import { useAuth } from "src/hooks/useAuth";

type FormationCardProps = {
  editable?: boolean
}

const FormationCard = ({ editable = false }: FormationCardProps) => {

  const { lineup, team } = useCurrentTeam();

  const { user } = useAuth();

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  const closeModal = () => { setIsModalOpened(false) };
  const openModal = () => { setIsModalOpened(true) };

  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (!isModalOpened) {
      setSelectedPosition(null);
    }
  }, [isModalOpened])

  return (
    <>
      <Card>
        <div className={style.lineupWrapper}>
          <div className={style.lineup}>
            {lineup.get().map((row: Array<any>, x: number) => (
              <div className={style.lineupRow} key={`row-${x}`}>
                {row.map((position, y) => {
                  if (!position) {
                    return null;
                  }

                  if (!position.first || isObjectEmpty(position.first)) {
                    // if (lineup.isLineupFull || !editable) {
                    if (lineup.isLineupFull || !isCurrentUserTheTeamOwner(team, user)) {
                      return <div className={style.btnContainer} key={`row-${x}-column-${y}`} />;
                    }

                    return (
                      <button
                        className={[style.btnContainer, style.addPlayerBtn, style.shadowBg].join(' ')}
                        onClick={() => { openModal(); setSelectedPosition(position) }}
                        key={`row-${x}-column-${y}`}>
                        <FontAwesomeIcon
                          icon={faPlus}
                          size="lg" />
                      </button>
                    )
                  }

                  return (
                    <button
                      className={[style.shadowBg, style.playerIcon].join(' ')}
                      onClick={() => { openModal(); setSelectedPosition(position) }}
                      key={`row-${x}-column-${y}`}>
                      <UserAvatar
                        src={position.first.avatar}
                        alt={position.first.name}
                        size='4rem'
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <img src="/images/soccer_field.png" alt="soccer-field" />
          {/* <Image
            src="/images/soccer_field.png"
            height={545}
            width={394}
          /> */}
        </div>
      </Card>

      <FormationModal
        isOpened={isModalOpened}
        closeModal={closeModal}
        position={selectedPosition} />
    </>
  )
}

export default FormationCard;