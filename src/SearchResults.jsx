import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Conversation, ConversationList } from "@chatscope/chat-ui-kit-react";
import Moment from "react-moment";
export default function SearchResults({
  searchResults,
  setMembers,
  setChatHistory,
  roomWs,
  setSearchResults,
}) {
  return (
    <ConversationList
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "black",
          fontSize: "16pt",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {"Chats Found"}
      </span>
      {searchResults.map((room, i) => (
        <Conversation
          lastActivityTime={
            <span
              style={{
                marginRight: "1em",
              }}
            >
              <span>
                {room.latest_message_timestamp ? "Active " : "Created "}
              </span>
              <Moment unix fromNow>
                {room.latest_message_timestamp || room.created_at}
              </Moment>
            </span>
          }
          key={room.pk}
          onClick={() => {
            setMembers([]);
            setChatHistory([]);
            setSearchResults([]);
            roomWs.send(
              JSON.stringify({
                command: "connect",
                room: room.pk,
              })
            );
          }}
        >
          <Conversation.Content>
            <span
              style={{
                color: "blue",
              }}
            >
              {room.display_name}
            </span>
          </Conversation.Content>
        </Conversation>
      ))}
    </ConversationList>
  );
}
