import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import SearchInput from "./SearchInput.jsx";
import SearchResults from "./SearchResults.jsx";

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
  setRoomSearchResults,
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
      <SearchInput
        sizeQuery={sizeQuery}
        setSizeQuery={setSizeQuery}
        nameQuery={nameQuery}
        setNameQuery={setNameQuery}
      ></SearchInput>
      <SearchResults
        roomSearchResults={roomSearchResults}
        setRoom={setRoom}
        setIsRoomFull={setIsRoomFull}
        setIsRoomCreator={setIsRoomCreator}
        setMemberLimit={setMemberLimit}
        setRoomName={setRoomName}
        setMembers={setMembers}
        setChatHistory={setChatHistory}
        roomWs={roomWs}
        setRoomSearchResults={setRoomSearchResults}
        handleClose={handleClose}
      ></SearchResults>
    </div>
  );
}
