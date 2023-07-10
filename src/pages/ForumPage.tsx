import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { Avatar, IconButton, Typography } from "@mui/material";
import { Heart, Star, Trash } from "iconsax-react";
import forumStore, { Post } from "../store/ForumStore";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import authStore from "../store/AuthStore";
import { useNavigate } from "react-router";

const ForumPage = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    forumStore.initializePosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forumStore.title || !forumStore.details) {
      // Handle form validation, show an error message if fields are empty
      return;
    }
    try {
      await addDoc(collection(db, "posts"), {
        title: forumStore.title,
        details: forumStore.details,
        author: auth.currentUser?.displayName,
        authorImage: auth.currentUser?.photoURL,
        timestamp: Date.now(),
      });

      const post: Post = {
        title: forumStore.title,
        details: forumStore.details,
        author: auth.currentUser?.displayName!,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
      };
      forumStore.setPosts([...forumStore.posts, post]);

      forumStore.setTitle("");
      forumStore.setDetails("");
    } catch (error) {
      // Handle error while creating the post
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      const updatedPosts = forumStore.posts.filter((post) => post.id !== postId);
      forumStore.setPosts(updatedPosts);
    } catch (error) {
      // Handle error while deleting the post
    }
  };

  // const handleFavorite = (postId: string) => {
  //   const post = forumStore.posts.find((p) => p.id === postId);
  //   if (post) {
  //     if (post.isFavorite) {
  //       forumStore.unmarkAsFavorite(postId);
  //     } else {
  //       forumStore.markAsFavorite(postId);
  //     }
  //   }
  // };

  // const handleFavorite = async (postId: string) => {
  //   if (!auth.currentUser) {
  //     // User is not logged in, handle accordingly
  //     return;
  //   }

  //   const post = forumStore.posts.find((p) => p.id === postId);
  //   if (post) {
  //     if (post.isFavorite) {
  //       try {
  //         await deleteDoc(doc(db, "users", auth.currentUser!.uid, "favorites", postId));
  //         forumStore.unmarkAsFavorite(postId);
  //       } catch (error) {
  //         // Handle error while removing from favorites
  //       }
  //     } else {
  //       try {
  //         post.isFavorite = true;
  //         await setDoc(doc(db, "users", auth.currentUser!.uid, "favorites", postId), post);
  //         forumStore.markAsFavorite(postId);
  //       } catch (error) {
  //         // Handle error while adding to favorites
  //       }
  //     }
  //   }
  // };

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
    <div style={{display: 'flex'}}>
      {authStore.user && <div style={{flex: 1}}>
      <span
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
        </span>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={forumStore.title}
          onChange={(e) => forumStore.setTitle(e.target.value)}
        />
        <textarea maxLength={3000}
          placeholder="Details"
          value={forumStore.details}
          onChange={(e) => forumStore.setDetails(e.target.value)}
        ></textarea>
        {forumStore.errorMessage && <div style={{ color: 'red' }}>{forumStore.errorMessage}</div>}
        <button type="submit">Submit</button>
      </form>
      <Typography variant="h6" className="sidebar-item" onClick={() => navigate("/favourites")}>Check Favourites<Heart size={16} style={{marginLeft: '0.5vw'}}/></Typography>
          </div>}
          <div style={{flex: 3}}>
      {/* <h2>Posts</h2> */}
      {sortedPosts.map((post) => (
        <div key={post.timestamp}>
          <span style={{display: 'flex'}}><Avatar
            className="sidebar-picture"
            src={post.authorImage!}
            alt={post.author!}
          />{post.author === auth.currentUser?.displayName && (
            <IconButton onClick={() => handleDelete(post.id!)}>
              <Trash />
            </IconButton>
          )}
          <IconButton onClick={() => forumStore.handleFavorite(post.id!)}>
            <Star
              color={post.isFavorite ? "yellow" : "gray"}
            />
          </IconButton></span>
          <h3>{post.title}</h3>
          <p>{post.details}</p>
          <p>Author: {post.author}</p>
          <p>Posted on: {formatTimestamp(post.timestamp)}</p>
        </div>
      ))}</div>
    </div>
  );
});

export default ForumPage;
