# Apple TV Direct Links - Technical Notes

## Current Implementation

Our watch providers section currently generates Apple TV search URLs in the format:

```
https://tv.apple.com/us/search?term=Movie%20Title
```

## The Challenge

Apple TV uses specific internal identifiers for direct movie links:

```
https://tv.apple.com/us/movie/movie-slug/umc.cmc.INTERNAL_ID?playableId=tvs.sbd.PLAYABLE_ID
```

Example:

```
https://tv.apple.com/us/movie/28-years-later/umc.cmc.1by2zb4d0qbto5tumjnsn40da?playableId=tvs.sbd.9001%3A1820539079
```

## Why We Can't Generate Direct Links

1. **Internal IDs**: The `umc.cmc.XXXXX` and `tvs.sbd.XXXXX` identifiers are Apple's internal movie/content IDs
2. **No Public API**: Apple doesn't provide a public API to map from movie titles or IMDb IDs to these internal identifiers
3. **TMDb Limitation**: TMDb's external IDs don't include Apple TV identifiers

## Current Solution

We use Apple TV's search functionality with the exact movie title, which:

- Takes users directly to Apple TV's search results
- Pre-populates the search with the movie title
- Allows users to find and click on the correct movie
- Provides a reliable fallback when direct links aren't possible

## Potential Future Enhancements

1. **Web Scraping**: Could potentially scrape Apple TV search results to find direct URLs (not recommended due to terms of service)
2. **Third-party APIs**: Look for services that maintain Apple TV URL mappings
3. **User Contribution**: Allow users to submit correct Apple TV URLs for movies
4. **Apple Partnership**: If Apple provides a public API in the future

## Alternative Approaches Considered

1. **IMDb Integration**: While we have IMDb IDs, Apple TV doesn't accept IMDb-based URLs
2. **Universal Links**: Apple TV doesn't support universal movie links that work across platforms
3. **URL Pattern Matching**: Apple's URL structure is too complex to reliably generate without internal IDs

## Recommendation

The current search-based approach provides the best user experience given the technical constraints. Users get taken directly to Apple TV with their search pre-filled, making it easy to find and access the movie.
