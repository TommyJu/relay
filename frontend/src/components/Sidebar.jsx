import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import SidebarUser from "./SidebarUser";

const Sidebar = ({ isOpen, onToggle }) => {
  const {
    getSidebarUsers,
    pinnedChatUsers,
    otherChatUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getSidebarUsers();
  }, [getSidebarUsers]);

  const filterOnline = (users) =>
    showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users;

  const filteredPinnedUsers = filterOnline(pinnedChatUsers);
  const filteredOtherUsers = filterOnline(otherChatUsers);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        absolute top-0 left-0 h-full z-30
        bg-base-100 border-r border-base-300
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-72" : "w-16"}
      `}
    >
      {/* Header */}
      <div className="border-b border-base-300 px-2 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Users className="size-6 shrink-0" />
          {isOpen && <span className="font-medium">Contacts</span>}
        </div>

        <button onClick={onToggle} className="btn btn-ghost btn-sm">
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Filters */}
      {isOpen && (
        <div className="p-4 border-b border-base-300">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm whitespace-nowrap">Show online only</span>
          </label>
          <div className="text-xs text-zinc-500 mt-1">
            ({onlineUsers.length - 1} online)
          </div>
        </div>
      )}

      {/* User list */}
      <div className="overflow-y-auto py-2">
        {/* Pinned users */}
        {filteredPinnedUsers.length > 0 && (
          <>
            {isOpen && (
              <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase">
                Pinned
              </div>
            )}

            {filteredPinnedUsers.map((user) => (
              <SidebarUser
                key={user._id}
                user={user}
                isOpen={isOpen}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                onlineUsers={onlineUsers}
              />
            ))}
            {/* Sidebar Divider */}
            <div className="py-2">
              <div className="border-t border-base-300" />
            </div>
          </>
        )}

        {/* Other users */}
        {filteredOtherUsers.length > 0 && (
          <>
            {isOpen && (
              <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase">
                Others
              </div>
            )}

            {filteredOtherUsers.map((user) => (
              <SidebarUser
                key={user._id}
                user={user}
                isOpen={isOpen}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                onlineUsers={onlineUsers}
              />
            ))}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
