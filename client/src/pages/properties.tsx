import React, { useContext } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import Table from '../components/Table'
import GlobalContext from '../context/GlobalContext'
import { usePropertiesQuery } from '../generated/graphql'

export const Properties = ({}) => {
  // const router = useRouter()
  const [{ data }] = usePropertiesQuery({
    variables: { limit: 10 },
  })
  // const [ownersData, setOwnersData] = useState({})
  const { showEventModal } = useContext(GlobalContext)

  const columns = [
    { title: 'ID', key: 'id' },
    { title: 'Designation', key: 'designation' },
    { title: 'Development', key: 'developmentId' },
    { title: 'Owner', key: 'ownerId' },
  ]

  // function onRowClick(row: any) {
  //   router.push(`owner/${row}`)
  // }

  return (
    <React.Fragment>
      {showEventModal && <EventModal className="z-20" formType="Owner" />}
      {data ? (
        <>
          <AddButton />
          <Table columns={columns} data={data.properties} className="p-6" />
        </>
      ) : (
        <>Nothing to see here...</>
      )}
    </React.Fragment>
  )
}

export default Properties
