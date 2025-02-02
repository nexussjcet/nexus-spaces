"use client"
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2 } from 'lucide-react';

interface TopLanguagesSectionProps {
  topLanguages?: string[];
}

export const TopLanguagesSection: React.FC<TopLanguagesSectionProps> = ({ 
  topLanguages = [] 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getRandomDelay = (index: number): string => {
    return `${(index + 1) * 150}ms`;
  };

  return (
    <Card className="w-full bg-black hover:bg-neutral-900 border-zinc-800 shadow-lg relative overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-zinc-400" />
          <CardTitle className="text-2xl font-bold text-zinc-100">
            Top Languages Used
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {topLanguages.length > 0 ? (
            topLanguages.map((lang: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className={`
                  px-4 py-2 text-sm font-medium
                  bg-zinc-800 hover:bg-zinc-700
                  border border-zinc-700 hover:border-zinc-600
                  transform hover:scale-105 hover:-translate-y-1
                  transition-all duration-300 ease-out
                  cursor-default
                  animate-fade-in opacity-0
                  text-zinc-200
                  ${hoveredIndex === index ? 'shadow-lg' : ''}
                `}
                style={{ 
                  animationDelay: getRandomDelay(index),
                  animationFillMode: 'forwards'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {lang}
              </Badge>
            ))
          ) : (
            <div className="w-full text-center py-8 animate-fade-in">
              <p className="text-zinc-400">No top languages found yet</p>
            </div>
          )}
        </div>
      </CardContent>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </Card>
  );
};