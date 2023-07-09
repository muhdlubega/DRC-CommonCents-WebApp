import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import forumStore, { Post } from "../store/ForumStore";
import { observer } from "mobx-react-lite";
import { Avatar } from "@mui/material";
// import { useEffect } from "react";

const ForumPage = observer(() => {
  // useEffect(() => {
    forumStore.initializePosts();
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forumStore.title || !forumStore.details) {
      // Handle form validation, show an error message if fields are empty
      return;
    }
    try {
      await addDoc(collection(db, "users", auth.currentUser!.uid,  "posts"), {
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

  const formatTimestamp = (timestamp: number) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - timestamp;
  
    if (timeDiff < 60000) {
      return `Less than 1 minutes ago`;
    } else if (timeDiff < 3600000) {
      return `${Math.floor(timeDiff / 60000)} minute(s) ago`;
    } else if (timeDiff < 86400000) {
      return `${Math.floor(timeDiff / 3600000)} hour(s) ago`;
    } else {
      return `${Math.floor(timeDiff / 86400000)} day(s) ago`;
    }
  };

  // useEffect(() => {
  //   forumStore.initializePosts();
  // }, [forumStore.posts])
  
  return (
    <div>
      <h1>Create a new post</h1>
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
      </form>
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
        </div>
      ))}
    </div>
  );
});

export default ForumPage;
