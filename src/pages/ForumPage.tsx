import { useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import forumStore from "../store/ForumStore";
import { observer } from "mobx-react-lite";

const ForumPage = observer(() => {
  // const [title, setTitle] = useState("");
  // const [details, setDetails] = useState("");
  // const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    // const unsubscribe = onSnapshot(q, async (snapshot) => {
    //   const updatedPosts: Post[] = [];
    //   snapshot.forEach(async (doc) => {
    //     const post: Post = { id: doc.id, ...doc.data() } as Post;
    //     const userDoc = await getDocs(collection(db, "users"));
    //     userDoc.forEach((doc) => {
    //       const { displayName } = doc.data();
    //       post.author = displayName || "";
    //     })

    //     updatedPosts.push(post);
    //   });
    //   forumStore.setPosts(updatedPosts);
    // });

    // return () => {
    //   unsubscribe();
    // };

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
        author: auth.currentUser?.uid,
        timestamp: Date.now(),
      });

      // Clear the form fields
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
  
  console.log(forumStore.posts);
  
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
        <div key={post.id}>
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
