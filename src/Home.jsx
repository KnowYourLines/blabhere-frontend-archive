import React, { useState, useEffect } from "react";
import { auth } from "./firebase.js";
import { signOut, sendEmailVerification } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  ConversationList,
  Conversation,
  Button,
} from "@chatscope/chat-ui-kit-react";
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
  handleOpenCreateChat,
  isAnonymous,
  isVerified,
  setMembers,
  setChatHistory,
  roomWs,
  agreedTerms,
  userWs,
  searchResults,
  setSearchResults,
  activeQuestions,
  searchInput,
  setSearchInput,
  searchResultsError,
  searchResultsErrorText,
  setSearchResultsError,
  setSearchResultsErrorText,
  suggestedQuestions,
  setSuggestedQuestions,
}) {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const [openTerms, setOpenTerms] = useState(false);
  const handleOpenTerms = () => setOpenTerms(true);

  useEffect(() => {
    if (!isVerified) {
      const user = auth.currentUser;
      if (user.email) {
        sendEmailVerification(user, { url: window.location.href })
          .then(() => {
            gtag_report_conversion();
          })
          .catch((error) => {
            console.error(error.message);
          });
      }
      handleOpenModal();
    }
    if (!agreedTerms && isVerified) {
      handleOpenTerms();
    }
  }, [agreedTerms, isVerified]);

  useEffect(() => {
    roomWs.send(
      JSON.stringify({
        command: "find_active_questions",
      })
    );
  }, []);

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
      <ConversationHeader>
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              marginBottom: "1%",
            }}
          >
            <span
              style={{
                fontSize: "24pt",
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
            </span>
            <span
              style={{
                fontSize: "16pt",
              }}
            >
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
            </span>
            <span
              style={{
                fontSize: "24pt",
              }}
            >
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
          </span>
          <OutlinedCard
            cardContent={
              <div>
                <Typography variant="h3" component="div">
                  {"BlabHere"}
                </Typography>
                <SearchInput
                  roomWs={roomWs}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  handleOpenCreateChat={handleOpenCreateChat}
                  searchResultsError={searchResultsError}
                  searchResultsErrorText={searchResultsErrorText}
                  setSearchResultsError={setSearchResultsError}
                  setSearchResultsErrorText={setSearchResultsErrorText}
                  setSearchResults={setSearchResults}
                  suggestedQuestions={suggestedQuestions}
                  setSuggestedQuestions={setSuggestedQuestions}
                  isVerified={isVerified}
                ></SearchInput>
              </div>
            }
          ></OutlinedCard>
        </ConversationHeader.Content>
      </ConversationHeader>

      {searchResults.length > 0 ? (
        <SearchResults
          roomWs={roomWs}
          setMembers={setMembers}
          setChatHistory={setChatHistory}
          setSearchResults={setSearchResults}
          searchResults={searchResults}
        ></SearchResults>
      ) : (
        <ConversationList
          style={{
            height: "50%",
          }}
        >
          <span
            style={{
              color: "black",
              fontSize: "16pt",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {"Active Questions"}
          </span>
          {activeQuestions.map((room, i) => (
            <Conversation
              key={room.id}
              onClick={() => {
                setSearchResultsError(false);
                setSearchResultsErrorText("");
                setSearchInput("");
                setMembers([]);
                setChatHistory([]);
                setSearchResults([]);
                roomWs.send(
                  JSON.stringify({
                    command: "connect",
                    room: room.id,
                  })
                );
              }}
            >
              <Conversation.Content>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "blue",
                    textAlign: "center",
                  }}
                >
                  {room.question}
                </span>
              </Conversation.Content>
            </Conversation>
          ))}
        </ConversationList>
      )}
    </div>
  );
}
