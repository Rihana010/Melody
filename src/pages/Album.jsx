import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Play,
  Bookmark,
  BookmarkCheck,
  ListPlus,
  X,
} from "lucide-react";

import { albums } from "../data/mockData";
import { usePlayer } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import { usePlaylists } from "../context/PlaylistContext";

function Album() {
  const { id } = useParams();

  const album = albums.find(
    (item) => item.id === Number(id),
  );

  const {
    currentSong,
    isPlaying,
    playSong,
  } = usePlayer();

  const {
    isSongLiked,
    toggleLikeSong,
    isAlbumSaved,
    toggleSaveAlbum,
  } = useLibrary();

  const {
    playlists,
    addSongToPlaylist,
  } = usePlaylists();

  const [selectedSong, setSelectedSong] =
    useState(null);

  if (!album) {
    return (
      <section className="album-page">
        <h1>Album not found</h1>

        <Link
          to="/"
          className="album-back-link"
        >
          <ArrowLeft size={18} />
          Back home
        </Link>
      </section>
    );
  }

  const saved = isAlbumSaved(album.id);

  const hasSongs =
    album.songs &&
    album.songs.length > 0;

  const albumIsPlaying =
    hasSongs &&
    currentSong &&
    album.songs.some(
      (song) => song.id === currentSong.id,
    );

  const handlePlayAlbum = () => {
    if (!hasSongs) {
      return;
    }

    playSong(
      album.songs[0],
      album.songs,
    );
  };

  const handlePlaySong = (song) => {
    playSong(song, album.songs);
  };

  const handleAddToPlaylist = (
    playlistId,
    song,
  ) => {
    addSongToPlaylist(
      playlistId,
      song,
    );

    setSelectedSong(null);
  };

  return (
    <section className="album-page">

      {/* Back */}

      <Link
        to="/"
        className="album-back-link"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </Link>


      {/* Album header */}

      <header className="album-header">

        <div className="album-header-cover">
          <img
            src={album.cover}
            alt={album.title}
          />
        </div>

        <div className="album-header-info">

          <p className="album-type">
            Album
          </p>

          <h1>{album.title}</h1>

          <p className="album-artist">
            {album.artist}
          </p>

          <p className="album-meta">
            {album.songs.length}{" "}
            {album.songs.length === 1
              ? "song"
              : "songs"}
          </p>

          <div className="album-actions">

            <button
              type="button"
              className="album-play-button"
              onClick={handlePlayAlbum}
              disabled={!hasSongs}
            >
              <Play
                size={20}
                fill="currentColor"
              />

              {albumIsPlaying &&
              isPlaying
                ? "Playing"
                : "Play"}
            </button>

            <button
              type="button"
              className={`album-icon-button ${
                saved ? "active" : ""
              }`}
              onClick={() =>
                toggleSaveAlbum(album)
              }
              aria-label={
                saved
                  ? "Remove album from library"
                  : "Save album"
              }
              title={
                saved
                  ? "Remove from library"
                  : "Save album"
              }
            >
              {saved ? (
                <BookmarkCheck
                  size={20}
                />
              ) : (
                <Bookmark size={20} />
              )}
            </button>

          </div>

        </div>
      </header>


      {/* Tracks */}

      <section className="album-tracks">

        <div className="album-tracks-header">
          <span>#</span>
          <span>Title</span>
          <span>Duration</span>
          <span></span>
        </div>

        {!hasSongs ? (
          <div className="album-no-songs">

            <h2>
              No songs yet
            </h2>

            <p>
              This album doesn't have
              any tracks available yet.
            </p>

          </div>
        ) : (

          <div className="song-list">

            {album.songs.map(
              (song, index) => {
                const liked =
                  isSongLiked(song.id);

                const active =
                  currentSong?.id ===
                  song.id;

                return (
                  <div
                    className={`song-row ${
                      active ? "active" : ""
                    }`}
                    key={song.id}
                    onClick={() =>
                      handlePlaySong(song)
                    }
                    aria-current={
                      active
                        ? "true"
                        : undefined
                    }
                  >

                    {/* Play */}

                    <button
                      type="button"
                      className="song-play-number"
                      onClick={(event) => {
                        event.stopPropagation();

                        handlePlaySong(
                          song,
                        );
                      }}
                      aria-label={
                        active && isPlaying
                          ? `Pause ${song.title}`
                          : `Play ${song.title}`
                      }
                    >
                      <span className="song-number">
                        {index + 1}
                      </span>

                      <span className="song-play-icon">
                        <Play
                          size={15}
                          fill="currentColor"
                        />
                      </span>
                    </button>


                    {/* Song info */}

                    <div className="song-info">
                      <h3>
                        {song.title}
                      </h3>

                      <p>
                        {song.artist}
                      </p>
                    </div>


                    {/* Duration */}

                    <span className="song-duration">
                      {song.duration}
                    </span>


                    {/* Actions */}

                    <div className="song-actions">

                      <button
                        type="button"
                        className={`song-action-button ${
                          liked
                            ? "active"
                            : ""
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();

                          toggleLikeSong(
                            song,
                          );
                        }}
                        aria-label={
                          liked
                            ? `Unlike ${song.title}`
                            : `Like ${song.title}`
                        }
                        title={
                          liked
                            ? "Unlike"
                            : "Like"
                        }
                      >
                        <Heart
                          size={18}
                          fill={
                            liked
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>


                      <button
                        type="button"
                        className="song-action-button"
                        onClick={(event) => {
                          event.stopPropagation();

                          setSelectedSong(
                            song,
                          );
                        }}
                        aria-label={`Add ${song.title} to playlist`}
                        title="Add to playlist"
                      >
                        <ListPlus size={18} />
                      </button>

                    </div>

                  </div>
                );
              },
            )}

          </div>
        )}

      </section>


      {/* Playlist picker */}

      {selectedSong && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedSong(null)
          }
        >

          <div
            className="playlist-picker"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="playlist-picker-header">

              <div>
                <p className="playlist-picker-kicker">
                  Add song
                </p>

                <h2>
                  {selectedSong.title}
                </h2>

                <p>
                  {selectedSong.artist}
                </p>
              </div>

              <button
                type="button"
                className="playlist-picker-close"
                onClick={() =>
                  setSelectedSong(null)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            {playlists.length === 0 ? (
              <div className="playlist-picker-empty">

                <p>
                  You don't have any
                  playlists yet.
                </p>

                <Link
                  to="/playlists"
                  className="primary-button"
                  onClick={() =>
                    setSelectedSong(null)
                  }
                >
                  Create a playlist
                </Link>

              </div>
            ) : (

              <div className="playlist-picker-list">

                {playlists.map(
                  (playlist) => {
                    const alreadyAdded =
                      playlist.songs.some(
                        (item) =>
                          item.id ===
                          selectedSong.id,
                      );

                    return (
                      <button
                        type="button"
                        className="playlist-picker-item"
                        key={playlist.id}
                        disabled={
                          alreadyAdded
                        }
                        onClick={() =>
                          handleAddToPlaylist(
                            playlist.id,
                            selectedSong,
                          )
                        }
                      >

                        <div className="playlist-picker-icon">
                          <ListPlus
                            size={18}
                          />
                        </div>

                        <div>
                          <strong>
                            {playlist.name}
                          </strong>

                          <span>
                            {
                              playlist
                                .songs
                                .length
                            }{" "}
                            {playlist
                              .songs
                              .length === 1
                              ? "song"
                              : "songs"}
                          </span>
                        </div>

                        <span className="playlist-picker-status">
                          {alreadyAdded
                            ? "Added"
                            : "Add"}
                        </span>

                      </button>
                    );
                  },
                )}

              </div>
            )}

            {playlists.length > 0 && (
              <Link
                to="/playlists"
                className="playlist-picker-create"
                onClick={() =>
                  setSelectedSong(null)
                }
              >
                + Create a new playlist
              </Link>
            )}

          </div>

        </div>
      )}

    </section>
  );
}

export default Album;