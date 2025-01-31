import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Conversation, ConversationList } from "@chatscope/chat-ui-kit-react";
import Moment from "react-moment";
export default function SearchResults({
  searchResults,
  setMembers,
  setChatHistory,
  roomWs,
}) {
  return (
    <ConversationList
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {searchResults.map((room, i) => (
        <Conversation
          lastActivityTime={
            <span
              style={{
                marginRight: "1em",
              }}
            >
              <Moment unix fromNow>
                {room.latest_message_timestamp || room.created_at}
              </Moment>
            </span>
          }
          key={room.pk}
        >
          <Conversation.Content
            name={room.display_name}
            onClick={() => {
              setMembers([]);
              setChatHistory([]);
              roomWs.send(
                JSON.stringify({
                  command: "connect",
                  room: room.pk,
                })
              );
            }}
          />
        </Conversation>
      ))}
    </ConversationList>
  );
}
