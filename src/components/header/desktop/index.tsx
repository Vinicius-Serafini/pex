import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

type HeaderDesktopType = {
  handleLogOut: Function,
  currentRoute: string
}

export const HeaderDesktop = ({ handleLogOut, currentRoute }: HeaderDesktopType) => {
  return (
    <nav className={styles.header}>
      <div className={styles.logo}>
        <span>
          <Image
            src="/svg/Logo_flat.svg"
            height={56}
            width={110}
          />
        </span>
      </div>
      <div className={styles.links}>
        <Link href="/">
          <h4>
            <a>Perfil</a>
          </h4>
        </Link>
        <Link href="/teams">
          <h4>
            <a>Times</a>
          </h4>
        </Link>
        <Link href="/">
          <h4>
            <a>Torneios</a>
          </h4>
        </Link>
      </div>
      <div className={styles.logout}>
        <button
          className={styles.logoutBtn}
          onClick={() => handleLogOut()}>
          <FontAwesomeIcon icon={faPowerOff} />
          Sair
        </button>
      </div>
    </nav>
  );
}