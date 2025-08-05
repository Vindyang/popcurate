'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { TMDbVideos, TMDbVideo } from '@/types/tmdb';

interface MovieVideosProps {
  movieId: number;
}

function VideoThumbnail({ video }: { video: TMDbVideo }) {
  if (video.site !== 'YouTube') return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${video.key}`;

  return (
    <div className="group bg-muted relative aspect-video w-64 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 ease-out hover:z-10 hover:scale-105 md:w-72">
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
      >
        <Image
          src={thumbnailUrl}
          alt={video.name}
          width={320}
          height={180}
          className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-110"
          unoptimized // YouTube thumbnails don't need optimization
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 group-hover:bg-black/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-red-700 group-hover:shadow-lg">
            <svg
              className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </a>

      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-all duration-300 group-hover:from-black/80">
        <p className="truncate text-xs font-medium text-white">{video.name}</p>
        <p className="text-xs text-gray-300 capitalize">
          {video.type.toLowerCase()}
        </p>
      </div>
    </div>
  );
}

export function MovieVideos({ movieId }: MovieVideosProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<TMDbVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(`/api/movies/${movieId}/videos`);
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const videosData: TMDbVideos = await response.json();

        if (videosData?.results) {
          // Filter and sort videos - prioritize official trailers and teasers
          const sortedVideos = videosData.results
            .filter((video: TMDbVideo) => video.site === 'YouTube')
            .sort((a: TMDbVideo, b: TMDbVideo) => {
              // Prioritize official videos
              if (a.official && !b.official) return -1;
              if (!a.official && b.official) return 1;

              // Then prioritize by type: Trailer > Teaser > Clip > Featurette > Behind the Scenes
              const typeOrder: Record<string, number> = {
                Trailer: 1,
                Teaser: 2,
                Clip: 3,
                Featurette: 4,
                'Behind the Scenes': 5,
              };

              const aOrder = typeOrder[a.type] || 99;
              const bOrder = typeOrder[b.type] || 99;

              if (aOrder !== bOrder) return aOrder - bOrder;

              // Finally sort by published date (newest first)
              return (
                new Date(b.published_at).getTime() -
                new Date(a.published_at).getTime()
              );
            })
            .slice(0, 8); // Limit to 8 videos

          setVideos(sortedVideos);
        }
      } catch (error) {
        console.error('Error fetching movie videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [movieId]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -320, // Scroll by approximately one video width
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 320, // Scroll by approximately one video width
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          Videos & Trailers
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-video w-64 flex-shrink-0 md:w-72"
            />
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
        Videos & Trailers
      </h3>

      <div className="group flex items-start gap-4">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className="h-36 w-12 flex-shrink-0 rounded-lg bg-black/10 p-0 opacity-70 transition-all hover:bg-black/20 hover:opacity-100 md:h-[162px] dark:bg-white/10 dark:hover:bg-white/20"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>

        {/* Videos Container */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex flex-1 gap-4 overflow-x-auto pt-2 pb-4"
        >
          {videos.map((video) => (
            <VideoThumbnail key={video.id} video={video} />
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className="h-36 w-12 flex-shrink-0 rounded-lg bg-black/10 p-0 opacity-70 transition-all hover:bg-black/20 hover:opacity-100 md:h-[162px] dark:bg-white/10 dark:hover:bg-white/20"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
