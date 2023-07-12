import { observer } from "mobx-react-lite";
import { Avatar, Box, Typography } from "@mui/material";
import forumStore from "../store/ForumStore";
import { useEffect } from "react";
import { auth } from "../firebase";
import { Clock } from "iconsax-react";

const FavoritesPage = observer(() => {

  useEffect(() => {
    if (auth.currentUser) {
      forumStore.getUserFavourites()
    }
  }, [forumStore.userFavourites]);

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
  // console.log(forumStore.userFavourites);  

  return (
    <div>
      <Typography variant="h6" sx={{fontFamily: 'Roboto', 
    borderBottom: '1px solid #888', margin: '20px'}}>Favorite Posts</Typography>
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
            {/* <IconButton onClick={() => forumStore.handleFavorite(post.id!)}>
            <Star
              color={post.isFavorite ? "yellow" : "gray"}
            />
          </IconButton> */}
          </div>
        ))
      ) : (
        <Box style={{height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '60px'}}>
        <Clock size={300}/>
        <Typography variant="h6" style={{margin: '15px'}}>No favourite posts yet. Check out our forum page</Typography>
        </Box>
      )}
    </div>
  );
});

export default FavoritesPage;
