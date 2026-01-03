import { useChatStore } from "../store/chat/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/auth/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import NoMessages from "./NoMessages";
import { Loader } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    isMessagesLoading,
    selectedUser,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-full w-full flex flex-col">
      <ChatHeader />
      {(messages.length === 0 && !isMessagesLoading) ? (
        <NoMessages />
      ) : (
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat min-w-0 ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble wrap-anywhere whitespace-pre-wrap">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="rounded-md mb-2 w-full max-w-[90vw] sm:max-w-[200px]"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {isMessagesLoading && (
        <div className="flex justify-center py-2">
          <Loader className="size-6 animate-spin opacity-50" />
        </div>
      )}

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
