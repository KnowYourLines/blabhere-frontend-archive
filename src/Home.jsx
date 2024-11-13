import React, { useState } from "react";
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationHeader, Button } from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faCommentMedical,
} from "@fortawesome/free-solid-svg-icons";
import Unverified from "./Unverified.jsx";
import OutlinedCard from "./OutlinedCard.jsx";

export default function Home({
  handleOpenConvos,
  handleOpenSignIn,
  isAnonymous,
  isVerified,
  setMembers,
  setChatHistory,
  roomWs,
}) {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
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
          <OutlinedCard text={"BlabHere"}></OutlinedCard>
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
                <FontAwesomeIcon icon={faComments} onClick={handleOpenConvos} />
              }
            ></Button>
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
                      handleOpenModal();
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
          </span>
          <OutlinedCard
            text={
              "Start 1-on-1 chats with others who chat a lot with people you chat a lot with"
            }
          ></OutlinedCard>
        </ConversationHeader.Content>
      </ConversationHeader>
    </div>
  );
}
