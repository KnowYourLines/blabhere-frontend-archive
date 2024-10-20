import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
  Button,
} from "@chatscope/chat-ui-kit-react";
import Moment from "react-moment";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faComments,
  faCommentMedical,
} from "@fortawesome/free-solid-svg-icons";
import SearchButton from "./SearchButton.jsx";

export default function HomeSearch({
  handleOpenConvos,
  handleOpenSignIn,
  isAnonymous,
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

  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              fontSize: "16pt",
            }}
          >
            <Button
              icon={
                <FontAwesomeIcon
                  icon={faCommentMedical}
                  onClick={() => {
                    const newRoom = uuidv4();
                    const url = new URL(window.location.href.split("?")[0]);
                    url.searchParams.set("room", newRoom);
                    window.open(url, "_blank");
                  }}
                />
              }
            ></Button>
            {isAnonymous ? (
              <Button
                style={{
                  border: "2px solid #6ea9d7",
                  backgroundColor: "#6ea9d7",
                  color: "#f6fbff",
                }}
                onClick={handleOpenSignIn}
              >
                Sign In
              </Button>
            ) : (
              <Button
                style={{
                  border: "2px solid #6ea9d7",
                  backgroundColor: "#6ea9d7",
                  color: "#f6fbff",
                }}
                onClick={() => {
                  signOut(auth);
                  window.location.reload();
                }}
              >
                Sign Out
              </Button>
            )}
            <Button
              icon={
                <FontAwesomeIcon icon={faComments} onClick={handleOpenConvos} />
              }
            ></Button>
          </span>
          <span
            style={{
              alignSelf: "center",
              color: "black",
              fontSize: "16pt",
              marginTop: "1%",
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
          <SearchButton
            variant="contained"
            type="submit"
            startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          ></SearchButton>
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
              }}
            />
          </Conversation>
        ))}
      </ConversationList>
    </div>
  );
}
