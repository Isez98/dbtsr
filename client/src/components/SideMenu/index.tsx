import React from 'react'

interface SideMenuProps {
  items: string[]
}

export const SideMenu: React.FC<SideMenuProps> = ({ items }) => {
  return (
    <div className="flex h-full flex-col capitalize">
      {items.map((item) => {
        return <div>{item}</div>
      })}
    </div>
  )
}

export default SideMenu
