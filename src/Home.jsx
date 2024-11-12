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
            BlabHere
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
    </div>
  );
}
