import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Conversation, ConversationList } from "@chatscope/chat-ui-kit-react";
import Moment from "react-moment";

export default function SearchResults({
  roomSearchResults,
  setRoom,
  setIsRoomFull,
  setIsRoomCreator,
  setMemberLimit,
  setRoomName,
  setMembers,
  setChatHistory,
  setRoomSearchResults,
  roomWs,
  handleClose = null,
  nameQuery,
  sizeQuery,
}) {
  return (
    <ConversationList
      style={{
        height: "65%",
      }}
      onYReachEnd={() => {
        roomWs.send(
          JSON.stringify({
            command: "fetch_next_room_search_results",
            name: nameQuery,
            max_size: sizeQuery,
          })
        );
      }}
    >
      {roomSearchResults.map((room, i) => (
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
          key={room.id}
        >
          <Conversation.Content
            name={room.display_name}
            info={
              room.max_num_members
                ? `Capacity: ${room.num_members}/${room.max_num_members}`
                : `Number of members: ${room.num_members}`
            }
            onClick={() => {
              const newRoom = room.id;
              const url = new URL(window.location.href.split("?")[0]);
              url.searchParams.set("room", newRoom);
              window.history.replaceState("", "", url);
              const newUrlParams = new URLSearchParams(window.location.search);
              setRoom(newUrlParams.get("room"));
              setIsRoomFull(false);
              setIsRoomCreator(false);
              setMemberLimit(null);
              setRoomName("");
              setMembers([]);
              setChatHistory([]);
              setRoomSearchResults((roomSearchResults) =>
                roomSearchResults.filter((result) => result.id !== room.id)
              );
              roomWs.send(
                JSON.stringify({
                  command: "connect",
                  room: newRoom,
                })
              );
              if (handleClose) {
                handleClose();
              }
            }}
          />
        </Conversation>
      ))}
    </ConversationList>
  );
}
