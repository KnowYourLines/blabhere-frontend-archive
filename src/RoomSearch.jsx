import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
} from "@chatscope/chat-ui-kit-react";
import Moment from "react-moment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function RoomSearch({
  setOpen,
  roomSearchResults,
  setRoom,
  setIsRoomFull,
  setIsRoomCreator,
  setMemberLimit,
  setRoomName,
  setMembers,
  setChatHistory,
  roomWs,
}) {
  const [sizeQuery, setSizeQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const handleClose = () => setOpen(false);

  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Back key="1" onClick={handleClose} />
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              color: "black",
              fontSize: "16pt",
            }}
          >
            Search Chats
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop="1%"
        marginBottom="1%"
      >
        <Stack
          component="form"
          direction="row"
          spacing={2}
          sx={{ width: "95%" }}
          noValidate
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (sizeQuery && !Number.isInteger(sizeQuery)) {
              alert("Invalid: limit must be a whole number");
            } else if (Number.isInteger(sizeQuery) && sizeQuery < 2) {
              alert("Invalid: limit is too small");
            } else if (Number.isInteger(sizeQuery) || nameQuery) {
              console.log(sizeQuery);
              console.log(nameQuery);
            }
          }}
        >
          <TextField
            id="outlined-required"
            label="Max Members"
            value={sizeQuery}
            onChange={(e) => {
              setSizeQuery(Number(e.target.value));
            }}
            onFocus={(event) => {
              event.target.select();
            }}
            slotProps={{ htmlInput: { type: "number", min: 2 } }}
          />
          <TextField
            fullWidth
            id="outlined-required"
            label="Room Name"
            value={nameQuery}
            onChange={(e) => {
              setNameQuery(e.target.value);
            }}
            onFocus={(event) => {
              event.target.select();
            }}
          />
          <Button
            variant="contained"
            type="submit"
            startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          ></Button>
        </Stack>
      </Box>
      <ConversationList
        style={{
          height: "100%",
        }}
      >
        {roomSearchResults.map((room, i) => (
          <Conversation
            lastActivityTime={
              <span
                style={{
                  marginRight: "1em",
                }}
              >
                <Moment unix fromNow>
                  {room.latest_message_timestamp || room.created_at}
                </Moment>
              </span>
            }
            key={room.id}
          >
            <Conversation.Content
              name={room.display_name}
              info={
                room.max_num_members
                  ? `Capacity: ${room.num_members}/${room.max_num_members}`
                  : `Size: ${room.num_members}`
              }
              onClick={() => {
                const newRoom = room.id;
                const url = new URL(window.location.href.split("?")[0]);
                url.searchParams.set("room", newRoom);
                window.history.replaceState("", "", url);
                const newUrlParams = new URLSearchParams(
                  window.location.search
                );
                setRoom(newUrlParams.get("room"));
                setIsRoomFull(false);
                setIsRoomCreator(false);
                setMemberLimit(null);
                setRoomName("");
                setMembers([]);
                setChatHistory([]);
                roomWs.send(
                  JSON.stringify({
                    command: "connect",
                    room: newRoom,
                  })
                );
                handleClose();
              }}
            />
          </Conversation>
        ))}
      </ConversationList>
    </div>
  );
}
