import React from 'react'
import CreateEventButton from './CreateEventButton'
import SmallCalendar from './SmallCalendar'

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  return (
    <aside className="w-64 border p-5">
      <CreateEventButton />
      <SmallCalendar />
    </aside>
  )
}

export default Sidebar
