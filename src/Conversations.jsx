import * as React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
} from "@chatscope/chat-ui-kit-react";

export default function Conversations({ setOpen }) {
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
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Lilly"
          name="Other group"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Joe"
          name="Joe"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Emily"
          name="Emily"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Kai"
          name="Kai"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Akane"
          name="Akane"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Eliot"
          name="Eliot"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Zoe"
          name="Zoe"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Patrik"
          name="Patrik"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Joe"
          name="Joe"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Emily"
          name="Emily"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Kai"
          name="Kai"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Akane"
          name="Akane"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Eliot"
          name="Eliot"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Zoe"
          name="Zoe"
        ></Conversation>
        <Conversation
          info="Yes i can do it for you"
          lastSenderName="Patrik"
          name="Patrik"
        ></Conversation>
      </ConversationList>
    </div>
  );
}
