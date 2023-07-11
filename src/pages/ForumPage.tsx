import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { Avatar, IconButton, Typography, Card, CardContent, Box, TextField, Button } from "@mui/material";
import { Heart, Star, Trash } from "iconsax-react";
import forumStore, { Post } from "../store/ForumStore";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import authStore from "../store/AuthStore";
import { useNavigate } from "react-router";
import CommentSection from "../components/forum/CommentSection";
import '../styles/main.scss'

const ForumPage = observer(() => {
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
        comments: []
      });

      const post: Post = {
        title: forumStore.title,
        details: forumStore.details,
        author: auth.currentUser?.displayName!,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
        comments: []
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
      const updatedPosts = forumStore.posts.filter((post) => post.id !== postId);
      forumStore.setPosts(updatedPosts);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to remove post currently. Try again later",
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

  const sortedPosts = forumStore.posts.slice().sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div style={{ display: 'flex' }}>

{authStore.user && (
  <Box style={{ flex: 1 }}>
    <Card style={{ margin: '2vw 0 1vw 2vw', border: '0.1vw solid black', borderRadius: '1vw' }}>
      <CardContent>
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            fontSize: "1.2vw",
            textAlign: "center",
            fontFamily: "Montserrat",
            wordWrap: "break-word",
            margin: "1vw",
          }}
        >
          <Avatar
            className="account-picture"
            src={auth.currentUser?.photoURL || ""}
            alt={auth.currentUser?.displayName || ""}
            sx={{ margin: "0.4vw", width: '5vw', height: '5vw' }}
          />
          {auth.currentUser?.displayName}
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            placeholder="Title"
            value={forumStore.title}
            onChange={(e) => forumStore.setTitle(e.target.value)}
            sx={{my: '1vw', width: '100%', backgroundColor: '#F5F5F5'}}
          />
          <TextField
            multiline
            inputProps={{ maxLength: 3000 }}
            placeholder="Details"
            value={forumStore.details}
            onChange={(e) => forumStore.setDetails(e.target.value)}
            sx={{my: '1vw', width: '100%', backgroundColor: '#F5F5F5'}}
          />
          {forumStore.errorMessage && <Typography style={{ color: 'red' }}>{forumStore.errorMessage}</Typography>}
          <Button type="submit" sx={{backgroundColor: 'blue', color: 'white', px: '3vw'}}>Post</Button>
        </form>
        <Typography variant="h6" className="sidebar-item" onClick={() => navigate("/favourites")}>
          <Heart size={16} style={{ marginLeft: '0.5vw' }} />
          Favourites
        </Typography>
      </CardContent>
    </Card>
  </Box>
)}

      <Box style={{ flex: 3 }}>
        {sortedPosts.map((post) => (
          <Card key={post.timestamp} style={{ margin: '2vw', border: '0.1vw solid black', borderRadius: '1vw' }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  className="sidebar-picture"
                  src={post.authorImage!}
                  alt={post.author!}
                />
                {post.author === auth.currentUser?.displayName && (
                  <IconButton onClick={() => handleDelete(post.id!)}>
                    <Trash />
                  </IconButton>
                )}
                <IconButton onClick={() => forumStore.handleFavorite(post.id!)}>
                  <Star
                    color={post.isFavorite ? "yellow" : "gray"}
                  />
                </IconButton>
              </div>
              <Typography variant="h6" component="h3">{post.title}</Typography>
              <Typography variant="body1" component="p">{post.details}</Typography>
              <Typography variant="body2" component="p">Author: {post.author}</Typography>
              <Typography variant="body2" component="p">{formatTimestamp(post.timestamp)}</Typography>
              <CommentSection postId={post.id!}/>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
});

export default ForumPage;
