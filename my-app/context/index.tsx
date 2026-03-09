"use client"

import { AccountProps, ChildProps, ContextType } from '@/types'
import { createContext, useContext, useState } from 'react'

export const Context = createContext<ContextType | null>(null)

const GlobalContext = ({children} : ChildProps) => {
    const [account, setAccaunt] = useState<AccountProps | null>(null)
  return (
    <Context.Provider value={{account, setAccaunt}}>
        {children}
    </Context.Provider>
  )
}

export default GlobalContext;

export const useGlobalContext = () => {
    const context = useContext(Context)
    if(context === null){
        throw new Error("useGlobalcontext must be used")
    }
    return context
}