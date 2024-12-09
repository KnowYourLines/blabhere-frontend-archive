import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
} from "@chatscope/chat-ui-kit-react";

export default function MemberTopics({ setOpen, topics }) {
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
            {"Member's Favourite Topics"}
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <ConversationList
        style={{
          height: "85%",
        }}
      >
        {topics.map((topic, i) => (
          <Conversation name={topic} key={i}></Conversation>
        ))}
      </ConversationList>
    </div>
  );
}
