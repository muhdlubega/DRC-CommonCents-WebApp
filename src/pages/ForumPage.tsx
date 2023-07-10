import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { Avatar, IconButton } from "@mui/material";
import { Star, Trash } from "iconsax-react";
import forumStore, { Post } from "../store/ForumStore";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import authStore from "../store/AuthStore";

const ForumPage = observer(() => {
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

  const handleFavorite = (postId: string) => {
    const post = forumStore.posts.find((p) => p.id === postId);
    if (post) {
      if (post.isFavorite) {
        forumStore.unmarkAsFavorite(postId);
      } else {
        forumStore.markAsFavorite(postId);
      }
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
  
  return (
    <div>
      {authStore.user && <div><h1>Create a new post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={forumStore.title}
          onChange={(e) => forumStore.setTitle(e.target.value)}
        />
        <textarea
          placeholder="Details"
          value={forumStore.details}
          onChange={(e) => forumStore.setDetails(e.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </form></div>}
      <h2>Posts</h2>
      {forumStore.posts.map((post) => (
        <div key={post.timestamp}>
          <Avatar
            className="sidebar-picture"
            src={post.authorImage!}
            alt={post.author!}
          />
          <h3>{post.title}</h3>
          <p>{post.details}</p>
          <p>Author: {post.author}</p>
          <p>Posted on: {formatTimestamp(post.timestamp)}</p>
          {post.author === auth.currentUser?.displayName && (
            <IconButton onClick={() => handleDelete(post.id!)}>
              <Trash />
            </IconButton>
          )}
          <IconButton onClick={() => handleFavorite(post.id!)}>
            <Star
              color={post.isFavorite ? "yellow" : "gray"}
            />
          </IconButton>
        </div>
      ))}
    </div>
  );
});

export default ForumPage;
