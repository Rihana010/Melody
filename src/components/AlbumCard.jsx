import { Link } from "react-router-dom";
import { Play } from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

function AlbumCard({ album }) {
  const { playSong } = usePlayer();

  const handlePlay = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!album.songs || album.songs.length === 0) {
      return;
    }

    playSong(album.songs[0], album.songs);
  };

  return (
    <Link
      to={`/album/${album.id}`}
      className="music-card"
    >
      <div className="cover-placeholder album-card-cover">
        <img
          src={album.cover}
          alt={album.title}
        />

        {album.songs && album.songs.length > 0 && (
          <button
            type="button"
            className="album-card-play"
            onClick={handlePlay}
            aria-label={`Play ${album.title}`}
          >
            <Play
              size={19}
              fill="currentColor"
            />
          </button>
        )}
      </div>

      <h3>{album.title}</h3>
      <p>{album.artist}</p>
    </Link>
  );
}

export default AlbumCard;