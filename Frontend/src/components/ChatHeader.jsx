import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import { ArrowLeft } from "lucide-react";
import { formatLastSeen } from "../lib/utils";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, presenceMap } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);
  const presence = presenceMap[selectedUser?._id];
  const statusText = isOnline
    ? "Online"
    : presence?.lastSeen
      ? `Last seen ${formatLastSeen(presence.lastSeen)}`
      : selectedUser?.lastSeen
        ? `Last seen ${formatLastSeen(selectedUser.lastSeen)}`
        : "Offline";

  return (
    <div className="p-2.5 border-b border-base-300 shrink-0 sticky top-0 bg-base-100 z-10">
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden"
          >
            <ArrowLeft />
          </button>

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

          <div>
            <h3 className="font-medium">{selectedUser?.name}</h3>
            <p className="text-sm text-base-content/70">{statusText}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatHeader;