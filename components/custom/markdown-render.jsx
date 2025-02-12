import React, { useState } from "react";
import Markdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { funky } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ProfileEmbed } from "@/components/custom/profile-embed";

const MarkdownRenderer = ({ content }) => {
  const Pre = ({ children }) => {
    const [CopyIcon, setCopyIcon] = useState(Copy);

    const handleClick = () => {
      navigator.clipboard.writeText(children.props.children);
      setCopyIcon(Check);
      setTimeout(() => {
        setCopyIcon(Copy);
      }, 2000);
    }

    const match = /language-(\w+)/.exec(children.props.className || "");
    const language = match ? match[1].toUpperCase() : "TEXT";
    return (
      <pre className="bg-black rounded-lg border border-white my-5 max-w-2xl w-[80vw] md:w-[43vw] min-[790px]:w-[45vw] min-[864px]:w-[50vw] min-[980px]:w-[55vw]">
        <div className="flex justify-between items-center p-2 bg-white text-black text-sm font-mono rounded-t-md">
          <span className="font-bold text-black">{language}</span>
          <div
            className="bg-white cursor-pointer transition-transform transform hover:scale-110"
            title="Copy Code"
            onClick={handleClick}
          >
            {<CopyIcon className="h-4 w-4" />}
          </div>
        </div>
        <div className="font-mono text-sm px-2 mb-[-6px]">{children}</div>
      </pre>
    );
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: Pre,
        code({ node, inline, className = "code", children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <SyntaxHighlighter
              style={funky}
              language={match[1]}
              PreTag="div"
              className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        div(props) {
          const { children } = props;
          const match = /(?<=<users>)[\s\S]+(?=<\/users>)/.exec(children);
          if (match) {
            const users = JSON.parse(match[0].trim());
            return (
              <div className="flex flex-row gap-3">
                {users.map((user, index) => (
                  <ProfileEmbed
                    key={index}
                    imageUrl={user.image}
                    name={user.name}
                    email={user.email}
                    bio={user.bio}
                  />
                ))}
              </div>
            );
          }
          return (
            <div className="w-full overflow">
              {props.children}
            </div>
          );
        }
      }}
      className="break-words w-full"
    >
      {content}
    </Markdown>
  );
};

export default React.memo(MarkdownRenderer);