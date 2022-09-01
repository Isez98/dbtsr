import React, { ReactElement } from 'react'
import PageFrame from '../components/PageFrame'
import { NextPageWithLayout } from './_app'

export const Properties: NextPageWithLayout = ({}) => {
  return <PageFrame title="Properties">Properties</PageFrame>
}

Properties.getLayout = function getLayout(page: ReactElement) {
  return page
}

export default Properties
