import { getMe } from "@/services/auth/auth.service"
import { useEffect, useState } from "react" 

export const useUser = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getMe().then(setUser)
  }, [])

  return user
}