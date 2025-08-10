// ThemeToggle (Client Component)
'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // const highlightColor =
  //   theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200';

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="group text-muted-foreground hover:text-foreground focus-visible:ring-primary cursor-pointer transition-colors focus-visible:ring-2"
    >
      {theme === 'dark' ? (
        <MoonIcon className="text-primary h-5 w-5 transition-colors" />
      ) : (
        <SunIcon className="text-primary h-5 w-5 scale-125 transition-colors" />
      )}
    </Button>
  );
}
