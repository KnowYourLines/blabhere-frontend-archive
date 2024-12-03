import React, { useState } from "react";
import { auth } from "./firebase.js";
import { signOut, sendEmailVerification } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader, Button } from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faCommentMedical,
  faIcons,
  faUserXmark,
} from "@fortawesome/free-solid-svg-icons";
import Unverified from "./Unverified.jsx";
import OutlinedCard from "./OutlinedCard.jsx";
import AgreeTerms from "./AgreeTerms.jsx";

export default function Home({
  handleOpenConvos,
  handleOpenSignIn,
  handleOpenTopics,
  handleOpenDelete,
  isAnonymous,
  isVerified,
  setMembers,
  setChatHistory,
  roomWs,
  agreedTerms,
  userWs,
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
          <OutlinedCard
            text={"BlabHere - Find people you like to chat to"}
          ></OutlinedCard>
          <span
            style={{
              alignSelf: "center",
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
              alignSelf: "center",
              fontSize: "24pt",
            }}
          >
            <Button
              icon={
                <FontAwesomeIcon
                  icon={faCommentMedical}
                  onClick={() => {
                    if (!isVerified) {
                      const user = auth.currentUser;
                      sendEmailVerification(user, { url: window.location.href })
                        .then(() => {
                          setSent(true);
                          gtag_report_conversion();
                        })
                        .catch((error) => {
                          console.error(error.message);
                        });
                      handleOpenModal();
                    } else if (!agreedTerms) {
                      handleOpenTerms();
                    } else {
                      setMembers([]);
                      setChatHistory([]);
                      roomWs.send(
                        JSON.stringify({
                          command: "connect",
                        })
                      );
                    }
                  }}
                />
              }
            ></Button>
            <Button
              icon={
                <FontAwesomeIcon icon={faComments} onClick={handleOpenConvos} />
              }
            ></Button>
            <Button
              icon={
                <FontAwesomeIcon icon={faIcons} onClick={handleOpenTopics} />
              }
            ></Button>
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
            text={
              "Set your favourite topics. Get put in small groups with those who chat lots with those you chat lots with and have shared interests."
            }
          ></OutlinedCard>
        </ConversationHeader.Content>
      </ConversationHeader>
    </div>
  );
}
