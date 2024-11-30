import React, { useEffect, useState } from "react";
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Button,
} from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faComments,
  faCommentMedical,
  faIcons,
  faUserSlash,
  faFlag,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import Linkify from "react-linkify";
import { isMobile } from "react-device-detect";
import Unverified from "./Unverified.jsx";
import AgreeTerms from "./AgreeTerms.jsx";

export default function ChatRoom({
  handleOpenConvos,
  handleOpenSignIn,
  handleOpenYourName,
  handleOpenTopics,
  handleOpenBlock,
  handleOpenReport,
  handleOpenMembers,
  isAnonymous,
  isOnline,
  yourName,
  chatHistory,
  roomWs,
  username,
  isVerified,
  setMembers,
  setChatHistory,
  chatPartner,
  agreedTerms,
  userWs,
  chatPartnerOnline,
  roomName,
}) {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const [openTerms, setOpenTerms] = useState(false);
  const handleOpenTerms = () => setOpenTerms(true);
  useEffect(() => {
    if (!isVerified) {
      handleOpenModal();
    }
  }, [isVerified]);
  useEffect(() => {
    if (!agreedTerms) {
      handleOpenTerms();
    }
  }, [agreedTerms]);
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
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
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
              </span>
              <span
                style={{
                  alignSelf: "center",
                  color: "#6ea9d7",
                  marginTop: "1%",
                  fontSize: "16pt",
                }}
              >
                {roomName}
              </span>
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
                {chatPartner && (
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faCommentMedical}
                        onClick={() => {
                          if (!isVerified) {
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
                )}
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faComments}
                      onClick={handleOpenConvos}
                    />
                  }
                ></Button>
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      onClick={handleOpenMembers}
                    />
                  }
                ></Button>
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faIcons}
                      onClick={handleOpenTopics}
                    />
                  }
                ></Button>
                {chatPartner && (
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faFlag}
                        onClick={handleOpenReport}
                      />
                    }
                  ></Button>
                )}
                {chatPartner && (
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faUserSlash}
                        onClick={handleOpenBlock}
                      />
                    }
                  ></Button>
                )}
              </span>
            </ConversationHeader.Content>
          </ConversationHeader>

          <MessageList
            onYReachStart={() => {
              roomWs.send(
                JSON.stringify({
                  command: "fetch_prev_messages",
                  oldest_message_id: chatHistory[0].id,
                })
              );
            }}
          >
            {chatHistory.map((msg, i) => (
              <Message
                key={msg.id}
                model={{
                  position: "last",
                  direction:
                    username == msg.creator_username ? "outgoing" : "incoming",
                }}
              >
                <Message.CustomContent>
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        target="blank"
                        rel="noopener"
                        href={decoratedHref}
                        key={key}
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {msg.content}
                  </Linkify>
                </Message.CustomContent>
                <Message.Header>
                  <b>{msg.creator_display_name}</b>
                </Message.Header>
                <Message.Footer>
                  <Moment unix fromNow>
                    {msg.created_at}
                  </Moment>
                </Message.Footer>
              </Message>
            ))}
          </MessageList>
          <MessageInput
            style={{ fontSize: "18px" }}
            disabled={!isOnline}
            placeholder="Type message here"
            attachButton={false}
            fancyScroll={false}
            sendOnReturnDisabled={isMobile}
            onSend={(innerHtml, textContent, innerText, nodes) => {
              if (!isVerified) {
                handleOpenModal();
              } else if (!agreedTerms) {
                handleOpenTerms();
              } else {
                roomWs.send(
                  JSON.stringify({
                    command: "send_message",
                    message: innerText,
                  })
                );
              }
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
