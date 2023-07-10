import { observer } from "mobx-react-lite";
import { Avatar, IconButton } from "@mui/material";
import { Star } from "iconsax-react";
import forumStore from "../store/ForumStore";
import { useEffect } from "react";
import { auth } from "../firebase";

const FavoritesPage = observer(() => {
//   const favoritePosts = forumStore.getFavoritePosts();

  useEffect(() => {
    if (auth.currentUser) {
      forumStore.getUserFavourites()
    }
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - timestamp;
  
    if (timeDiff < 60000) {
      return `Less than 1 minute ago`;
    } else if (timeDiff < 3600000) {
      return `${Math.floor(timeDiff / 60000)} minute(s) ago`;
    } else if (timeDiff < 86400000) {
      return `${Math.floor(timeDiff / 3600000)} hour(s) ago`;
    } else {
      return `${Math.floor(timeDiff / 86400000)} day(s) ago`;
    }
  };

  console.log(forumStore.userFavourites);
  

  return (
    <div>
      <h2>Favorite Posts</h2>
      {forumStore.userFavourites.length > 0 ? (
        forumStore.userFavourites.map((post) => (
          <div key={post.id}>
            <Avatar
              className="sidebar-picture"
              src={post.authorImage!}
              alt={post.author!}
            />
            <h3>{post.title}</h3>
            <p>{post.details}</p>
            <p>Author: {post.author}</p>
            <p>Posted on: {formatTimestamp(post.timestamp)}</p>
            <IconButton onClick={() => forumStore.handleFavorite(post.id!)}>
            <Star
              color={post.isFavorite ? "yellow" : "gray"}
            />
          </IconButton>
          </div>
        ))
      ) : (
        <p>No favorite posts yet.</p>
      )}
    </div>
  );
});

export default FavoritesPage;
