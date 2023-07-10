import { observer } from "mobx-react-lite";
import { Avatar } from "@mui/material";
import { Star } from "iconsax-react";
import forumStore from "../store/ForumStore";

const FavoritesPage = observer(() => {
  const favoritePosts = forumStore.getFavoritePosts();

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

  return (
    <div>
      <h2>Favorite Posts</h2>
      {favoritePosts.length > 0 ? (
        favoritePosts.map((post) => (
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
            <Star color="yellow" />
          </div>
        ))
      ) : (
        <p>No favorite posts yet.</p>
      )}
    </div>
  );
});

export default FavoritesPage;
