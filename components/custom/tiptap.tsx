"use client";

import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./toolbar";

export default function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside pl-5",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside pl-5",
          },
        },
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "tiptap rounded-b-md border min-h-[150px] border-input bg-transparent p-2 text-white",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col gap-0 border border-gray-300 rounded-md">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
