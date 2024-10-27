import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  Button,
} from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faComments,
  faCommentMedical,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import OutlinedCard from "./OutlinedCard.jsx";
import Unverified from "./Unverified.jsx";

export default function ChatDoesNotExist({
  handleOpenConvos,
  handleOpenSignIn,
  handleOpenYourName,
  handleOpenRoomSearch,
  isAnonymous,
  yourName,
  isVerified,
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
      <MainContainer>
        <ChatContainer>
          <ConversationHeader
            style={{ position: "fixed", height: "100%", width: "100%" }}
          >
            <ConversationHeader.Content>
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
              </span>{" "}
              <span
                style={{
                  alignSelf: "center",
                  color: "black",
                  fontSize: "16pt",
                }}
              >
                <Button
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  onClick={handleOpenYourName}
                >
                  Your Name: {yourName}
                </Button>{" "}
              </span>
              <span
                style={{
                  alignSelf: "center",
                  fontSize: "16pt",
                }}
              >
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={handleOpenRoomSearch}
                    />
                  }
                ></Button>
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faCommentMedical}
                      onClick={() => {
                        if (!isVerified) {
                          handleOpenModal();
                        } else {
                          const newRoom = uuidv4();
                          const url = new URL(
                            window.location.href.split("?")[0]
                          );
                          url.searchParams.set("room", newRoom);
                          window.open(url, "_blank");
                        }
                      }}
                    />
                  }
                ></Button>
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faComments}
                      onClick={handleOpenConvos}
                    />
                  }
                ></Button>
              </span>
              <OutlinedCard text={"This room does not exist."}></OutlinedCard>
            </ConversationHeader.Content>
          </ConversationHeader>
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
