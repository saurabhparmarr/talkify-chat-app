import React from "react";
import useChatStore from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex h-full bg-base-200">

      {/* Sidebar */}
      <div className={`${selectedUser ? "hidden" : "block"} md:block`}>
        <Sidebar />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>

    </div>
  );
};

export default Home;