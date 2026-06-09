import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import { ArrowLeft } from "lucide-react";
import { getPresenceText } from "../lib/utils";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, lastSeenByUser } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-white/10 bg-[#111022]/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle btn-sm text-violet-100 md:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div className="avatar relative">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  selectedUser?.profilePic ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt={selectedUser?.name}
                className="object-cover"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#111022] bg-emerald-400" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">{selectedUser?.name}</h3>
            <p className={`text-sm ${isOnline ? "text-emerald-300" : "text-violet-200/70"}`}>
              {getPresenceText(selectedUser, onlineUsers, lastSeenByUser)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatHeader;
