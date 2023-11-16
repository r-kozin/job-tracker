import { Box, IconButton, Menu, Text, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "./Card.css";
import { parseISO } from "date-fns";
import { Link } from "react-router-dom";

const Card = (props) => {
  return (
    <Draggable draggableId={props.card.id} index={props.index}>
      {(provided, snapshot) => (
        <Link to={`/job/${props.card.id.split('-')[1]}`} className="domLink">
        <Box
          backgroundColor={"white"}
          w={"100%"}
          borderRadius={"5px"}
          display={"flex"}
          flexDirection={"column"}
          gap={"5px"}
          p={"10px"}
          border={"1px solid black"}
          mb={"10px"}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          <div className="cardHeader">
            <Text fontSize={'xl'} fontWeight="bold" color="black.500" className="company-name">
              {props.card.companyName}
            </Text>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="more"
                icon={<MoreHorizIcon />}
                variant="ghost"
              />
              <MenuList>
                <MenuItem command="⌘T">
                  New Tab
                </MenuItem>
                <MenuItem command="⌘N">
                  New Window
                </MenuItem>
                <MenuItem command="⌘⇧N">
                  Open Closed Tab
                </MenuItem>
                <MenuItem command="⌘O">
                  Open File...
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
          <Text fontSize='md' fontWeight="bold" color="black.500" className="job-title">
            {props.card.jobTitle}
          </Text>
          <Text fontSize="xs" fontWeight="bold" color="gray.500">
            Applied: {parseISO(props.card.dateapplied).toLocaleDateString()}
          </Text>
        </Box>
      </Link>
      )}
    </Draggable>
  );
};

export default Card;
