import React, { useContext } from 'react'
import GlobalContext from '../../context/GlobalContext'
import NavBar from '../NavBar'
import SideMenu from '../SideMenu'

interface PageFrameProps {}

export const PageFrame: React.FC<PageFrameProps> = ({ children }) => {
  const { size } = useContext(GlobalContext)

  return (
    <div className="h-full w-full">
      <div className="flex w-full">
        <SideMenu className=" px-3" items={['home', 'owners']} />
        <div
          className={`page-container bg-white ${
            size ? 'page__widen' : 'page__shrink'
          }`}
        >
          <NavBar routes={['home', 'owners', 'developments']} />
          <main className="justify-content-center container h-auto">
            {children}
          </main>
          <footer className="w-100 flex justify-center">
            Desert By The Sea Rentals
          </footer>
        </div>
      </div>
    </div>
  )
}

export default PageFrame
