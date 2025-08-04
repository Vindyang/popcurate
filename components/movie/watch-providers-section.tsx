import Image from 'next/image';
import { tmdbClient } from '@/lib/tmdb/client';
import { getImageUrl } from '@/lib/utils';
import type { TMDbWatchProviders, TMDbWatchProvider } from '@/types/tmdb';

interface WatchProvidersProps {
  movieId: number;
  movieTitle?: string;
}

export async function WatchProviders({
  movieId,
  movieTitle,
}: WatchProvidersProps) {
  let watchProviders: TMDbWatchProviders | null = null;
  let externalIds: {
    imdb_id?: string;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
    wikidata_id?: string;
  } | null = null;

  try {
    watchProviders = await tmdbClient.getWatchProviders(movieId);
    externalIds = await tmdbClient.getMovieExternalIds(movieId);
  } catch (error) {
    console.error('Error fetching watch providers:', error);
  }

  // Get providers for US market (you can make this configurable)
  const usProviders = watchProviders?.results?.US;

  if (!usProviders) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-4xl">📺</div>
        <p className="text-muted-foreground">
          No streaming information available for this movie.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streaming Services */}
      {usProviders.flatrate && usProviders.flatrate.length > 0 && (
        <ProviderSection
          title="Stream"
          description="Watch with subscription"
          providers={usProviders.flatrate}
          link={usProviders.link}
          movieTitle={movieTitle}
          externalIds={externalIds}
        />
      )}

      {/* Rental Services */}
      {usProviders.rent && usProviders.rent.length > 0 && (
        <ProviderSection
          title="Rent"
          description="Rent or purchase to watch"
          providers={usProviders.rent}
          link={usProviders.link}
          movieTitle={movieTitle}
          externalIds={externalIds}
        />
      )}

      {/* Purchase Services */}
      {usProviders.buy && usProviders.buy.length > 0 && (
        <ProviderSection
          title="Buy"
          description="Purchase to own"
          providers={usProviders.buy}
          link={usProviders.link}
          movieTitle={movieTitle}
          externalIds={externalIds}
        />
      )}

      {/* JustWatch Attribution */}
      {usProviders.link && (
        <div className="border-t pt-4">
          <p className="text-muted-foreground text-center text-sm">
            Data provided by{' '}
            <a
              href={usProviders.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              JustWatch
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

interface ProviderSectionProps {
  title: string;
  description: string;
  providers: TMDbWatchProvider[];
  link: string;
  movieTitle?: string;
  externalIds?: {
    imdb_id?: string;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
    wikidata_id?: string;
  } | null;
}

function ProviderSection({
  title,
  description,
  providers,
  link,
  movieTitle,
  externalIds,
}: ProviderSectionProps) {
  // Function to generate direct links to streaming providers
  const getProviderUrl = (
    provider: TMDbWatchProvider,
    fallbackLink: string
  ) => {
    // Special handling for Apple TV
    if (provider.provider_name === 'Apple TV' && movieTitle) {
      // Apple TV requires specific internal IDs that we don't have access to
      // The URL format is: https://tv.apple.com/us/movie/slug/umc.cmc.XXXXX?playableId=tvs.sbd.XXXXX
      // Since we can't construct the exact URL, we provide multiple fallback options:

      // Option 1: Try a direct search on Apple TV (most reliable)
      const encodedTitle = encodeURIComponent(movieTitle);

      // Option 2: If we have IMDb ID, we could potentially use it for better search
      const imdbId = externalIds?.imdb_id;
      if (imdbId) {
        // Some services can redirect from IMDb to Apple TV, but Apple TV doesn't directly support this
        // So we'll stick with the search approach but make it more specific
        return `https://tv.apple.com/us/search?term=${encodedTitle}`;
      }

      // Fallback to standard search
      return `https://tv.apple.com/us/search?term=${encodedTitle}`;
    }

    // Map provider names to their direct URLs or search URLs
    const providerUrls: Record<string, string> = {
      Netflix: 'https://www.netflix.com/search',
      'Amazon Prime Video':
        'https://www.amazon.com/Prime-Video/b?node=2676882011',
      'Amazon Video': 'https://www.amazon.com/Prime-Video/b?node=2676882011',
      'Disney Plus': 'https://www.disneyplus.com/search',
      'Disney+': 'https://www.disneyplus.com/search',
      Hulu: 'https://www.hulu.com/search',
      'HBO Max': 'https://www.max.com/search',
      Max: 'https://www.max.com/search',
      'Apple TV': 'https://tv.apple.com/search',
      'Apple TV Plus': 'https://tv.apple.com/search',
      'Apple TV+': 'https://tv.apple.com/search',
      'Paramount Plus': 'https://www.paramountplus.com/search',
      'Paramount+': 'https://www.paramountplus.com/search',
      Peacock: 'https://www.peacocktv.com/search',
      'Peacock Premium': 'https://www.peacocktv.com/search',
      YouTube: 'https://www.youtube.com/movies',
      'YouTube Movies': 'https://www.youtube.com/movies',
      'Google Play Movies & TV': 'https://play.google.com/store/movies',
      'Google Play Movies': 'https://play.google.com/store/movies',
      Vudu: 'https://www.vudu.com/content/movies/home',
      'Fandango At Home': 'https://www.vudu.com/content/movies/home',
      'Microsoft Store': 'https://www.microsoft.com/en-us/store/movies-and-tv',
      iTunes: 'https://tv.apple.com/search',
      'Apple iTunes': 'https://tv.apple.com/search',
      Showtime: 'https://www.sho.com/search',
      Starz: 'https://www.starz.com/search',
      Crunchyroll: 'https://www.crunchyroll.com/search',
      Funimation: 'https://www.funimation.com/search',
      Tubi: 'https://tubitv.com/search',
      'Pluto TV': 'https://pluto.tv/search',
      'The Roku Channel': 'https://therokuchannel.roku.com/search',
      'Roku Channel': 'https://therokuchannel.roku.com/search',
      'Criterion Channel': 'https://www.criterionchannel.com/search',
      'AMC+': 'https://www.amcplus.com/search',
      'Discovery+': 'https://www.discoveryplus.com/search',
      'ESPN+': 'https://plus.espn.com/search',
      'Spectrum On Demand': 'https://www.spectrum.com/watch',
      // Additional common providers
      'Netflix basic with Ads': 'https://www.netflix.com/search',
      'Paramount+ with Showtime': 'https://www.paramountplus.com/search',
      'Hulu (No Ads)': 'https://www.hulu.com/search',
      FX: 'https://www.fxnetworks.com/search',
      'Showtime Amazon Channel':
        'https://www.amazon.com/gp/video/storefront/ref=atv_hm_hom_c_9zZ8D2_cShT_4_1',
      'Cinemax Amazon Channel': 'https://www.amazon.com/gp/video/storefront',
      Redbox: 'https://www.redbox.com/movies',
      Kanopy: 'https://www.kanopy.com/search',
      Hoopla: 'https://www.hoopladigital.com/search',
    };

    // Return specific provider URL if available, otherwise use the JustWatch fallback
    return providerUrls[provider.provider_name] || fallbackLink;
  };

  return (
    <div>
      <div className="mb-3">
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {providers.map((provider) => (
          <a
            key={provider.provider_id}
            href={getProviderUrl(provider, link)}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="bg-muted hover:bg-muted/80 flex aspect-square flex-col items-center justify-center rounded-lg p-3 transition-colors group-hover:scale-105">
              {provider.logo_path ? (
                <Image
                  src={getImageUrl(provider.logo_path, 'w200')}
                  alt={provider.provider_name}
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              ) : (
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <span className="text-xs">📺</span>
                </div>
              )}
              <span className="mt-2 line-clamp-2 text-center text-xs font-medium">
                {provider.provider_name}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
