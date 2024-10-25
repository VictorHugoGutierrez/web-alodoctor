'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface WelcomeProps {
  textTitle: string;
  textSubTitle: string;
}

export default function LandingPage(props: WelcomeProps) {
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentSubTitle, setCurrentSubTitle] = useState('');
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentSubTitleIndex, setCurrentSubTitleIndex] = useState(0);

  useEffect(() => {
    setCurrentTitle('');
    setCurrentSubTitle('');
    setCurrentTitleIndex(0);
    setCurrentSubTitleIndex(0);
  }, [props.textTitle]);

  useEffect(() => {
    const titleTimeout = setTimeout(() => {
      if (currentTitleIndex < props.textTitle.length) {
        setCurrentTitle(
          (prevText) => prevText + props.textTitle[currentTitleIndex]
        );
        setCurrentTitleIndex((prevIndex) => prevIndex + 1);
      } else if (currentSubTitleIndex < props.textSubTitle.length) {
        setCurrentSubTitle(
          (prevText) => prevText + props.textSubTitle[currentSubTitleIndex]
        );
        setCurrentSubTitleIndex((prevIndex) => prevIndex + 1);
      }
    }, 100);

    return () => clearTimeout(titleTimeout);
  }, [
    props.textTitle,
    currentTitle,
    currentTitleIndex,
    props.textSubTitle,
    currentSubTitle,
    currentSubTitleIndex,
  ]);

  return (
    <div className="flex items-center justify-center h-auto min-h-[80vh] p-10 bg-oxfordBlue">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex items-center justify-center">
          <Avatar className="w-96 h-80">
            <AvatarImage src="/alodoctor-logo.svg" />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center md:text-left">
          <h1 id="typing-title" className="text-3xl font-black lg:text-5xl">
            {currentTitle}
          </h1>
          <p className="text-base lg:text-2xl">{currentSubTitle}</p>
        </div>
      </div>
    </div>
  );
}
