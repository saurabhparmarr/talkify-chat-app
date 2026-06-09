import { MessageSquare } from "lucide-react";
const NoChatSelected = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_35%),#111022] p-8 text-violet-50 sm:p-16">
      <div className="max-w-md text-center space-y-6">
        
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-violet-500/15"
            >
              <MessageSquare className="h-8 w-8 text-violet-300" />
            </div>
          </div>
        </div>

       
        <h2 className="text-2xl font-bold">Welcome to Talkify</h2>
        <p className="text-violet-200/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};
export default NoChatSelected;
