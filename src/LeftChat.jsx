import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  Button,
} from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

import OutlinedCard from "./OutlinedCard.jsx";

export default function LeftChat({ roomWs, setLeftRoom, room }) {
  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader
            style={{ position: "fixed", height: "100%", width: "100%" }}
          >
            <ConversationHeader.Content>
              <span
                style={{
                  alignSelf: "center",
                  fontSize: "16pt",
                }}
              >
                <Button
                  icon={<FontAwesomeIcon icon={faRotateRight} />}
                  onClick={() => {
                    roomWs.send(
                      JSON.stringify({
                        command: "connect",
                        room: room,
                      })
                    );
                    setLeftRoom(false);
                  }}
                >
                  Rejoin
                </Button>
              </span>
              <OutlinedCard text={"You have left this room."}></OutlinedCard>
            </ConversationHeader.Content>
          </ConversationHeader>
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
