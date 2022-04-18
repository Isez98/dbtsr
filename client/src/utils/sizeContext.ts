import { createContext, useContext, useState } from 'react'

export type SizeContextType = {
  size: boolean
  setSize: (c: boolean) => void
}
export const SizeContext = createContext<SizeContextType>({
  size: false, // set a default value
  setSize: () => {},
})
export const useSizeContext = () => useContext(SizeContext)
