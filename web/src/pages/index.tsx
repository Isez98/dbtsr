import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePropertiesQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePropertiesQuery();
  return (
    <>
      <Navbar />
      <div>Hello world</div>
      < br />
      {!data
        ? <div>...Loading.</div>
        : data.properties.map((p) => <div key={p.id}>{p.designation}</div>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
