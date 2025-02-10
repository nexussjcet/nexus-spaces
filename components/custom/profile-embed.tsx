import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface ProfileEmbedProps {
  imageUrl: string;
  name: string;
  email: string;
  bio: string;
}

export function ProfileEmbed({ imageUrl, name, email, bio }: ProfileEmbedProps) {
  return (
    <div className="flex flex-col gap-1 items-center p-5 border border-gray-300 rounded-md w-72">
      <Avatar>
        <AvatarImage src={imageUrl}/>
        <AvatarFallback className='bg-neutral-900'>{name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <h2 className='font-bold'>{name}</h2>
      <div className='flex flex-col'>
        <a href={`mailto:${email}`} className="mb-2 underline">
          {email}
        </a>
        <p>{bio}</p>
      </div>
    </div>
  );
}