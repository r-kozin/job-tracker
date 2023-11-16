import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import Board from "../Board/Board";
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import {
  updateState,
  updateColumn,
  moveJob,
  reorderJob,
  reorderColumn,
  fetchAllData,
} from "../../redux/boardSlice";
import "./BoardsList.css";
import axios from "axios";

const BoardsList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const boardState = useSelector((state) => state.board);

  const isFetchingData = useSelector((state) => state.board.fetchDataStatus);
  const dispatch = useDispatch();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // filter cards based on search term
    const boardArray = Object.values(boardState.cards);
    console.log(boardArray);
    const result = boardArray.filter((card) =>
      card.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(result);
    let newColumn1 = {
      ...boardState.columns["column-1"],
      cardIds: [],
    };
    let newColumn2 = {
      ...boardState.columns["column-2"],
      cardIds: [],
    };
    let newColumn3 = {
      ...boardState.columns["column-3"],
      cardIds: [],
    };
    let newColumn4 = {
      ...boardState.columns["column-4"],
      cardIds: [],
    };
    let newColumn5 = {
      ...boardState.columns["column-5"],
      cardIds: [],
    };
    for (let i = 0; i < result.length; i++) {
      if (result[i].appstatus === "Added") {
        newColumn1.cardIds.push(`${result[i].id}`);
      } else if (result[i].appstatus === "Applied") {
        newColumn2.cardIds.push(`${result[i].id}`);
      } else if (result[i].appstatus === "Interviewing") {
        newColumn3.cardIds.push(`${result[i].id}`);
      } else if (result[i].appstatus === "Offer") {
        newColumn4.cardIds.push(`${result[i].id}`);
      } else if (result[i].appstatus === "Rejected") {
        newColumn5.cardIds.push(`${result[i].id}`);
      }
    }
    console.log(newColumn1);
    console.log(newColumn2);
    console.log(newColumn3);
    console.log(newColumn4);
    console.log(newColumn5);
    dispatch(updateColumn(newColumn1));
    dispatch(updateColumn(newColumn2));
    dispatch(updateColumn(newColumn3));
    dispatch(updateColumn(newColumn4));
    dispatch(updateColumn(newColumn5));
    
  }, [searchTerm]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = boardState.columns[source.droppableId];
    const finish = boardState.columns[destination.droppableId];

    console.log(start, finish);

    if (start === finish) {
      const newCardIds = Array.from(start.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      console.log(newCardIds);
      const newColumn = {
        ...start,
        cardIds: newCardIds,
      };

      console.log(newColumn);

      dispatch(updateColumn(newColumn));
      dispatch(reorderColumn(newColumn));
      console.log(boardState);

      //   dispatch(updateState(newState))

      return;
    }

    // Moving from one list to another
    const startCardIds = Array.from(start.cardIds);
    startCardIds.splice(source.index, 1);
    const newStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = Array.from(finish.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    const newState = {
      ...boardState,
      columns: {
        ...boardState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    dispatch(updateState({ newStart: newStart, newFinish: newFinish }));
    dispatch(moveJob({ id: draggableId, appstatus: newFinish.title }));
    dispatch(reorderJob({ newStart: newStart, newFinish: newFinish }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted");
    //console log data from form
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData);
    console.log(jobData);
    //post data to server
    const postData = async (data) => {
      if (data.dateCreated === "") {
        data.dateCreated = null;
      }
      const res = await axios.post("http://localhost:3000/new", data);
      console.log(res);
      if (res.status === 200) {
        onClose();
        dispatch(fetchAllData());
        // dispatch(addToState(data));
        toast({
          title: "Job added.",
          description:
            "Job has been added to your board and synced with server.",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        // onClose();
        // setTimeout(() => {
        //   window.location.reload();
        // }
        // , 3000);
      }
    };
    postData(jobData);
  };

  return (
    <div className="boardsList">
      <div className="right-side">
        <div className="searchBar">
          <Input
            size="md"
            placeholder="Search..."
            id="searchBar"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="add-button">
          <Button colorScheme="teal" onClick={onOpen}>
            Add Job
          </Button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          backgroundColor={"black"}
          width={"fit-content"}
          minWidth={"100%"}
          borderRadius={"10px"}
          minHeight={"200px"}
          display={"flex"}
          gap={"10px"}
          px={"15px"}
          mb={"20px"}
          maxHeight={"700px"}
        >
          {isFetchingData === "success" ? (
            boardState.columnOrder.map((board) => {
              const currentBoard = boardState.columns[board];
              const cards = currentBoard.cardIds.map(
                (card) => boardState.cards[card]
              );

              return (
                <Board
                  key={currentBoard.id}
                  board={currentBoard}
                  cards={cards}
                />
              );
            })
          ) : (
            <div>loading...</div>
          )}
        </Box>
      </DragDropContext>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <label htmlFor="companyName">Company Name</label>
              <input type="text" id="companyName" name="companyName" required />
              <label htmlFor="jobTitle">Job Title</label>
              <input type="text" id="jobTitle" name="jobTitle" required />
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                name="desc"
                placeholder="Paste job description here..."
              />
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" required />
              <label htmlFor="salaryMin">Salary Min</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                defaultValue={0}
              />
              <label htmlFor="salaryMax">Salary Max</label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                defaultValue={0}
              />
              <label htmlFor="ATS">ATS (Workday, LinkedIn, etc.)</label>
              <input type="text" id="ATS" name="ATS" />
              <label htmlFor="appURL">Application URL</label>
              <input type="text" id="appURL" name="appURL" />
              <label htmlFor="appStatus">Application Status</label>
              <select id="appStatus" name="appStatus" required>
                <option value="Added">Added</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <label htmlFor="dateCreated">Date Posted</label>
              <input type="date" id="dateCreated" name="dateCreated" />
              <div className="formButtons">
                <button type="submit" className="submitButton">
                  SUBMIT
                </button>
                <button
                  type="submit"
                  className="cancelButton"
                  onClick={onClose}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BoardsList;
