import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
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
import { ArrowRight2, Heart, Trash } from "iconsax-react";
import forumStore, { Comment, Post } from "../store/ForumStore";
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

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      const updatedPosts = forumStore.posts.filter(
        (post) => post.id !== postId
      );
      forumStore.setPosts(updatedPosts);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to remove post currently. Try again later",
        type: "error",
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();

    if (!forumStore.content) {
      authStore.setAlert({
        open: true,
        message: "Please input content",
        type: "error",
      });
      return;
    }

    try {
      const commentData = {
        postId: postId,
        content: forumStore.content,
        author: auth.currentUser?.displayName,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
      };

      const docRef = await addDoc(
        collection(db, "posts", postId, "comments"),
        commentData
      );

      const comment: Comment = {
        id: docRef.id,
        ...commentData,
      };

      const updatedPosts = forumStore.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), comment],
          };
        }
        return post;
      });

      forumStore.setPosts(updatedPosts);
      forumStore.setContent("");
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to leave a comment currently. Try again later",
        type: "error",
      });
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));

      const updatedPosts = forumStore.posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments?.filter(
            (comment) => comment.id !== commentId
          );
          return {
            ...post,
            comments: updatedComments,
          };
        }
        return post;
      });

      forumStore.setPosts(updatedPosts);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to remove comment currently. Try again later",
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
      return `${Math.floor(timeDiff / 60000)} minute(s) ago`;
    } else if (timeDiff < 86400000) {
      return `${Math.floor(timeDiff / 3600000)} hour(s) ago`;
    } else {
      return `${Math.floor(timeDiff / 86400000)} day(s) ago`;
    }
  };

  const sortedPosts = forumStore.posts
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div style={{ display: "flex" }}>
      {authStore.user && (
        <Box style={{ flex: 1 }}>
          <Card
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
                  <Typography
                    variant="body1"
                    style={{
                      cursor: "pointer",
                      color: theme.palette.text.secondary,
                    }}
                    onClick={() => navigate("/favourites")}
                  >
                    Check Favourites
                    <ArrowRight2 size={16} style={{ margin: "0 5px" }} />
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
              <Box style={{ display: "flex" }}>
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
                  <Typography variant="body2" component="p">
                    {formatTimestamp(post.timestamp)}
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography variant="body2" component="p">
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
                      {post.author === auth.currentUser?.displayName && (
                        <IconButton onClick={() => handleDelete(post.id!)}>
                          <Trash color="gray" />
                        </IconButton>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {authStore.user && (
                <Box>
                  <form style={{display: 'flex'}} onSubmit={(e) => handleSubmitComment(e, post.id!)}>
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
                  <Card
                    key={comment.id}
                    style={{
                      margin: "10px",
                      backgroundColor: theme.palette.background.paper
                      // border: "0.1vw solid transparent",
                      // borderRadius: "1vw",
                    }}
                  >
                    <CardContent>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          className="sidebar-picture"
                          src={comment.authorImage!}
                          alt={comment.author!}
                        />
                        {comment.author === auth.currentUser?.displayName && (
                          <IconButton
                            onClick={() =>
                              handleDeleteComment(post.id!, comment.id!)
                            }
                          >
                            <Trash />
                          </IconButton>
                        )}
                      </div>
                      <Typography variant="body1" component="p">
                        {comment.content}
                      </Typography>
                      <Typography variant="body2" component="p">
                        Author: {comment.author}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {formatTimestamp(comment.timestamp)}
                      </Typography>
                    </CardContent>
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
