import { Users } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useChatStore  from "../store/useChatStore";
import SidebarSkeleton from "./SidebarSkeleton";
import { useEffect } from "react";

const Sidebar = () => {
  const { selectedUser, setSelectedUser, users, getUsers, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col sticky top-0">
      <div className="border-b border-base-300 w-full p-5 shrink-0">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
        </div>
        
      </div>

      <div className="flex-1 overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            onClick={() => setSelectedUser(user)}
            key={user._id}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
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
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;