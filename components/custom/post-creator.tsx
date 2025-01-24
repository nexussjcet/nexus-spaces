"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Youtube } from "lucide-react";

const EditorJS = dynamic(() => import("@editorjs/editorjs"), { ssr: false });
const Header = dynamic(() => import("@editorjs/header"), { ssr: false });
const List = dynamic(() => import("@editorjs/list"), { ssr: false });
const Image = dynamic(() => import("@editorjs/image"), { ssr: false });

interface Media {
  type: "image" | "youtube";
  url: string;
}

interface Post {
  content?: any;
  media?: Media[];
}

const PostCreator = () => {
  const [post, setPost] = useState<Post>({});
  const [youtubeInput, setYoutubeInput] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const editorRef = useRef<any | null>(null);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    if (!isClientSide) return;

    const initEditor = async () => {
      const EditorJSModule = await import("@editorjs/editorjs");
      const HeaderModule = await import("@editorjs/header");
      const ListModule = await import("@editorjs/list");
      const ImageModule = await import("@editorjs/image");

      const editor = new EditorJSModule.default({
        holder: "editorjs",
        placeholder: "Write your content here...",
        minHeight: 400,
        tools: {
          header: {
            class: HeaderModule.default,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3],
              defaultLevel: 2,
            },
          },
          list: {
            class: ListModule.default,
            config: {
              defaultStyle: "unordered",
            },
          },
          image: {
            class: ImageModule.default,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  if (file && file.size > 0) {
                    const newMedia: Media = {
                      type: "image",
                      url: URL.createObjectURL(file),
                    };
                    setPost((prev) => ({
                      ...prev,
                      media: [...(prev.media || []), newMedia],
                    }));
                    return { success: 1, file: { url: newMedia.url } };
                  }
                  return { success: 0 };
                },
              },
            },
          },
        },
      });

      const style = document.createElement("style");
      style.textContent = `
        #editorjs {
          height: 400px;
          overflow-y: auto;
        }
        #editorjs .ce-block__content {
          max-width: 100% !important;
        }
        .codex-editor__redactor {
          overflow-y: visible !important;
          max-height: none !important;
        }
        .ce-header {
          font-weight: bold !important;
        }
        .ce-header--h1 {
          font-size: 2.5rem !important;
          line-height: 1.2 !important;
        }
        .ce-header--h2 {
          font-size: 2rem !important;
          line-height: 1.3 !important;
        }
        .ce-header--h3 {
          font-size: 1.5rem !important;
          line-height: 1.4 !important;
        }
      `;
      document.head.appendChild(style);

      editorRef.current = editor;

      return () => {
        document.head.removeChild(style);
      };
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.isReady
          .then(() => {
            editorRef.current?.destroy();
            editorRef.current = null;
          })
          .catch((e: any) => console.error("ERROR editor cleanup", e));
      }
    };
  }, [isClientSide]);

  const handleYoutubeAdd = () => {
    if (!youtubeInput) return;
    const newMedia: Media = { type: "youtube", url: youtubeInput };
    setPost((prev) => ({
      ...prev,
      media: [...(prev.media || []), newMedia],
    }));
    setYoutubeInput("");
    setShowYoutubeInput(false);
  };

  const removeMedia = (index: number) => {
    setPost((prev) => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();

        if (
          (!savedData.blocks || savedData.blocks.length === 0) &&
          (!post.media || post.media.length === 0)
        ) {
          alert("Please add some content to your post");
          return;
        }

        const finalPost = {
          ...post,
          content: savedData,
        };

        console.log("Creating post:", finalPost);
      } catch (error) {
        console.error("Save failed", error);
      }
    }
  };

  if (!isClientSide) return null;

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-4">
      <div
        id="editorjs"
        className="border rounded-lg p-4 h-[400px] overflow-y-auto"
      />

      <div className="flex gap-2">
        {showYoutubeInput ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="Paste YouTube URL"
              className="flex-1 px-3 py-2 border border-neutral-300 bg-transparent"
            />
            <Button onClick={handleYoutubeAdd}>Add</Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowYoutubeInput(true)}
            variant="ghost"
            className="text-neutral-500 hover:text-neutral-700"
          >
            <Youtube className="mr-2" />
            Add YouTube Video
          </Button>
        )}
      </div>

      {post.media && post.media.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {post.media.map((media, index) => (
            <Card key={index} className="relative p-2">
              {media.type === "image" && (
                <img
                  src={media.url}
                  alt=""
                  className="w-full h-40 object-cover rounded"
                />
              )}
              {media.type === "youtube" && (
                <iframe
                  src={`https://www.youtube.com/embed/${media.url.split("v=")[1]}`}
                  className="w-full h-40"
                  allowFullScreen
                />
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeMedia(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Button onClick={handleSubmit} className="mt-4">
        Create Post
      </Button>
    </div>
  );
};

export default PostCreator;
