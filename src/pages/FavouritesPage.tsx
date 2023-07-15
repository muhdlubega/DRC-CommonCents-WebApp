import { observer } from "mobx-react-lite";
import { Avatar, Box, IconButton, Typography, Card } from "@mui/material";
import forumStore from "../store/ForumStore";
import { useEffect } from "react";
import { auth } from "../firebase";
import { Clock, Heart } from "iconsax-react";

const FavoritesPage = observer(() => {
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

  return (
    <div>
      <Typography variant="h6" sx={{fontFamily: 'Roboto', 
    borderBottom: '1px solid #888', margin: '20px'}}>Favorite Posts</Typography>
      {forumStore.userFavourites.length > 0 ? (
        forumStore.userFavourites.map((post) => (
          <div key={post.id}>
            <Card style={{ flexDirection: "row", display: "flex", border: '1px solid black',margin: '20px' }} className="forum-right-card">
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "20px",
                  }}
                >
                  <Avatar
                    style={{
                      width: "100px",
                      height: "100px",
                      marginBottom: "10px",
                    }}
                    className="sidebar-picture"
                    src={post.authorImage!}
                    alt={post.author!}
                  />
                  <Typography variant="body1" component="p">
                    {post.author}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%", margin: '20px 0'
                  }}
                >
                  <Typography variant="h6" component="h3">
                    {post.title}
                  </Typography>
                  <Typography
                    style={{ width: "100%", wordBreak: "break-word" }}
                    variant="body1"
                    component="p"
                  >
                    {post.details}
                  </Typography>
                  <Typography variant="body2" component="p" style={{fontSize: '12px'}}>
                    {formatTimestamp(post.timestamp)}
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography variant="body2" component="p" style={{fontSize: '12px'}}>
                      <IconButton
                        onClick={() => forumStore.handleFavorite(post.id!)}
                      >
                        <Heart
                          variant="Bold"
                          color="#0033ff"
                        />
                      </IconButton>
                    </Typography>
                  </Box>
                </Box>
              </Card>
          </div>
        ))
      ) : (
        <Box style={{height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '60px'}}>
        <Clock size={280} color="gray"/>
        <Typography variant="h6" style={{margin: '15px'}}>No favourite posts yet. Check out our forum page</Typography>
        </Box>
      )}
    </div>
  );
});

export default FavoritesPage;
