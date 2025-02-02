import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

const ThinkingProcess = ({ 
  duration,
  summary,
  thoughts,
}: { 
  duration: string;
  summary: string;
  thoughts: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-[700px] mb-4">
      <div 
        className="bg-neutral-800 rounded-lg p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">
            Reasoning (thought for {duration})
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-neutral-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          )}
        </div>
        {!isOpen && (
          <p className="mt-2 text-neutral-200">
            {summary}
          </p>
        )}
      </div>
      {isOpen && (
        <div className="mt-2 bg-neutral-900 rounded-lg p-4">
          <p className="text-neutral-300 whitespace-pre-line">
            {thoughts}
          </p>
          <p className="mt-4 text-neutral-200">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ThinkingProcess;