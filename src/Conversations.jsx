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
  setRoom,
  setIsRoomFull,
  setIsRoomCreator,
  setMemberLimit,
  setRoomName,
  setMembers,
  setChatHistory,
  ws,
}) {
  const handleClose = () => setOpen(false);

  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <ConversationHeader>
        <ConversationHeader.Back key="1" onClick={handleClose} />
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              color: "black",
              fontSize: "16pt",
            }}
          >
            Chats
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <ConversationList
        style={{
          height: "100%",
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
              name={convo.room__display_name}
              info={convo.latest_message__content}
              onClick={() => {
                const newRoom = convo.room__id;
                const url = new URL(window.location.href.split("?")[0]);
                url.searchParams.set("room", newRoom);
                window.history.replaceState("", "", url);
                const newUrlParams = new URLSearchParams(
                  window.location.search
                );
                setRoom(newUrlParams.get("room"));
                setIsRoomFull(false);
                setIsRoomCreator(false);
                setMemberLimit(null);
                setRoomName("");
                setMembers([]);
                setChatHistory([]);
                ws.send(
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
                      console.log("hello world");
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
