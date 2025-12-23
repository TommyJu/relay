import toast from "react-hot-toast";


export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const handleApiError = (error, defaultMsg = "Something went wrong") => {
  const msg = error?.response?.data?.message || defaultMsg;
  toast.error(msg);
};
