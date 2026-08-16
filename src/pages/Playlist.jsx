import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ListMusic,
  Play,
  Trash2,
  Pencil,
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import { usePlaylists } from "../context/PlaylistContext";

function Playlist() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    playlists,
    renamePlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
  } = usePlaylists();

  const {
    currentSong,
    isPlaying,
    playSong,
  } = usePlayer();

  const [editing, setEditing] =
    useState(false);

  const [name, setName] = useState("");

  const playlist = playlists.find(
    (item) => item.id === id,
  );

  if (!playlist) {
    return (
      <section className="playlist-page">

        <div className="playlist-not-found">

          <ListMusic size={32} />

          <h1>
            Playlist not found
          </h1>

          <p>
            This playlist may have
            been deleted.
          </p>

          <Link
            to="/playlists"
            className="primary-button"
          >
            Back to playlists
          </Link>

        </div>

      </section>
    );
  }

  const hasSongs =
    playlist.songs.length > 0;

  const isPlaylistActive =
    hasSongs &&
    currentSong &&
    playlist.songs.some(
      (song) =>
        song.id === currentSong.id,
    );

  const handlePlay = () => {
    if (!hasSongs) {
      return;
    }

    playSong(
      playlist.songs[0],
      playlist.songs,
    );
  };

  const handlePlaySong = (song) => {
    playSong(
      song,
      playlist.songs,
    );
  };

  const startRename = () => {
    setName(playlist.name);
    setEditing(true);
  };

  const cancelRename = () => {
    setName("");
    setEditing(false);
  };

  const saveRename = () => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    renamePlaylist(
      playlist.id,
      trimmedName,
    );

    setName("");
    setEditing(false);
  };

  const handleDelete = () => {
    const confirmed =
      window.confirm(
        `Delete "${playlist.name}"? This cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    deletePlaylist(playlist.id);

    navigate("/playlists");
  };

  return (
    <section className="playlist-page">

      {/* Back */}

      <Link
        to="/playlists"
        className="album-back-link"
      >
        <ArrowLeft size={18} />
        <span>Playlists</span>
      </Link>


      {/* Header */}

      <header
        className={`playlist-header ${
          isPlaylistActive
            ? "active"
            : ""
        }`}
      >

        <div className="playlist-large-cover">
          <ListMusic size={64} />
        </div>

        <div className="playlist-header-info">

          <p className="album-type">
            Playlist
          </p>

          {editing ? (
            <div className="playlist-rename">

              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    saveRename();
                  }

                  if (
                    event.key === "Escape"
                  ) {
                    cancelRename();
                  }
                }}
                autoFocus
                maxLength={80}
              />

              <button
                type="button"
                className="primary-button"
                onClick={saveRename}
                disabled={!name.trim()}
              >
                Save
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={cancelRename}
              >
                Cancel
              </button>

            </div>
          ) : (
            <>
              <h1>
                {playlist.name}
              </h1>

              <p className="playlist-description">
                {playlist.songs.length}{" "}
                {playlist.songs.length ===
                1
                  ? "song"
                  : "songs"}
              </p>
            </>
          )}


          {/* Actions */}

          <div className="playlist-actions">

            <button
              type="button"
              className="album-play-button"
              onClick={handlePlay}
              disabled={!hasSongs}
            >
              <Play
                size={20}
                fill="currentColor"
              />

              {isPlaylistActive &&
              isPlaying
                ? "Playing"
                : "Play"}
            </button>

            <button
              type="button"
              className="playlist-action-button"
              onClick={startRename}
              disabled={editing}
            >
              <Pencil size={15} />
              Rename
            </button>

            <button
              type="button"
              className="playlist-action-button danger"
              onClick={handleDelete}
              disabled={editing}
            >
              <Trash2 size={15} />
              Delete
            </button>

          </div>

        </div>

      </header>


      {/* Tracks */}

      {!hasSongs ? (
        <div className="playlist-empty">

          <ListMusic size={28} />

          <h2>
            This playlist is empty
          </h2>

          <p>
            Add songs from albums or
            search results to start
            building your playlist.
          </p>

          <Link
            to="/search"
            className="primary-button"
          >
            Find music
          </Link>

        </div>
      ) : (

        <div className="playlist-tracks">

          {/* Header */}

          <div className="playlist-track-header">
            <span>#</span>
            <span>Title</span>
            <span></span>
            <span>Duration</span>
            <span></span>
          </div>


          {/* Songs */}

          {playlist.songs.map(
            (song, index) => {
              const active =
                currentSong?.id ===
                song.id;

              return (
                <div
                  className={`playlist-song-row ${
                    active
                      ? "active"
                      : ""
                  }`}
                  key={song.id}
                  onClick={() =>
                    handlePlaySong(
                      song,
                    )
                  }
                  aria-current={
                    active
                      ? "true"
                      : undefined
                  }
                >

                  <button
                    type="button"
                    className="playlist-song-play"
                    onClick={(event) => {
                      event.stopPropagation();

                      handlePlaySong(
                        song,
                      );
                    }}
                    aria-label={
                      active && isPlaying
                        ? `Playing ${song.title}`
                        : `Play ${song.title}`
                    }
                  >

                    <span className="playlist-song-number">
                      {index + 1}
                    </span>

                    <span className="playlist-song-play-icon">
                      {active &&
                      isPlaying ? (
                        <span>
                          •••
                        </span>
                      ) : (
                        <Play
                          size={15}
                          fill="currentColor"
                        />
                      )}
                    </span>

                  </button>


                  <img
                    src={song.cover}
                    alt=""
                    className="playlist-song-cover"
                  />


                  <div className="playlist-song-info">

                    <h3>
                      {song.title}
                    </h3>

                    <p>
                      {song.artist}
                    </p>

                  </div>


                  <span className="playlist-song-duration">
                    {song.duration}
                  </span>


                  <button
                    type="button"
                    className="playlist-remove-button"
                    onClick={(event) => {
                      event.stopPropagation();

                      removeSongFromPlaylist(
                        playlist.id,
                        song.id,
                      );
                    }}
                    aria-label={`Remove ${song.title} from playlist`}
                    title="Remove from playlist"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>
              );
            },
          )}

        </div>
      )}

    </section>
  );
}

export default Playlist;