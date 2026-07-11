import { useEffect, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Image, Send, X } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const TYPING_TIMEOUT_MS = 2800;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const emitTypingStatus = (isTyping) => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
    if (!socket || !selectedUser?._id || !authUser?._id) return;

    socket.emit(isTyping ? "typing" : "stopTyping", {
      receiverId: selectedUser._id,
      senderId: authUser._id,
    });
  };

  const clearTypingIndicator = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    emitTypingStatus(false);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!selectedUser?._id) return;

    if (value.trim()) {
      emitTypingStatus(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStatus(false);
        typingTimeoutRef.current = null;
      }, TYPING_TIMEOUT_MS);
    } else {
      clearTypingIndicator();
    }
  };

  useEffect(() => {
    return () => clearTypingIndicator();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    clearTypingIndicator();

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <div className="w-full border-t border-white/10 bg-[#111022]/95 p-3 backdrop-blur sm:p-4">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 rounded-xl border border-violet-300/20 object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center
              justify-center rounded-full bg-violet-950 text-white"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="input input-bordered input-sm w-full rounded-xl border-white/10 bg-white/10 text-white placeholder:text-violet-200/50 focus:border-violet-400 sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleTextChange}
            onBlur={clearTypingIndicator}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
    className={`btn btn-circle border-white/10 bg-white/10
  ${imagePreview ? "text-emerald-300" : "text-violet-200"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle btn-sm border-0 bg-violet-600 text-white hover:bg-violet-500 sm:btn-md"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
