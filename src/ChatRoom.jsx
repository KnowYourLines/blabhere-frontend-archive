import React, { useState } from "react";
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
  faUserGroup,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import { isMobile } from "react-device-detect";
import nlp from "compromise";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

export default function ChatRoom({
  handleOpenConvos,
  handleOpenYourName,
  handleOpenMembers,
  isOnline,
  yourName,
  chatHistory,
  roomWs,
  username,
  roomName,
  setRoom,
  setSearchResults,
}) {
  const [msgError, setMsgError] = useState(false);
  const [msgErrorText, setMsgErrorText] = useState("");

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content>
              <span
                style={{
                  alignSelf: "center",
                  textAlign: "center",
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
                  fontSize: "18pt",
                }}
              >
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faHome}
                      onClick={() => {
                        setRoom("");
                        setSearchResults([]);
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
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      onClick={handleOpenMembers}
                    />
                  }
                ></Button>
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
                  message: msg.content,
                  position: "last",
                  direction:
                    username == msg.creator_username ? "outgoing" : "incoming",
                }}
              >
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
            style={{
              fontSize: "18px",
              backgroundColor: msgError ? "red" : null,
            }}
            disabled={!isOnline}
            placeholder={msgError ? msgErrorText : "Type message here"}
            attachButton={false}
            fancyScroll={false}
            sendOnReturnDisabled={isMobile}
            onSend={(innerHtml, textContent, innerText, nodes) => {
              const containsSingleQuestion =
                nlp(innerText).questions().data().length === 1 &&
                nlp(innerText).length === 1;
              if (!containsSingleQuestion) {
                setMsgError(true);
                setMsgErrorText("Message must be a single question");
              } else if (matcher.hasMatch(searchInput)) {
                setMsgError(true);
                setMsgErrorText("Questions cannot contain profanities");
              } else {
                setMsgError(false);
                setMsgErrorText("");
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
