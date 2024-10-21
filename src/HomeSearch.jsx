import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader, Button } from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faCommentMedical,
} from "@fortawesome/free-solid-svg-icons";
import SearchInput from "./SearchInput.jsx";
import SearchResults from "./SearchResults.jsx";

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
  setRoomSearchResults,
  roomWs,
  sizeQuery,
  setSizeQuery,
  nameQuery,
  setNameQuery,
}) {
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
        setRoomSearchResults={setRoomSearchResults}
        roomWs={roomWs}
      ></SearchResults>
    </div>
  );
}
