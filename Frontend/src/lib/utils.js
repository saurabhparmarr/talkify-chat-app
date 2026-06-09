export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatLastSeen(date) {
  if (!date) return "Last seen unavailable";

  const lastSeen = new Date(date);
  if (Number.isNaN(lastSeen.getTime())) return "Last seen unavailable";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  if (lastSeen >= startOfToday) {
    return `Last seen today at ${lastSeen.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  if (lastSeen >= startOfYesterday) {
    return "Last seen yesterday";
  }

  return `Last seen on ${lastSeen.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })}`;
}

export function getPresenceText(user, onlineUsers, lastSeenByUser = {}) {
  if (!user?._id) return "";
  return onlineUsers.includes(user._id)
    ? "Online"
    : formatLastSeen(lastSeenByUser[user._id] || user.lastSeen);
}
