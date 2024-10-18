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

export default function RoomSearch({
  setOpen,
  rooms,
  setRoom,
  setIsRoomFull,
  setIsRoomCreator,
  setMemberLimit,
  setRoomName,
  setMembers,
  setChatHistory,
  roomWs,
}) {
  const [newLimit, setNewLimit] = useState(undefined);
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
          sx={{ width: "75%" }}
          noValidate
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (newLimit !== undefined && !Number.isInteger(newLimit)) {
              alert("Invalid: limit must be a whole number");
            } else if (Number.isInteger(newLimit) && newLimit < 2) {
              alert("Invalid: limit is too small");
            } else if (Number.isInteger(newLimit) || nameQuery) {
              console.log(newLimit);
              console.log(nameQuery);
            }
          }}
        >
          <TextField
            id="outlined-required"
            label="Max Members"
            value={newLimit}
            onChange={(e) => {
              setNewLimit(Number(e.target.value));
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
          <Button variant="contained" type="submit">
            Search
          </Button>
        </Stack>
      </Box>
      <ConversationList
        style={{
          height: "100%",
        }}
      >
        {rooms.map((room, i) => (
          <Conversation
            lastActivityTime={
              <span
                style={{
                  marginRight: "1em",
                }}
              >
                <Moment unix fromNow>
                  {room.latest_message__created_at || room.created_at}
                </Moment>
              </span>
            }
            key={room.id}
          >
            <Conversation.Content
              name={room.display_name}
              info={room.latest_message__content}
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
