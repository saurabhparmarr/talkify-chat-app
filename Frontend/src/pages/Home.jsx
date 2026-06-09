import React from "react";
import useChatStore from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex h-full min-h-0 bg-[#090815] text-violet-50">

      <div className={`${selectedUser ? "hidden" : "block"} h-full w-full md:block md:w-auto`}>
        <Sidebar />
      </div>

      <div className={`${selectedUser ? "flex" : "hidden"} min-w-0 flex-1 flex-col md:flex`}>
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>

    </div>
  );
};

export default Home;
