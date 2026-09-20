# Halcyon Picture House

A movie site built with React and Vite. It has a curtain-opening hero, tilting posters,
a teaser player, a seat picker, a tear-off ticket, search and favorites.
All films are made up and the posters are drawn in SVG, so there are no image files.

## Run it

```bash
npm install
npm run dev      # opens http://localhost:5173
npm run build    # production files go to dist/
```

Needs Node.js 18 or newer.

## Where things are

- `src/data/films.js` holds the films and the "coming soon" list. Add a film here.
- `src/components/Art.jsx` has one SVG drawing per film (`motif` in the data picks it).
- `src/components/Poster.jsx` draws a poster: background, art and title.
- `src/components/Screening.jsx` is the panel with details, seat picker and ticket.
- `src/components/Tilt.jsx` and `Dust.jsx` are the hover tilt and the floating dust.
- `src/App.jsx` is the page: hero, film list with search and favorites, coming soon.
- `src/styles.css` holds all styles. Colors are variables at the top.

## Using real movie data

To show real films, replace `FILMS` with a fetch from a movie API such as TMDB
(you need a free API key). Use the API's poster URL in an `<img>` inside
`Poster.jsx` instead of the SVG art.
