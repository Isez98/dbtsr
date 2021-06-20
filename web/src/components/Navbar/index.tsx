import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { useRouter } from "next/router";
import { isServer } from "../../utils/isServer";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {



  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const router = useRouter();
  let body = null;


  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    // Execute useEffect code
    
    // user is logged in
  } else {
    body = (
      <Flex bg="blue.500" p={4}>
        <Box ml={"auto"}>
          {data.me.email}
          <Button
            onClick={() => {
              router.push("/login");
              logout();              
            }}
            isLoading={logoutFetching}
            ml={4}
            variant="link"
          >
            Logout
          </Button>
        </Box>
      </Flex>
    );
  }
  return <Box>{body}</Box>;
};
