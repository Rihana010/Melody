import { Link } from "react-router-dom";
import {
  Play,
  Clock3,
  ListMusic,
} from "lucide-react";

import { albums } from "../data/mockData";
import AlbumCard from "../components/AlbumCard";

import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";
import { usePlaylists } from "../context/PlaylistContext";

function Home() {
  const { library } = useLibrary();
  const { currentSong, isPlaying, playSong } =
    usePlayer();
  const { playlists } = usePlaylists();

  const recentlyPlayed =
    library.recentlyPlayed.slice(0, 6);

  const featuredAlbums =
    albums.slice(0, 6);

  const handlePlaySong = (song) => {
    playSong(song, [song]);
  };

  return (
    <section className="home-page">

      {/* Welcome */}

      <header className="home-header">
        <div>
          <p className="eyebrow">
            Good evening
          </p>

          <h1>
            Listen to something you like.
          </h1>

          <p className="home-subtitle">
            Your music, your playlists,
            your library.
          </p>
        </div>
      </header>


      {/* Recently Played */}

      <section className="music-section">
        <div className="section-header home-section-header">
          <div>
            <p className="section-kicker">
              Pick up where you left off
            </p>

            <h2>Recently played</h2>
          </div>

          {recentlyPlayed.length > 0 && (
            <Link
              to="/library"
              className="section-link"
            >
              View all
            </Link>
          )}
        </div>

        {recentlyPlayed.length === 0 ? (
          <div className="home-empty">
            <Clock3 size={22} />

            <div>
              <h3>
                Nothing here yet
              </h3>

              <p>
                Start playing music and
                your recent tracks will
                appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="home-recent-list">
            {recentlyPlayed.map((song) => {
              const active =
                currentSong?.id === song.id;

              return (
                <button
                  type="button"
                  className={`home-recent-item ${
                    active ? "active" : ""
                  }`}
                  key={song.id}
                  onClick={() =>
                    handlePlaySong(song)
                  }
                  aria-label={
                    active && isPlaying
                      ? `Play ${song.title}`
                      : `Play ${song.title}`
                  }
                >
                  <div className="home-recent-cover">
                    <img
                      src={song.cover}
                      alt=""
                    />

                    <span className="home-recent-play">
                      {active &&
                      isPlaying ? (
                        <span className="home-playing-indicator">
                          •••
                        </span>
                      ) : (
                        <Play
                          size={16}
                          fill="currentColor"
                        />
                      )}
                    </span>
                  </div>

                  <div className="home-recent-info">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>


      {/* Featured Albums */}

      <section className="music-section">
        <div className="section-header home-section-header">
          <div>
            <p className="section-kicker">
              Explore
            </p>

            <h2>Featured albums</h2>
          </div>
        </div>

        <div className="card-grid">
          {featuredAlbums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
            />
          ))}
        </div>
      </section>


      {/* Playlists */}

      <section className="music-section">
        <div className="section-header home-section-header">
          <div>
            <p className="section-kicker">
              Your collection
            </p>

            <h2>Your playlists</h2>
          </div>

          <Link
            to="/playlists"
            className="section-link"
          >
            View all
          </Link>
        </div>

        {playlists.length === 0 ? (
          <Link
            to="/playlists"
            className="home-create-playlist"
          >
            <div className="home-create-playlist-icon">
              <ListMusic size={26} />
            </div>

            <div>
              <h3>
                Create your first playlist
              </h3>

              <p>
                Put your favorite songs
                together.
              </p>
            </div>
          </Link>
        ) : (
          <div className="home-playlist-grid">
            {playlists
              .slice(0, 4)
              .map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="home-playlist-card"
                >
                  <div className="home-playlist-cover">
                    <ListMusic size={32} />
                  </div>

                  <div>
                    <h3>
                      {playlist.name}
                    </h3>

                    <p>
                      {playlist.songs.length}{" "}
                      {playlist.songs.length ===
                      1
                        ? "song"
                        : "songs"}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </section>

    </section>
  );
}

export default Home;