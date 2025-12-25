import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useState } from "react"


const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Chat always full size */}
      <div className="h-full">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>

      {/* Overlay sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
    </div>
  );
};

export default HomePage;
