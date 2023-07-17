import { observer } from "mobx-react-lite";
import { Avatar, Box, IconButton, Typography, Card } from "@mui/material";
import forumStore from "../store/ForumStore";
import { useEffect } from "react";
import { auth } from "../firebase";
import { Clock, Heart, Trash } from "iconsax-react";

const FavoritesPage = observer(() => {
  useEffect(() => {
    if (auth.currentUser) {
      forumStore.getUserFavourites();
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
      <Typography variant="h6" className="account-title">
        Favorite Posts
      </Typography>
      {forumStore.userFavourites.length > 0 ? (
        forumStore.userFavourites.map((post) => (
          <div key={post.id}>
            <Card className="forumfave-card">
              <Box className="forum-right-box">
                <Avatar
                  className="forum-right-picture"
                  src={post.authorImage!}
                  alt={post.author!}
                />
                <Typography variant="body1" component="p">
                  {post.author}
                </Typography>
              </Box>
              <Box className="forumfave-textbox">
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
                <Typography
                  variant="body2"
                  component="p"
                  style={{ fontSize: "12px" }}
                >
                  {formatTimestamp(post.timestamp)}
                </Typography>
                <Box className="forum-right-faveicon">
                  <Typography
                    variant="body2"
                    component="p"
                    style={{ fontSize: "12px" }}
                  >
                    <IconButton
                      onClick={() => forumStore.handleFavorite(post.id!)}
                    >
                      <Heart variant="Bold" color="#0033ff" />
                    </IconButton>
                  </Typography>
                </Box>
              </Box>
              {post.comments
                ?.slice()
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((comment) => (
                  <Card className="forum-comments-card">
                    <Box className="forum-comments-box">
                      <Avatar
                        className="forum-comments-picture"
                        src={comment.authorImage!}
                        alt={comment.author!}
                      />
                      <Typography
                        variant="body1"
                        component="p"
                        style={{ fontSize: "12px" }}
                      >
                        {comment.author}
                      </Typography>
                    </Box>
                    <Box className="forum-comments-txt">
                      <Typography
                        style={{ width: "100%", wordBreak: "break-word" }}
                        variant="body1"
                        component="p"
                      >
                        {comment.content}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        style={{ fontSize: "12px" }}
                      >
                        {formatTimestamp(comment.timestamp)}
                      </Typography>
                      <Box className="forum-comments-delete">
                        {comment.author === auth.currentUser?.displayName && (
                          <IconButton
                            onClick={() =>
                              forumStore.handleDeleteComment(
                                post.id!,
                                comment.id!
                              )
                            }
                          >
                            <Trash color="gray" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Card>
                ))}
            </Card>
          </div>
        ))
      ) : (
        <Box className="forumfave-empty">
          <Clock size={280} color="gray" />
          <Typography variant="h6" style={{ margin: "15px" }}>
            No favourite posts yet. Check out our forum page
          </Typography>
        </Box>
      )}
    </div>
  );
});

export default FavoritesPage;
