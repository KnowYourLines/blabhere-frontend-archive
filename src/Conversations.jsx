import * as React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
} from "@chatscope/chat-ui-kit-react";
import Moment from "react-moment";

export default function Conversations({ setOpen, conversations }) {
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
            key={convo.room__id}
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
            lastSenderName={convo.latest_message__creator__display_name}
            name={convo.room__display_name}
            info={convo.latest_message__content}
          ></Conversation>
        ))}
      </ConversationList>
    </div>
  );
}
