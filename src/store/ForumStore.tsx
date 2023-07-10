import { collection, getDocs } from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { auth, db } from "../firebase";

export interface Post {
  title?: string;
  details?: string;
  author?: string | null;
  authorImage?: string | null;
  timestamp: number;
}

class ForumStore {
  title: string = "";
  details: string = "";
  posts: Post[] = [];

  constructor() {
    makeObservable(this, {
      title: observable,
      details: observable,
      posts: observable,
      setTitle: action.bound,
      setDetails: action.bound,
      setPosts: action.bound,
      initializePosts: action.bound,
    });

    this.initializePosts();
  }

  setTitle(title: string) {
    this.title = title;
  }

  setDetails(details: string) {
    this.details = details;
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
  }

  async initializePosts() {
    if (auth.currentUser) {
      const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "posts"));
      const updatedPosts: Post[] = [];
      querySnapshot.forEach((doc) => {
        const { title, details, author, authorImage, timestamp } = doc.data();
        const post: Post = {
          title,
          details,
          author,
          authorImage,
          timestamp,
        };
        updatedPosts.push(post);
      });
  
      if (querySnapshot.empty) {
        const initialPost: Post = {
          title: "",
          details: "",
          author: auth.currentUser?.displayName,
          authorImage: auth.currentUser?.photoURL,
          timestamp: Date.now(),
        };
        updatedPosts.push(initialPost);
      }
  
      this.setPosts(updatedPosts);
    }
  }
}

const forumStore = new ForumStore();

export default forumStore;
