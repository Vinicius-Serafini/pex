import { logOut } from "src/services/firebaseClient";
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
import nookies from "nookies";
import useWindowDimensions from "src/hooks/useWindowDimensions";
import { HeaderDesktop } from "./HeaderDesktop";
import { HeaderMobile } from "./HeaderMobile";
import { useEffect, useState } from "react";

export const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [mounted, setMounted] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(router.pathname);

  const handleLogOut = async () => {
    if (user) {
      router.replace("/");
      nookies.destroy(undefined, 'nextauth.token');
      logOut();
    }
  }

  useEffect(() => {
    setMounted(true);
  }, [])

  useEffect(() => {
    setCurrentRoute(router.pathname);
  }, [router.pathname])

  return mounted && width && width > 768 ?
    <HeaderDesktop handleLogOut={handleLogOut} currentRoute={currentRoute} />
    : <HeaderMobile handleLogOut={handleLogOut} currentRoute={currentRoute} />
}