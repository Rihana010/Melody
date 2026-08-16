import { Link } from "react-router-dom";
import {
  Heart,
  Clock3,
  Disc3,
  ListMusic,
  Play,
  Trash2,
} from "lucide-react";

import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";
import { usePlaylists } from "../context/PlaylistContext";

function Library() {
  const {
    library,
    toggleLikeSong,
    toggleSaveAlbum,
    clearRecentlyPlayed,
  } = useLibrary();

  const {
    currentSong,
    isPlaying,
    playSong,
  } = usePlayer();

  const { playlists } =
    usePlaylists();

  const handlePlaySong = (
    song,
    songs,
  ) => {
    playSong(song, songs);
  };

  const handleSongRowClick = (
    song,
    songs,
  ) => {
    handlePlaySong(song, songs);
  };

  return (
    <section className="library-page">

      {/* Header */}

      <header className="library-header">
        <div>
          <p className="eyebrow">
            Your music
          </p>

          <h1>Your Library</h1>

          <p className="library-subtitle">
            Everything you've saved
            and played.
          </p>
        </div>
      </header>


      {/* =========================
          LIKED SONGS
          ========================= */}

      <section className="library-section">

        <div className="library-section-header">

          <div>
            <p className="library-kicker">
              Collection
            </p>

            <h2>
              Liked Songs
            </h2>
          </div>

          <span className="library-count">
            {library.likedSongs.length}
          </span>

        </div>


        {library.likedSongs.length ===
        0 ? (
          <div className="library-empty">

            <div className="library-empty-icon">
              <Heart size={22} />
            </div>

            <h3>
              Save songs you love
            </h3>

            <p>
              Songs you like will
              appear here.
            </p>

          </div>
        ) : (

          <div className="library-song-list">

            {library.likedSongs.map(
              (song) => {
                const active =
                  currentSong?.id ===
                  song.id;

                return (
                  <div
                    className={`library-song-row ${
                      active
                        ? "active"
                        : ""
                    }`}
                    key={song.id}
                    onClick={() =>
                      handleSongRowClick(
                        song,
                        library.likedSongs,
                      )
                    }
                  >

                    <button
                      type="button"
                      className="library-song-play"
                      onClick={(event) => {
                        event.stopPropagation();

                        handlePlaySong(
                          song,
                          library.likedSongs,
                        );
                      }}
                      aria-label={
                        active && isPlaying
                          ? `Pause ${song.title}`
                          : `Play ${song.title}`
                      }
                    >
                      {active &&
                      isPlaying ? (
                        <span>
                          •••
                        </span>
                      ) : (
                        <Play
                          size={14}
                          fill="currentColor"
                        />
                      )}
                    </button>


                    <img
                      src={song.cover}
                      alt=""
                      className="library-song-cover"
                    />


                    <div className="library-song-info">
                      <h3>
                        {song.title}
                      </h3>

                      <p>
                        {song.artist}
                      </p>
                    </div>


                    <button
                      type="button"
                      className="library-like-button active"
                      onClick={(event) => {
                        event.stopPropagation();

                        toggleLikeSong(
                          song,
                        );
                      }}
                      aria-label={`Unlike ${song.title}`}
                    >
                      <Heart
                        size={18}
                        fill="currentColor"
                      />
                    </button>

                  </div>
                );
              },
            )}

          </div>
        )}

      </section>


      {/* =========================
          PLAYLISTS
          ========================= */}

      <section className="library-section">

        <div className="library-section-header">

          <div>
            <p className="library-kicker">
              Collection
            </p>

            <h2>
              Your Playlists
            </h2>
          </div>

          <Link
            to="/playlists"
            className="library-view-all"
          >
            View all
          </Link>

        </div>


        {playlists.length === 0 ? (
          <div className="library-empty">

            <div className="library-empty-icon">
              <ListMusic size={22} />
            </div>

            <h3>
              Create your first
              playlist
            </h3>

            <p>
              Organize your favorite
              songs into custom
              playlists.
            </p>

            <Link
              to="/playlists"
              className="primary-button"
            >
              Create playlist
            </Link>

          </div>
        ) : (

          <div className="library-playlist-grid">

            {playlists
              .slice(0, 6)
              .map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="library-playlist-card"
                >

                  <div className="library-playlist-cover">
                    <ListMusic size={36} />
                  </div>

                  <div>
                    <h3>
                      {playlist.name}
                    </h3>

                    <p>
                      {
                        playlist.songs
                          .length
                      }{" "}
                      {
                        playlist.songs
                          .length === 1
                          ? "song"
                          : "songs"
                      }
                    </p>
                  </div>

                </Link>
              ))}

          </div>
        )}

      </section>


      {/* =========================
          SAVED ALBUMS
          ========================= */}

      <section className="library-section">

        <div className="library-section-header">

          <div>
            <p className="library-kicker">
              Collection
            </p>

            <h2>
              Saved Albums
            </h2>
          </div>

          <span className="library-count">
            {library.savedAlbums.length}
          </span>

        </div>


        {library.savedAlbums.length ===
        0 ? (
          <div className="library-empty">

            <div className="library-empty-icon">
              <Disc3 size={22} />
            </div>

            <h3>
              Save albums for later
            </h3>

            <p>
              Albums you save will
              appear here.
            </p>

          </div>
        ) : (

          <div className="card-grid">

            {library.savedAlbums.map(
              (album) => (
                <div
                  className="library-album-card"
                  key={album.id}
                >

                  <Link
                    to={`/album/${album.id}`}
                    className="library-album-link"
                  >

                    <div className="cover-placeholder">
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

                  <button
                    type="button"
                    className="library-save-button active"
                    onClick={() =>
                      toggleSaveAlbum(
                        album,
                      )
                    }
                  >
                    Saved
                  </button>

                </div>
              ),
            )}

          </div>
        )}

      </section>


      {/* =========================
          RECENTLY PLAYED
          ========================= */}

      <section className="library-section">

        <div className="library-section-header">

          <div>
            <p className="library-kicker">
              History
            </p>

            <h2>
              Recently Played
            </h2>
          </div>

          {library.recentlyPlayed
            .length > 0 && (
            <button
              type="button"
              className="library-clear-button"
              onClick={
                clearRecentlyPlayed
              }
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}

        </div>


        {library.recentlyPlayed.length ===
        0 ? (
          <div className="library-empty">

            <div className="library-empty-icon">
              <Clock3 size={22} />
            </div>

            <h3>
              Your history is empty
            </h3>

            <p>
              Songs you play will
              show up here.
            </p>

          </div>
        ) : (

          <div className="library-song-list">

            {library.recentlyPlayed.map(
              (song) => {
                const active =
                  currentSong?.id ===
                  song.id;

                return (
                  <div
                    className={`library-song-row ${
                      active
                        ? "active"
                        : ""
                    }`}
                    key={song.id}
                    onClick={() =>
                      handleSongRowClick(
                        song,
                        library.recentlyPlayed,
                      )
                    }
                  >

                    <button
                      type="button"
                      className="library-song-play"
                      onClick={(event) => {
                        event.stopPropagation();

                        handlePlaySong(
                          song,
                          library.recentlyPlayed,
                        );
                      }}
                      aria-label={
                        active && isPlaying
                          ? `Pause ${song.title}`
                          : `Play ${song.title}`
                      }
                    >
                      {active &&
                      isPlaying ? (
                        <span>
                          •••
                        </span>
                      ) : (
                        <Play
                          size={14}
                          fill="currentColor"
                        />
                      )}
                    </button>


                    <img
                      src={song.cover}
                      alt=""
                      className="library-song-cover"
                    />


                    <div className="library-song-info">
                      <h3>
                        {song.title}
                      </h3>

                      <p>
                        {song.artist}
                      </p>
                    </div>

                  </div>
                );
              },
            )}

          </div>
        )}

      </section>

    </section>
  );
}

export default Library;