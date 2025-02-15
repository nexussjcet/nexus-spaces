"use client";
import { useChatContext } from "@/contexts/chat";
import { Send, File, CircleStop } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput() {
  const {
    textareaRef,
    message,
    setMessage,
    files,
    setFiles,
    streaming,
    setStreaming,
    abortControllerRef,
    stopControllerRef,
    handleKeyDown,
    handleSubmit,
  } = useChatContext();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.focus();
    }
  }, [message]);

  useEffect(() => {
    if (window.innerWidth >= 768) textareaRef.current?.focus();
  }, []);

  return (
    <div
      className="flex flex-col w-full h-fit gap-2 border-t-2 border-neutral-800 p-4 bg-neutral-950"
    >
      <div className="flex flex-row items-center gap-2">
        <Textarea
          ref={textareaRef}
          name="prompt"
          placeholder="Ask me anything..."
          className="flex-1 max-h-[200px] resize-none border border-neutral-700 rounded-xl focus:border-neutral-500 transition-colors scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={streaming}
          rows={1}
        />
        <div className="flex flex-col items-end justify-end h-full py-3">
          {!streaming ? (
            <Button
              className="w-fit flex gap-2 rounded-md"
              title="Send"
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />

            </Button>
          ) : (
            <Button
              className="w-fit flex gap-2 rounded-md"
              title="Stop"
              onClick={() => {
                abortControllerRef.current?.abort();
                stopControllerRef.current?.abort();
                toast.error("Stopped streaming");
                setStreaming(false);
              }}
            >
              <CircleStop className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer hover:text-neutral-300 mx-2 my-1">
          <File className="h-4 w-4" />
          {files.length > 0 ? `${files.length} files selected` : 'Attach files'}
        </label>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={(e) => setFiles(e.target?.files ? Array.from(e.target.files) : [])}
          multiple
        />
      </div>
    </div >
  );
}