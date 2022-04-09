import Head from 'next/head'
import React from 'react'
import NavBar from '../components/NavBar'

interface DevelopmentsProps {}

export const Developments: React.FC<DevelopmentsProps> = ({}) => {
  return (
    <div>
      <Head>
        <title>Developments</title>
      </Head>
      <NavBar routes={['home', 'owners']} />
      <main>
        <h1>Development's page</h1>
      </main>
      <footer>Desert By The Sea Rentals</footer>
    </div>
  )
}

export default Developments
