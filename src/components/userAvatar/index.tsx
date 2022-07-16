import style from "./styles.module.css";

type UserAvatarType = {
  src: string,
  alt: string,
  size: string | number
}

const UserAvatar = ({ src, alt, size }: UserAvatarType) => {

  return (
    <div
      className={style.lineup}
      style={{
        height: size,
        width: size
      }}>
      <div className={style.avatarContainer}>
        <img
          style={{
            height: size,
            width: 'auto'
          }}
          className={style.avatar}
          src={src}
          alt={alt} />
      </div>
    </div>
  )
}

export default UserAvatar;