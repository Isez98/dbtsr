import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { useRouter } from "next/router";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const router = useRouter();
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    router.push("/login");
    // user is logged in
  } else {
    body = (
      <Flex bg="blue.500" p={4}>
        <Box ml={"auto"}>
          {data.me.email}
          <Button
            onClick={() => logout()}
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
