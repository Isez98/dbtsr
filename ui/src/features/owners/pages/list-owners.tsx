import { useEffect } from "react";
import { useGetOwners } from "../../../services/ownerService";
import { OwnersTable } from "../../../components";
import type { IOwnerData } from "../../../types";

const ListOwners = () => {
  const { queryData, loading, error } = useGetOwners();

  useEffect(() => {
    console.log("Owners data:", queryData ? queryData : 'No data');
  }, [queryData]);

  const isLoading = loading === 'pending';
  const hasError = loading === 'error' || error;
  const errorMessage = hasError ? error || 'Error loading owners' : null;
  const ownersData = queryData?.owners || [];

  // Example onClick handlers
  const handleOwnerClick = (owner: IOwnerData) => {
    console.log('Owner clicked:', owner);
    // You could navigate to owner detail page, open modal, etc.
    alert(`Clicked on owner: ${owner.name}`);
  };

  const handleEmailClick = (email: string, owner: IOwnerData) => {
    console.log('Email clicked:', email, 'for owner:', owner);
    // You could open email client, copy to clipboard, etc.
    navigator.clipboard.writeText(email);
    alert(`Email ${email} copied to clipboard!`);
  };

  return (
    <>
      <OwnersTable 
        data={ownersData}
        isLoading={isLoading}
        error={errorMessage}
        onOwnerClick={handleOwnerClick}
        onEmailClick={handleEmailClick}
      />
    </>
  );
};

export default ListOwners;
