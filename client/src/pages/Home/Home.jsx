import { Container, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import BoardsList from "../../components/BoardsList/BoardsList";


const Home = () => {

  return (
    <div className="home">
      <Container
        maxW="container.xl"
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Text fontSize="6xl" fontWeight="bold" color="blue.500">
          Home
        </Text>
        <BoardsList />
      </Container>
    </div>
  );
};

export default Home;
