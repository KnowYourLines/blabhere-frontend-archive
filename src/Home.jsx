import React, { useState } from "react";
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader, Button } from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import Unverified from "./Unverified.jsx";
import OutlinedCard from "./OutlinedCard.jsx";
import AgreeTerms from "./AgreeTerms.jsx";
import Typography from "@mui/material/Typography";
import SearchInput from "./SearchInput.jsx";
import SearchResults from "./SearchResults.jsx";

export default function Home({
  handleOpenConvos,
  handleOpenSignIn,
  handleOpenDelete,
  isAnonymous,
  isVerified,
  setMembers,
  setChatHistory,
  roomWs,
  agreedTerms,
  userWs,
  searchResults,
  setSearchResults,
}) {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const [openTerms, setOpenTerms] = useState(false);
  const handleOpenTerms = () => setOpenTerms(true);
  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <AgreeTerms
        openModal={openTerms}
        setOpenModal={setOpenTerms}
        userWs={userWs}
      />
      <Unverified
        openModal={openModal}
        setOpenModal={setOpenModal}
        isAnonymous={isAnonymous}
        handleOpenSignIn={handleOpenSignIn}
      />
      <ConversationHeader
        style={{ position: "fixed", height: "100%", width: "100%" }}
      >
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              fontSize: "20pt",
              marginBottom: "1%",
            }}
          >
            {!isAnonymous && (
              <Button
                icon={
                  <FontAwesomeIcon
                    icon={faComments}
                    onClick={handleOpenConvos}
                  />
                }
              ></Button>
            )}
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
            {!isAnonymous && (
              <Button
                icon={
                  <FontAwesomeIcon
                    icon={faUserXmark}
                    onClick={handleOpenDelete}
                  />
                }
              ></Button>
            )}
          </span>
          <OutlinedCard
            cardContent={
              <div>
                <Typography variant="h1" component="div">
                  {"BlabHere"}
                </Typography>
                <SearchInput
                  handleOpenModal={handleOpenModal}
                  handleOpenTerms={handleOpenTerms}
                  agreedTerms={agreedTerms}
                  isVerified={isVerified}
                  roomWs={roomWs}
                ></SearchInput>
              </div>
            }
          ></OutlinedCard>
          {searchResults.length > 0 && (
            <OutlinedCard
              cardContent={
                <SearchResults
                  roomWs={roomWs}
                  setMembers={setMembers}
                  setChatHistory={setChatHistory}
                  searchResults={searchResults}
                ></SearchResults>
              }
            ></OutlinedCard>
          )}
        </ConversationHeader.Content>
      </ConversationHeader>
    </div>
  );
}
