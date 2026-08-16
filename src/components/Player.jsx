import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";

function Player() {
  const {
    currentSong,
    isPlaying,
    playNext,
    playPrevious,
    togglePlay,
    isShuffle,
    repeatMode,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const { addRecentlyPlayed } = useLibrary();

  const audioRef = useRef(null);
  const previousVolumeRef = useRef(1);
  const recentlyPlayedRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);

  /*
   * Load a new song
   */
  useEffect(() => {
    if (!currentSong || !audioRef.current) {
      return;
    }

    const audio = audioRef.current;

    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);
    setIsLoading(true);

    audio.pause();
    audio.src = currentSong.audio;
    audio.load();

    /*
     * Prevent duplicate recently-played
     * updates caused by React effects.
     */
    if (
      recentlyPlayedRef.current !==
      currentSong.id
    ) {
      addRecentlyPlayed(currentSong);

      recentlyPlayedRef.current =
        currentSong.id;
    }

    if (isPlaying) {
      audio
        .play()
        .catch((error) => {
          console.error(
            "Audio playback failed:",
            error,
          );

          setIsLoading(false);
          setAudioError(true);
        });
    }
  }, [currentSong]);

  /*
   * Play / pause synchronization
   */
  useEffect(() => {
    if (!audioRef.current || !currentSong) {
      return;
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio
        .play()
        .catch((error) => {
          console.error(
            "Audio playback failed:",
            error,
          );

          setAudioError(true);
        });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  /*
   * Volume synchronization
   */
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
  }, [volume]);

  /*
   * Metadata loaded
   */
  const handleLoadedMetadata = () => {
    if (!audioRef.current) {
      return;
    }

    const loadedDuration =
      audioRef.current.duration;

    if (Number.isFinite(loadedDuration)) {
      setDuration(loadedDuration);
    }

    setIsLoading(false);
    setAudioError(false);
  };

  /*
   * Audio started loading
   */
  const handleLoadStart = () => {
    setIsLoading(true);
    setAudioError(false);
  };

  /*
   * Audio can start playing
   */
  const handleCanPlay = () => {
    setIsLoading(false);
  };

  /*
   * Audio error
   */
  const handleAudioError = () => {
    setIsLoading(false);
    setAudioError(true);
  };

  /*
   * Progress update
   */
  const handleTimeUpdate = () => {
    if (!audioRef.current) {
      return;
    }

    setCurrentTime(
      audioRef.current.currentTime,
    );
  };

  /*
   * Seek
   */
  const handleSeek = (event) => {
    if (!audioRef.current) {
      return;
    }

    const time = Number(
      event.target.value,
    );

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  /*
   * Song ended
   */
  const handleSongEnded = () => {
    if (!audioRef.current) {
      return;
    }

    /*
     * Repeat One is handled directly
     * so the queue does not change.
     */
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;

      audioRef.current
        .play()
        .catch((error) => {
          console.error(
            "Audio replay failed:",
            error,
          );
        });

      return;
    }

    /*
     * Repeat Off / Repeat All / Shuffle
     * are handled by PlayerContext.
     */
    playNext();
  };

  /*
   * Mute / unmute
   */
  const handleMute = () => {
    if (volume > 0) {
      previousVolumeRef.current = volume;
      setVolume(0);
      return;
    }

    setVolume(
      previousVolumeRef.current || 1,
    );
  };

  /*
   * Volume slider
   */
  const handleVolumeChange = (event) => {
    const newVolume = Number(
      event.target.value,
    );

    if (newVolume > 0) {
      previousVolumeRef.current =
        newVolume;
    }

    setVolume(newVolume);
  };

  /*
   * Format seconds as M:SS
   */
  const formatTime = (time) => {
    if (!Number.isFinite(time)) {
      return "0:00";
    }

    const minutes = Math.floor(
      time / 60,
    );

    const seconds = Math.floor(
      time % 60,
    );

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * Empty player
   */
  if (!currentSong) {
    return (
      <footer className="player">
        <div className="player-empty">
          Select a song to start listening
        </div>
      </footer>
    );
  }

  return (
    <footer className="player">

      {/* =========================
          AUDIO ENGINE
          ========================= */}

      <audio
        ref={audioRef}
        onLoadStart={handleLoadStart}
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnded}
        onError={handleAudioError}
        preload="metadata"
      />


      {/* =========================
          CURRENT SONG
          ========================= */}

      <div className="player-song">
        <div className="player-cover">
          <img
            src={currentSong.cover}
            alt=""
          />
        </div>

        <div className="player-song-info">
          <h3>{currentSong.title}</h3>

          <p>{currentSong.artist}</p>
        </div>
      </div>


      {/* =========================
          CONTROLS
          ========================= */}

      <div className="player-controls">

        <div className="player-buttons">

          {/* Shuffle */}

          <button
            type="button"
            className={`player-control-button ${
              isShuffle ? "active" : ""
            }`}
            onClick={toggleShuffle}
            aria-label={
              isShuffle
                ? "Disable shuffle"
                : "Enable shuffle"
            }
            title={
              isShuffle
                ? "Shuffle on"
                : "Shuffle off"
            }
          >
            <Shuffle size={18} />
          </button>


          {/* Previous */}

          <button
            type="button"
            className="player-control-button"
            onClick={playPrevious}
            aria-label="Previous song"
            title="Previous"
          >
            <SkipBack size={18} />
          </button>


          {/* Play / Pause */}

          <button
            type="button"
            className="player-play-button"
            onClick={togglePlay}
            aria-label={
              isPlaying
                ? "Pause"
                : "Play"
            }
            title={
              isPlaying
                ? "Pause"
                : "Play"
            }
          >
            {isLoading ? (
              <span
                className="player-loading"
                aria-label="Loading"
              />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play
                size={20}
                fill="currentColor"
              />
            )}
          </button>


          {/* Next */}

          <button
            type="button"
            className="player-control-button"
            onClick={playNext}
            aria-label="Next song"
            title="Next"
          >
            <SkipForward size={18} />
          </button>


          {/* Repeat */}

          <button
            type="button"
            className={`player-control-button ${
              repeatMode !== "off"
                ? "active"
                : ""
            }`}
            onClick={cycleRepeat}
            aria-label="Change repeat mode"
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === "one" ? (
              <Repeat1 size={18} />
            ) : (
              <Repeat size={18} />
            )}
          </button>

        </div>


        {/* =========================
            PROGRESS
            ========================= */}

        <div className="player-progress">

          <span>
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={
              !duration ||
              isLoading ||
              audioError
            }
            aria-label="Song progress"
          />

          <span>
            {formatTime(duration)}
          </span>

        </div>

      </div>


      {/* =========================
          VOLUME
          ========================= */}

      <div className="player-volume">

        <button
          type="button"
          className="player-control-button"
          onClick={handleMute}
          aria-label={
            volume === 0
              ? "Unmute"
              : "Mute"
          }
          title={
            volume === 0
              ? "Unmute"
              : "Mute"
          }
        >
          {volume === 0 ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />

      </div>


      {/* =========================
          AUDIO ERROR
          ========================= */}

      {audioError && (
        <div className="player-error">
          Unable to play this song
        </div>
      )}

    </footer>
  );
}

export default Player;