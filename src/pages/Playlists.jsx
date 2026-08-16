import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ListMusic,
  Plus,
  Trash2,
  Play,
} from "lucide-react";

import { usePlaylists } from "../context/PlaylistContext";
import { usePlayer } from "../context/PlayerContext";

function Playlists() {
  const navigate = useNavigate();

  const {
    playlists,
    createPlaylist,
    deletePlaylist,
  } = usePlaylists();

  const {
    currentSong,
    isPlaying,
    playSong,
  } = usePlayer();

  const [showCreate, setShowCreate] =
    useState(false);

  const [name, setName] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();

    const playlist = createPlaylist(name);

    if (!playlist) {
      return;
    }

    setName("");
    setShowCreate(false);

    navigate(`/playlist/${playlist.id}`);
  };

  const closeCreate = () => {
    setName("");
    setShowCreate(false);
  };

  const handlePlay = (event, playlist) => {
    event.preventDefault();
    event.stopPropagation();

    if (playlist.songs.length === 0) {
      return;
    }

    playSong(
      playlist.songs[0],
      playlist.songs,
    );
  };

  const handleDelete = (event, playlist) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm(
      `Delete "${playlist.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deletePlaylist(playlist.id);
  };

  return (
    <section className="playlists-page">

      {/* Header */}

      <header className="playlists-header">
        <div>
          <p className="eyebrow">
            Your collection
          </p>

          <h1>Playlists</h1>

          <p className="playlists-subtitle">
            {playlists.length}{" "}
            {playlists.length === 1
              ? "playlist"
              : "playlists"}
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setShowCreate(true)
          }
        >
          <Plus size={18} />
          New playlist
        </button>
      </header>


      {/* Empty */}

      {playlists.length === 0 ? (
        <div className="playlists-empty">

          <div className="playlists-empty-icon">
            <ListMusic size={26} />
          </div>

          <h2>
            Create your first playlist
          </h2>

          <p>
            Organize the music you want
            to listen to together.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              setShowCreate(true)
            }
          >
            <Plus size={18} />
            Create playlist
          </button>

        </div>
      ) : (

        /* Playlist grid */

        <div className="playlist-grid">

          {playlists.map((playlist) => {
            const hasSongs =
              playlist.songs.length > 0;

            const isCurrentPlaylist =
              hasSongs &&
              currentSong &&
              playlist.songs.some(
                (song) =>
                  song.id ===
                  currentSong.id,
              );

            return (
              <div
                className={`playlist-card ${
                  isCurrentPlaylist
                    ? "active"
                    : ""
                }`}
                key={playlist.id}
              >

                <Link
                  to={`/playlist/${playlist.id}`}
                  className="playlist-card-link"
                >

                  <div className="playlist-cover">

                    <ListMusic size={42} />

                    {hasSongs && (
                      <button
                        type="button"
                        className="playlist-card-play"
                        onClick={(event) =>
                          handlePlay(
                            event,
                            playlist,
                          )
                        }
                        aria-label={`Play ${playlist.name}`}
                        title={`Play ${playlist.name}`}
                      >
                        <Play
                          size={17}
                          fill="currentColor"
                        />
                      </button>
                    )}

                  </div>

                  <h3>
                    {playlist.name}
                  </h3>

                  <p>
                    {playlist.songs.length}{" "}
                    {playlist.songs.length === 1
                      ? "song"
                      : "songs"}
                  </p>

                  {isCurrentPlaylist &&
                    isPlaying && (
                      <span className="playlist-playing-label">
                        Playing
                      </span>
                    )}

                </Link>

                <button
                  type="button"
                  className="playlist-delete"
                  onClick={(event) =>
                    handleDelete(
                      event,
                      playlist,
                    )
                  }
                  aria-label={`Delete ${playlist.name}`}
                  title="Delete playlist"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            );
          })}

        </div>
      )}


      {/* Create modal */}

      {showCreate && (
        <div
          className="modal-backdrop"
          onClick={closeCreate}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-playlist-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h2 id="create-playlist-title">
              Create playlist
            </h2>

            <form onSubmit={handleCreate}>

              <label htmlFor="playlist-name">
                Playlist name
              </label>

              <input
                id="playlist-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Escape"
                  ) {
                    closeCreate();
                  }
                }}
                placeholder="My playlist"
                autoFocus
                maxLength={80}
              />

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeCreate}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!name.trim()}
                >
                  Create
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}

export default Playlists;