import { useState } from 'react';
import Watchlist from './Watchlist';

function ParentComponent() {
  const [watchlist, setWatchlist] = useState([
    // Your initial watchlist items here
    // Example:
    {
      id: 1,
      title: "Example Movie",
      media_type: "movie",
      poster_path: "/example.jpg",
      release_date: "2023-01-01"
    }
  ]);

  return (
    <Watchlist 
      watchlist={watchlist} 
      setWatchlist={setWatchlist} 
    />
  );
}