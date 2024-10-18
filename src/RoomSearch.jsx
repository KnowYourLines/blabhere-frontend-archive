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

export default function RoomSearch({
  setOpen,
  rooms,
  setRoom,
  setIsRoomFull,
  setIsRoomCreator,
  setMemberLimit,
  setRoomName,
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
        <ConversationHeader.Back key="1" onClick={handleClose} />
        <ConversationHeader.Content>
          <span
            style={{
              alignSelf: "center",
              color: "black",
              fontSize: "16pt",
            }}
          >
            Search Chats
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <ConversationList
        style={{
          height: "100%",
        }}
      >
        {rooms.map((room, i) => (
          <Conversation
            lastActivityTime={
              <span
                style={{
                  marginRight: "1em",
                }}
              >
                <Moment unix fromNow>
                  {room.latest_message__created_at || room.created_at}
                </Moment>
              </span>
            }
            key={room.id}
          >
            <Conversation.Content
              name={room.display_name}
              info={room.latest_message__content}
              onClick={() => {
                const newRoom = room.id;
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
                          room_id: room.id,
                        })
                      );
                      if (currentRoom == room.id) {
                        setIsRoomFull(false);
                        setIsRoomCreator(false);
                        setMemberLimit(null);
                        setRoomName("");
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
