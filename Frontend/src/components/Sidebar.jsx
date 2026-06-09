import { Users } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useChatStore  from "../store/useChatStore";
import SidebarSkeleton from "./SidebarSkeleton";
import { useEffect } from "react";
import { getPresenceText } from "../lib/utils";

const Sidebar = () => {
  const { selectedUser, setSelectedUser, users, getUsers, isUsersLoading } =
    useChatStore();

  const { onlineUsers, lastSeenByUser } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
<aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#0c0b18] md:w-80">
      <div className="w-full shrink-0 border-b border-white/10 p-4">
        <div className="flex items-center gap-3 text-white">
          <span className="grid size-10 place-items-center rounded-lg bg-violet-500/15 text-violet-200">
            <Users className="size-5" />
          </span>
          <div>
            <p className="text-sm text-violet-200/70">Talkify</p>
            <h2 className="font-semibold">Conversations</h2>
          </div>
        </div>
        
      </div>

      <div className="w-full flex-1 overflow-y-auto p-3">
        {users.map((user) => (
          <button
            onClick={() => setSelectedUser(user)}
            key={user._id}
            className={`
              w-full rounded-xl p-3 flex items-center gap-3 text-left
              hover:bg-white/8 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-violet-500/15 ring-1 ring-violet-400/30"
                  : ""
              }
            `}
          >
            <div className="relative shrink-0">
              <img
                src={
                  user.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 rounded-full
                  bg-emerald-400 ring-2 ring-[#0c0b18]"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-white">{user.name}</div>
              <div className={`truncate text-sm ${
                onlineUsers.includes(user._id) ? "text-emerald-300" : "text-violet-200/60"
              }`}>
                {getPresenceText(user, onlineUsers, lastSeenByUser)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
