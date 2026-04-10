import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import { ArrowLeft } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300 shrink-0 sticky top-0 bg-base-100 z-10">
      <div className="flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">

          {/* 🔥 Mobile Back Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden"
          >
            <ArrowLeft />
          </button>

          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  selectedUser?.profilePic ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt={selectedUser?.name}
              />
            </div>
          </div>

          {/* Name + Status */}
          <div>
            <h3 className="font-medium">{selectedUser?.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatHeader;