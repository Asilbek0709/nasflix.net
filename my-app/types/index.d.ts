import { Dispatch, ReactNode, SetStateAction } from "react";

export interface ContextType {
    account: AccountProps | null,
    setAccaunt: Dispatch<SetStateAction<AccountProps | null>>
}
export interface AccountProps {
    _id: string,
    uid: string,
    name: string,
    pin: string
}

export interface ChildProps {
    children: ReactNode
}
export interface Movie {
  id: number
  slug: string

  title: {
    uz: string
    ru: string
    en: string
  }

  description: {
    uz: string
    ru: string
    en: string
  }

  year: number
  duration: number
  rating: number

  genres: string[]

  director: string

  actors: string[]
  

  poster: string
  video: string
  trailer: string

  country: string
  director: object
  actors: object[]

  subscription: "basic" | "medium" | "pro"

}   
