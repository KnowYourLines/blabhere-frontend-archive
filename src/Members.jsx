import * as React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
} from "@chatscope/chat-ui-kit-react";

export default function Members({ setOpen, members }) {
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
            Chat Members
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <ConversationList
        style={{
          height: "100%",
        }}
      >
        {members.map((elt, i) => (
          <Conversation name={elt} key={i}></Conversation>
        ))}
      </ConversationList>
    </div>
  );
}
