import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";


const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* padding left added to make space for the sidebar*/}
      <div className="h-full pl-16">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>

      {/* Overlay sidebar */}
      <Sidebar/>
    </div>
  );
};

export default HomePage;
