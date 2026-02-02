import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  return (
    <div className="chatLayout">
      <ConversationList />
      <ChatWindow />
    </div>
  );
};

export default ChatLayout;
