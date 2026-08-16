import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const PlaylistContext = createContext(null);

const STORAGE_KEY = "melody-playlists";

function loadPlaylists() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState(loadPlaylists);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(playlists),
    );
  }, [playlists]);

  const createPlaylist = (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return null;
    }

    const playlist = {
      id: crypto.randomUUID(),
      name: trimmedName,
      description: "",
      cover: null,
      songs: [],
      createdAt: Date.now(),
    };

    setPlaylists((current) => [...current, playlist]);

    return playlist;
  };

  const renamePlaylist = (playlistId, name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setPlaylists((current) =>
      current.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              name: trimmedName,
            }
          : playlist,
      ),
    );
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((current) =>
      current.filter(
        (playlist) => playlist.id !== playlistId,
      ),
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((current) =>
      current.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        const alreadyExists = playlist.songs.some(
          (item) => item.id === song.id,
        );

        if (alreadyExists) {
          return playlist;
        }

        return {
          ...playlist,
          songs: [...playlist.songs, song],
        };
      }),
    );
  };

  const removeSongFromPlaylist = (
    playlistId,
    songId,
  ) => {
    setPlaylists((current) =>
      current.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        return {
          ...playlist,
          songs: playlist.songs.filter(
            (song) => song.id !== songId,
          ),
        };
      }),
    );
  };

  const getPlaylist = (playlistId) => {
    return playlists.find(
      (playlist) => playlist.id === playlistId,
    );
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        getPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);

  if (!context) {
    throw new Error(
      "usePlaylists must be used inside PlaylistProvider",
    );
  }

  return context;
}