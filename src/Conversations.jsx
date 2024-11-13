import * as React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
  Button,
} from "@chatscope/chat-ui-kit-react";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Conversations({
  setOpen,
  conversations,
  setMembers,
  setChatHistory,
  roomWs,
  userWs,
  currentRoom,
}) {
  const handleClose = () => setOpen(false);

  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Back
          key="1"
          onClick={() => {
            if (currentRoom) {
              setMembers([]);
              setChatHistory([]);
              roomWs.send(
                JSON.stringify({
                  command: "connect",
                  room: currentRoom,
                })
              );
            }
            handleClose();
          }}
        />
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              color: "black",
              fontSize: "16pt",
            }}
          >
            Your Chats
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <ConversationList
        style={{
          height: "85%",
        }}
      >
        {conversations.map((convo, i) => (
          <Conversation
            unreadDot={!convo.read}
            lastActivityTime={
              <span
                style={{
                  marginRight: "1em",
                }}
              >
                <Moment unix fromNow>
                  {convo.latest_message__created_at || convo.created_at}
                </Moment>
              </span>
            }
            key={convo.room__id}
          >
            <Conversation.Content
              lastSenderName={convo.latest_message__creator__display_name}
              name={
                convo.other_members[0]
                  ? convo.other_members[0]
                  : "Waiting for chat partner..."
              }
              info={convo.latest_message__content}
              onClick={() => {
                const newRoom = convo.room__id;
                setMembers([]);
                setChatHistory([]);
                roomWs.send(
                  JSON.stringify({
                    command: "connect",
                    room: newRoom,
                  })
                );
                handleClose();
              }}
            />
            <Conversation.Operations visible>
              <Button
                style={{
                  color: "red",
                }}
                icon={
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => {
                      userWs.send(
                        JSON.stringify({
                          command: "exit_room",
                          room_id: convo.room__id,
                        })
                      );
                      if (currentRoom == convo.room__id) {
                        setMembers([]);
                        setChatHistory([]);
                      }
                    }}
                  />
                }
              ></Button>
            </Conversation.Operations>
          </Conversation>
        ))}
      </ConversationList>
    </div>
  );
}
