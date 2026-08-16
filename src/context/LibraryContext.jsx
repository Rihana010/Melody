import { createContext, useContext, useEffect, useState } from "react";

const LibraryContext = createContext(null);

const STORAGE_KEY = "melody-library";

const defaultLibrary = {
  likedSongs: [],
  savedAlbums: [],
  recentlyPlayed: [],
};

function loadLibrary() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultLibrary;
    }

    return {
      ...defaultLibrary,
      ...JSON.parse(saved),
    };
  } catch {
    return defaultLibrary;
  }
}

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(loadLibrary);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  const isSongLiked = (songId) => {
    return library.likedSongs.some((song) => song.id === songId);
  };

  const toggleLikeSong = (song) => {
    setLibrary((current) => {
      const exists = current.likedSongs.some(
        (item) => item.id === song.id,
      );

      return {
        ...current,
        likedSongs: exists
          ? current.likedSongs.filter((item) => item.id !== song.id)
          : [...current.likedSongs, song],
      };
    });
  };

  const isAlbumSaved = (albumId) => {
    return library.savedAlbums.some((album) => album.id === albumId);
  };

  const toggleSaveAlbum = (album) => {
    setLibrary((current) => {
      const exists = current.savedAlbums.some(
        (item) => item.id === album.id,
      );

      return {
        ...current,
        savedAlbums: exists
          ? current.savedAlbums.filter((item) => item.id !== album.id)
          : [...current.savedAlbums, album],
      };
    });
  };

  const addRecentlyPlayed = (song) => {
    setLibrary((current) => {
      const withoutSong = current.recentlyPlayed.filter(
        (item) => item.id !== song.id,
      );

      return {
        ...current,
        recentlyPlayed: [song, ...withoutSong].slice(0, 20),
      };
    });
  };

  const clearRecentlyPlayed = () => {
    setLibrary((current) => ({
      ...current,
      recentlyPlayed: [],
    }));
  };

  return (
    <LibraryContext.Provider
      value={{
        library,
        isSongLiked,
        toggleLikeSong,
        isAlbumSaved,
        toggleSaveAlbum,
        addRecentlyPlayed,
        clearRecentlyPlayed,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error(
      "useLibrary must be used inside LibraryProvider",
    );
  }

  return context;
}