import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useEffect } from "react";



const HomePage = () => {
  const { selectedUser } = useChatStore();

      const {
        subscribeToMessages,
        unsubscribeFromMessages,
      } = useChatStore();
    useEffect(() => {
      subscribeToMessages();
  
      return () => unsubscribeFromMessages();
    }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className=" h-full w-full">
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
