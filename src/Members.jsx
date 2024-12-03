import * as React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  Conversation,
  ConversationList,
  Button,
} from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faUserSlash } from "@fortawesome/free-solid-svg-icons";
export default function Members({
  setOpen,
  members,
  handleOpenReport,
  handleOpenBlock,
  setReportedUser,
  setBlockedUser,
  username,
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
            Chat Members
          </span>
        </ConversationHeader.Content>
      </ConversationHeader>
      <ConversationList
        style={{
          height: "85%",
        }}
      >
        {members.map((member, i) => (
          <Conversation name={member.name} key={i}>
            <Conversation.Operations visible>
              {member.is_online ? (
                <Button
                  style={{
                    color: "limegreen",
                  }}
                >
                  Online
                </Button>
              ) : (
                <Button
                  style={{
                    color: "red",
                  }}
                >
                  Offline
                </Button>
              )}
              {username != member.username && (
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faFlag}
                      onClick={() => {
                        handleOpenReport();
                        setReportedUser(member);
                      }}
                    />
                  }
                ></Button>
              )}
              {username != member.username && (
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faUserSlash}
                      onClick={() => {
                        handleOpenBlock();
                        setBlockedUser(member);
                      }}
                    />
                  }
                ></Button>
              )}
            </Conversation.Operations>
          </Conversation>
        ))}
      </ConversationList>
    </div>
  );
}
