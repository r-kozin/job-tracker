import React, { useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import "./Board.css";
import Card from "../Card/Card";
import { StrictModeDroppable } from "../../StrictModeDroppable";

const Board = (props) => {
  let backgroundColor;

  if (props.board.title === "Added") {
    backgroundColor = "white";
  } else if (props.board.title === "Applied") {
    backgroundColor = "lightgrey";
  } else if (props.board.title === "Interviewing") {
    backgroundColor = "lightyellow";
  } else if (props.board.title === "Offer") {
    backgroundColor = "lightgreen";
  } else if (props.board.title === "Rejected") {
    backgroundColor = "lightpink";
  } else {
    backgroundColor = "grey";
  }

  return (
    <Container
      display={"flex"}
      flexDirection={"column"}
      backgroundColor={backgroundColor}
      mt={"20px"}
      borderRadius={"10px"}
      width={"fit-content"}
      maxWidth={"19%"}
      minWidth={"19%"}
      minHeight={"200px"}
      overflowY={"auto"}
      pb={"10px"}
      className="board"
    >
      <div className="boardHeader">
        <Text fontSize="2xl" fontWeight="bold" color="black.500">
          {props.board.title}
        </Text>
        <Text fontSize="sm" fontWeight="bold" color="gray.500">
          {props.board.cardIds.length}
        </Text>
      </div>
      <StrictModeDroppable droppableId={props.board.id}>
        {(provided, snapshot) => (
          <Box
            className="jobList"
            backgroundColor={backgroundColor}
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
            minHeight={"90%"}
          >
            {
              props.cards.length <
                1 || props.cards[0] === undefined || props.cards[0].id === undefined ? (
                  <div>No jobs in this status...</div>
                ) : (
                  props.cards.map((card, index) => {
                    return <Card key={card.id} card={card} index={index} />;
                  })
                )
            }
            {provided.placeholder}
          </Box>
        )}
      </StrictModeDroppable>
    </Container>
  );
};

export default Board;
