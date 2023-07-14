import { collection, addDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import {
  Avatar,
  IconButton,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { Heart, Trash } from "iconsax-react";
import forumStore, { Post } from "../store/ForumStore";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import authStore from "../store/AuthStore";
import { useNavigate } from "react-router";
import "../styles/main.scss";

const ForumPage = observer(() => {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    forumStore.initializePosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forumStore.title || !forumStore.details) {
      authStore.setAlert({
        open: true,
        message: "Please input title and details",
        type: "error",
      });
      return;
    }
    try {
      await addDoc(collection(db, "posts"), {
        title: forumStore.title,
        details: forumStore.details,
        author: auth.currentUser?.displayName,
        authorImage: auth.currentUser?.photoURL,
        timestamp: Date.now(),
        comments: [],
      });

      const post: Post = {
        title: forumStore.title,
        details: forumStore.details,
        author: auth.currentUser?.displayName!,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
        comments: [],
      };
      forumStore.setPosts([...forumStore.posts, post]);

      forumStore.setTitle("");
      forumStore.setDetails("");
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to create post currently. Try again later",
        type: "error",
      });
    }
  };

    const formatTimestamp = (timestamp: number) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - timestamp;

    if (timeDiff < 60000) {
      return `Less than 1 minute ago`;
    } else if (timeDiff < 3600000) {
      return `${Math.floor(timeDiff / 60000)} minute${Math.floor(timeDiff / 60000) !== 1 ? 's' : ''} ago`;
    } else if (timeDiff < 86400000) {
      return `${Math.floor(timeDiff / 3600000)} hour${Math.floor(timeDiff / 3600000) !== 1 ? 's' : ''} ago`;
    } else {
      return `${Math.floor(timeDiff / 86400000)} day${Math.floor(timeDiff / 86400000) !== 1 ? 's' : ''} ago`;
    }
  };

  const sortedPosts = forumStore.posts
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div style={{ display: "flex", flexDirection: 'row' }} className="forum-main">
      {authStore.user && (
        <Box style={{ flex: 1 }}>
          <Card className="forum-left-card"
            style={{
              margin: "2vw 0 1vw 2vw",
              border: "0.1vw solid black",
              borderRadius: "10px",
            }}
          >
            <CardContent>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  // fontSize: "1.2vw",
                  textAlign: "center",
                  fontFamily: "Roboto",
                  // wordWrap: "break-word",
                  margin: "10px",
                }}
              >
                <Avatar
                  className="account-picture"
                  src={auth.currentUser?.photoURL || ""}
                  alt={auth.currentUser?.displayName || ""}
                  sx={{ width: "60px", height: "60px" }}
                />
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    marginLeft: "10px",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{
                      color: theme.palette.text.primary,
                    }}
                  >
                    {auth.currentUser?.displayName}
                  </Typography>
                 
                </Box>
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  type="textarea"
                  variant="filled"
                  inputProps={{ maxTitle: 80 }}
                  label="Title"
                  value={forumStore.title}
                  onChange={(e) => forumStore.setTitle(e.target.value)}
                  sx={{ my: "10px", width: "100%" }}
                />
                {forumStore.errorTitle && (
                  <Typography style={{ color: "red" }}>
                    {forumStore.errorTitle}
                  </Typography>
                )}
                <TextField
                  multiline
                  type="textarea"
                  inputProps={{ maxLength: 3000 }}
                  label="Details"
                  variant="filled"
                  value={forumStore.details}
                  onChange={(e) => forumStore.setDetails(e.target.value)}
                  sx={{
                    my: "10px",
                    width: "100%",
                    maxHeight: "8em",
                    overflowY: "auto",
                  }}
                />
                <Typography
                  style={{
                    fontSize: "12px",
                    color:
                      forumStore.details.length === 3000
                        ? "red"
                        : theme.palette.text.secondary,
                  }}
                >
                  {forumStore.details.length}/3000
                </Typography>
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    sx={{
                      backgroundColor: "#3366ff",
                      color: "white",
                      px: "3vw", height: '50px'
                    }}
                  >
                    Post
                  </Button>
                  
                </Box>
                <Typography
                    variant="body1"
                    style={{
                      cursor: "pointer",
                      marginTop: '20px',
                      paddingTop: '10px',
                      color: theme.palette.text.secondary,
                      borderTop: '1px solid grey'
                      // fontSize: '20px'
                    }}
                    onClick={() => navigate("/favourites")}
                  >
                    
                    <Heart size={20} style={{ margin: "0 5px" }} />Check Favourites
                  </Typography>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}

      <Box style={{ flex: 3 }}>
        {sortedPosts.map((post) => (
          <Card
            key={post.timestamp}
            style={{
              margin: "2vw",
              border: "0.1vw solid black",
              borderRadius: "10px",
              // display: 'flex', flexWrap: 'wrap'
            }}
          >
            <CardContent>
              <Box style={{ flexDirection: "row", display: "flex" }} className="forum-right-card">
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
                    width: "100%",
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
                      {post.commentCount} comment
                      {post.commentCount !== 1 ? "s" : ""}
                      <IconButton
                        onClick={() => forumStore.handleFavorite(post.id!)}
                      >
                        <Heart
                          variant={post.isFavorite ? "Bold" : "Outline"}
                          color={post.isFavorite ? "#0033ff" : "gray"}
                        />
                      </IconButton>
                    </Typography>
                    {post.author === auth.currentUser?.displayName && (
                        <IconButton onClick={() => forumStore.handleDelete(post.id!)}>
                          <Trash color="gray" />
                        </IconButton>
                      )}
                  </Box>
                </Box>
              </Box>
              {authStore.user && (
                <Box>
                  <form style={{display: 'flex'}} onSubmit={(e) => forumStore.handleSubmitComment(e, post.id!)}>
                    <TextField
                      multiline
                      inputProps={{ maxLength: 3000 }}
                      label="Share your thoughts.."
                      onChange={(e) => forumStore.setContent(e.target.value)}
                  variant="filled"
                  sx={{
                    my: "10px",
                    width: "100%",
                    maxHeight: "8em",
                    overflowY: "auto",
                  }}
                    />
                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: "#3366ff",
                        color: "white",
                        px: "30px", height: '56px', margin: '10px'
                      }}
                    >
                      Comment
                    </Button>
                  </form>
                </Box>
              )}
              {post.comments
                ?.slice()
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((comment) => (
                <Card style={{ display: "flex", margin: '10px 0' }}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: 'center',
                    flexDirection: "column",
                    margin: "20px",
                  }}
                >
                  <Avatar
                    style={{
                      width: "40px",
                      height: "40px",
                      marginBottom: "10px",
                    }}
                    className="sidebar-picture"
                    src={comment.authorImage!}
                    alt={comment.author!}
                  />
                  <Typography variant="body1" component="p" style={{fontSize: '12px'}}>
                    {comment.author}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    marginTop: '20px'
                  }}
                >
                  <Typography
                    style={{ width: "100%", wordBreak: "break-word" }}
                    variant="body1"
                    component="p"
                  >
                    {comment.content}
                  </Typography>
                  <Typography variant="body2" component="p" style={{fontSize: '12px'}}>
                    {formatTimestamp(comment.timestamp)}
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    {comment.author === auth.currentUser?.displayName && (
                        <IconButton onClick={() => forumStore.handleDeleteComment(post.id!, comment.id!)}>
                          <Trash color="gray" />
                        </IconButton>
                      )}
                  </Box>
                </Box>
              </Card>
                ))}
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
});

export default ForumPage;
