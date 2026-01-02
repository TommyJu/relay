import { useChatStore } from "../store/useChatStore";

const SidebarUser = ({
  user,
  isSidebarOpen,
  selectedUser,
  setSelectedUser,
  onlineUsers,
  setIsSidebarOpen,
}) => {
  const isOnline = onlineUsers.includes(user._id);
  const isSelected = selectedUser?._id === user._id;
  const { unreadConversations } = useChatStore();
  let isMessageFromSidebarUserUnread = user._id in unreadConversations;

  return (
    <button
      onClick={() => {
        setSelectedUser(user);
        setIsSidebarOpen(false);
      }}
      className={`
        w-full p-2 flex items-center gap-3
        hover:bg-base-300 transition-colors
        ${isSelected ? "bg-base-300" : ""}
      `}
    >
      <div className={`relative`}>
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.fullName}
          className={`
            size-12 object-cover rounded-full
            ${isMessageFromSidebarUserUnread ? "border-4 border-accent" : ""}
          `}
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
        )}
      </div>

      {isSidebarOpen && (
        <div className="text-left min-w-0">
          <div className="font-medium truncate">{user.fullName}</div>
          <div className="text-sm text-zinc-400">
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>
      )}
    </button>
  );
};

export default SidebarUser;
