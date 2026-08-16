import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  Play,
  Heart,
  ListPlus,
  X,
} from "lucide-react";

import { albums } from "../data/mockData";
import { usePlayer } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import { usePlaylists } from "../context/PlaylistContext";

function Search() {
  const [query, setQuery] = useState("");
  const [selectedSong, setSelectedSong] =
    useState(null);

  const {
    currentSong,
    isPlaying,
    playSong,
  } = usePlayer();

  const {
    isSongLiked,
    toggleLikeSong,
  } = useLibrary();

  const {
    playlists,
    addSongToPlaylist,
  } = usePlaylists();

  /* =========================
     All songs
     ========================= */

  const songs = useMemo(() => {
    return albums.flatMap(
      (album) => album.songs || [],
    );
  }, []);

  const normalizedQuery =
    query.trim().toLowerCase();

  /* =========================
     Search results
     ========================= */

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return {
        songs: [],
        albums: [],
        artists: [],
      };
    }

    const matchingSongs = songs.filter(
      (song) => {
        const title =
          song.title?.toLowerCase() || "";

        const artist =
          song.artist?.toLowerCase() || "";

        const album =
          song.album?.toLowerCase() || "";

        return (
          title.includes(normalizedQuery) ||
          artist.includes(normalizedQuery) ||
          album.includes(normalizedQuery)
        );
      },
    );

    const matchingAlbums =
      albums.filter((album) => {
        const title =
          album.title?.toLowerCase() || "";

        const artist =
          album.artist?.toLowerCase() || "";

        return (
          title.includes(normalizedQuery) ||
          artist.includes(normalizedQuery)
        );
      });

    const artistMap = new Map();

    albums.forEach((album) => {
      const artist =
        album.artist?.toLowerCase() || "";

      if (
        artist.includes(normalizedQuery)
      ) {
        artistMap.set(
          album.artist,
          album,
        );
      }
    });

    return {
      songs: matchingSongs,
      albums: matchingAlbums,
      artists: [
        ...artistMap.values(),
      ],
    };
  }, [normalizedQuery, songs]);

  const hasResults =
    results.songs.length > 0 ||
    results.albums.length > 0 ||
    results.artists.length > 0;

  /* =========================
     Actions
     ========================= */

  const handlePlaySong = (song) => {
    playSong(song, songs);
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

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <section className="search-page">

      {/* =========================
          Header
          ========================= */}

      <header className="search-header">

        <p className="eyebrow">
          Find something
        </p>

        <h1>Search</h1>

        <div className="search-input-wrapper">

          <SearchIcon size={20} />

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="What do you want to listen to?"
            autoFocus
            aria-label="Search music"
          />

          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={17} />
            </button>
          )}

        </div>

      </header>


      {/* =========================
          Welcome
          ========================= */}

      {!normalizedQuery && (
        <div className="search-welcome">

          <SearchIcon size={28} />

          <h2>
            Search your music
          </h2>

          <p>
            Find songs, albums and artists
            from your library.
          </p>

        </div>
      )}


      {/* =========================
          No results
          ========================= */}

      {normalizedQuery &&
        !hasResults && (
          <div className="search-empty">

            <SearchIcon size={28} />

            <h2>
              No results found
            </h2>

            <p>
              We couldn't find anything
              matching "{query}".
            </p>

          </div>
        )}


      {/* =========================
          Results
          ========================= */}

      {hasResults && (
        <div className="search-results">

          {/* =====================
              Songs
              ===================== */}

          {results.songs.length > 0 && (
            <section className="search-result-section">

              <div className="search-result-header">

                <h2>Songs</h2>

                <span>
                  {results.songs.length}
                </span>

              </div>

              <div className="search-song-list">

                {results.songs
                  .slice(0, 12)
                  .map((song) => {
                    const liked =
                      isSongLiked(song.id);

                    const active =
                      currentSong?.id ===
                      song.id;

                    return (
                      <div
                        className={`search-song-row ${
                          active
                            ? "active"
                            : ""
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
                          className="search-song-play"
                          onClick={(event) => {
                            event.stopPropagation();

                            handlePlaySong(
                              song,
                            );
                          }}
                          aria-label={`Play ${song.title}`}
                          title={`Play ${song.title}`}
                        >
                          {active &&
                          isPlaying ? (
                            <span className="search-playing-indicator">
                              •••
                            </span>
                          ) : (
                            <Play
                              size={15}
                              fill="currentColor"
                            />
                          )}
                        </button>


                        {/* Cover */}

                        <img
                          src={song.cover}
                          alt=""
                          className="search-song-cover"
                        />


                        {/* Info */}

                        <div className="search-song-info">

                          <h3>
                            {song.title}
                          </h3>

                          <p>
                            {song.artist}
                          </p>

                        </div>


                        {/* Duration */}

                        <span className="search-song-duration">
                          {song.duration}
                        </span>


                        {/* Like */}

                        <button
                          type="button"
                          className={`search-action ${
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
                            size={17}
                            fill={
                              liked
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>


                        {/* Playlist */}

                        <button
                          type="button"
                          className="search-action"
                          onClick={(event) => {
                            event.stopPropagation();

                            setSelectedSong(
                              song,
                            );
                          }}
                          aria-label={`Add ${song.title} to playlist`}
                          title="Add to playlist"
                        >
                          <ListPlus
                            size={17}
                          />
                        </button>

                      </div>
                    );
                  })}

              </div>

            </section>
          )}


          {/* =====================
              Albums
              ===================== */}

          {results.albums.length > 0 && (
            <section className="search-result-section">

              <div className="search-result-header">

                <h2>Albums</h2>

                <span>
                  {results.albums.length}
                </span>

              </div>

              <div className="card-grid search-album-grid">

                {results.albums.map(
                  (album) => (
                    <Link
                      to={`/album/${album.id}`}
                      className="music-card"
                      key={album.id}
                    >

                      <div className="cover-placeholder album-card-cover">

                        <img
                          src={album.cover}
                          alt={album.title}
                        />

                      </div>

                      <h3>
                        {album.title}
                      </h3>

                      <p>
                        {album.artist}
                      </p>

                    </Link>
                  ),
                )}

              </div>

            </section>
          )}


          {/* =====================
              Artists
              ===================== */}

          {results.artists.length > 0 && (
            <section className="search-result-section">

              <div className="search-result-header">

                <h2>Artists</h2>

                <span>
                  {results.artists.length}
                </span>

              </div>

              <div className="search-artists">

                {results.artists.map(
                  (album) => (
                    <div
                      className="search-artist-card"
                      key={album.artist}
                    >

                      <div className="search-artist-avatar">

                        {album.cover ? (
                          <img
                            src={album.cover}
                            alt={album.artist}
                          />
                        ) : (
                          <span>
                            {album.artist
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}

                      </div>

                      <h3>
                        {album.artist}
                      </h3>

                      <p>
                        Artist
                      </p>

                    </div>
                  ),
                )}

              </div>

            </section>
          )}

        </div>
      )}


      {/* =========================
          Playlist picker
          ========================= */}

      {selectedSong && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedSong(null)
          }
        >

          <div
            className="playlist-picker"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-playlist-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="playlist-picker-header">

              <div>

                <p className="playlist-picker-kicker">
                  Add song
                </p>

                <h2 id="search-playlist-title">
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
                title="Close"
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
                  Create playlist
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

          </div>

        </div>
      )}

    </section>
  );
}

export default Search;