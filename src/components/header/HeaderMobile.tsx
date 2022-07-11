import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faUserGroup, faTrophy, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import style from "./HeaderMobile.module.css";
import Link from "next/link";

type HeaderMobileType = {
  handleLogOut: Function,
  currentRoute: string
}

export const HeaderMobile = ({ handleLogOut, currentRoute }: HeaderMobileType) => {

  return (
    <nav className={style.navbar}>
      <div className={style.btn}>
        <FontAwesomeIcon icon={faUser} />
        <Link href="/">
          <span>Perfil</span>
        </Link>
      </div>
      <div className={style.btn}>
        <FontAwesomeIcon icon={faUserGroup} />
        <Link href="/teams">
          <span>Times</span>
        </Link>
      </div>
      <div className={style.btn}>
        <FontAwesomeIcon icon={faTrophy} />
        <Link href="/">
          <span>Torneios</span>
        </Link>
      </div>
      <div className={style.btn}>
        <FontAwesomeIcon icon={faPowerOff} />
        <button onClick={() => handleLogOut()}>
          <span>Perfil</span>
        </button>
      </div>
    </nav>
  )
}