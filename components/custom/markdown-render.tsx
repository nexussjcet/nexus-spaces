import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React from "react";
import { Button } from "@/components/ui/button";
import { ProfileEmbed } from "./profile-embed";

const MarkdownRenderer = ({ children }: { children: React.ReactNode }) => {
  const markdownContent = typeof children === 'string'
    ? children
    : React.Children.map(children, child =>
      typeof child === 'string' ? child : ''
    )?.join('') || '';

  return (
    <Markdown
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <div className="relative group md:w-full w-[80vw] overflow-x-auto">
              <div className="flex justify-between items-center w-[80vw] md:w-full bg-neutral-800 px-3 py-1 rounded-t-lg">
                <span className="text-sm text-neutral-400">
                  {match[1]}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="opacity-100 text-black hover:opacity-100 transition-all duration-200"
                  style={{ opacity: 1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                    const button = e.currentTarget;
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                      button.textContent = 'Copy';
                    }, 2000);
                  }}
                >
                  Copy
                </Button>
              </div>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="!mt-0 !rounded-t-none w-[80vw] md:w-full"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              {...rest}
              className={`${className} bg-neutral-800 p-0 rounded text-sm break-words`}
            >
              {children}
            </code>
          );
        },
        pre(props) {
          return (
            <div className="w-full overflow-x-auto">
              {props.children}
            </div>
          );
        },
        div(props) {
          const { children } = props;
          const match = /(?<=<users>)[\s\S]+(?=<\/users>)/.exec(children as string);
          if (match) {
            console.log(match);
            const users = JSON.parse(match[0].trim());
            return (
              <div className="flex flex-row gap-3">
                {users.map((user: any, index: number) => (
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
          return <div className="w-full overflow-x-auto">
            {props.children}
          </div>;
        }
      }}
      className="break-words w-full"
    >
      {markdownContent}
    </Markdown>
  );
};

export default React.memo(MarkdownRenderer);