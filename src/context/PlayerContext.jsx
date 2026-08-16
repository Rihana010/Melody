import {
  createContext,
  useContext,
  useState,
} from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const playSong = (song, songs = [song]) => {
    if (!song) {
      return;
    }

    const nextQueue =
      songs.length > 0 ? songs : [song];

    const index = nextQueue.findIndex(
      (item) => item.id === song.id,
    );

    // Clicking the currently playing song
    // toggles play/pause instead of restarting it.
    if (
      currentSong?.id === song.id &&
      queue.length === nextQueue.length &&
      queue.every(
        (item, position) =>
          item.id === nextQueue[position]?.id,
      )
    ) {
      setIsPlaying((playing) => !playing);
      return;
    }

    setQueue(nextQueue);
    setCurrentIndex(
      index >= 0 ? index : 0,
    );
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const playNext = () => {
    if (queue.length === 0) {
      return;
    }

    // Repeat current song
    if (repeatMode === "one") {
      setIsPlaying(false);

      setTimeout(() => {
        setIsPlaying(true);
      }, 50);

      return;
    }

    let nextIndex;

    if (isShuffle && queue.length > 1) {
      const availableIndexes = queue
        .map((_, index) => index)
        .filter(
          (index) => index !== currentIndex,
        );

      nextIndex =
        availableIndexes[
          Math.floor(
            Math.random() *
              availableIndexes.length,
          )
        ];
    } else {
      nextIndex = currentIndex + 1;

      if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (queue.length === 0) {
      return;
    }

    // If we're not at the beginning,
    // simply go to the previous track.
    if (currentIndex > 0) {
      const previousIndex =
        currentIndex - 1;

      setCurrentIndex(previousIndex);
      setCurrentSong(queue[previousIndex]);
      setIsPlaying(true);

      return;
    }

    // At the beginning:
    // Repeat All goes to the last song.
    if (repeatMode === "all") {
      const lastIndex =
        queue.length - 1;

      setCurrentIndex(lastIndex);
      setCurrentSong(queue[lastIndex]);
      setIsPlaying(true);

      return;
    }

    // Otherwise stay at the first song.
    setCurrentIndex(0);
    setCurrentSong(queue[0]);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentSong) {
      return;
    }

    setIsPlaying(
      (playing) => !playing,
    );
  };

  const toggleShuffle = () => {
    setIsShuffle(
      (shuffle) => !shuffle,
    );
  };

  const cycleRepeat = () => {
    setRepeatMode((mode) => {
      if (mode === "off") {
        return "all";
      }

      if (mode === "all") {
        return "one";
      }

      return "off";
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        currentIndex,
        isPlaying,
        isShuffle,
        repeatMode,
        playSong,
        playNext,
        playPrevious,
        togglePlay,
        toggleShuffle,
        cycleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context =
    useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider",
    );
  }

  return context;
}