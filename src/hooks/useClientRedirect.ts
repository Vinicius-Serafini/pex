import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useClientRedirect(condition: boolean, route: string = "/") {
  const router = useRouter();

  useEffect(() => {
    if (condition) {
      router.replace(route)
    }
  }, [condition])
}