"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import React from "react";

export default function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL", previousUrl || "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run(); // Remove the link if the input is empty
      return;
    }

    // If no text is selected, insert a new linked text
    if (!editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank">${url}</a>`)
        .run();
    }
  };

  return (
    <div className="w-full bg-white text-black shadow-md rounded-t-md p-2 border-b border-gray-200 flex gap-2">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
      >
        <Bold size={18} className="text-black" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
      >
        <Italic size={18} className="text-black" />
      </button>

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""}`}
      >
        <Heading1 size={18} className="text-black" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}`}
      >
        <Heading2 size={18} className="text-black" />
      </button>

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
      >
        <List size={18} className="text-black" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
      >
        <ListOrdered size={18} className="text-black" />
      </button>

      {/* Link */}
      <button onClick={addLink} className="p-2 rounded-lg hover:bg-gray-200">
        <Link size={18} className="text-black" />
      </button>

      {/* Image */}
      <button onClick={addImage} className="p-2 rounded-lg hover:bg-gray-200">
        <Image size={18} className="text-black" />
      </button>

      {/* Quote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-300" : ""}`}
      >
        <Quote size={18} className="text-black" />
      </button>

      {/* Code Block */}
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-lg hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-300" : ""}`}
      >
        <Code size={18} className="text-black" />
      </button>
    </div>
  );
}
