import { collection, getDocs } from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { db } from "../firebase";

export interface Post {
  id?: string;
  title?: string;
  details?: string;
  author?: string | null;
  authorImage?: string | null;
  timestamp: number;
  isFavorite?: boolean;
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
      markAsFavorite: action.bound,
      unmarkAsFavorite: action.bound,
      getFavoritePosts: action.bound
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
    const querySnapshot = await getDocs(collection(db, "posts"));
    const updatedPosts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const { title, details, author, authorImage, timestamp } = doc.data();
      const post: Post = {
        id: doc.id,
        title,
        details,
        author,
        authorImage,
        timestamp,
      };
      updatedPosts.push(post);
    });

    this.setPosts(updatedPosts);
  }

  markAsFavorite(postId: string) {
    const updatedPosts = this.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isFavorite: true,
        };
      }
      return post;
    });
    this.setPosts(updatedPosts);
  }

  unmarkAsFavorite(postId: string) {
    const updatedPosts = this.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isFavorite: false,
        };
      }
      return post;
    });
    this.setPosts(updatedPosts);
  }

  getFavoritePosts() {
    return this.posts.filter((post) => post.isFavorite);
  }
}

const forumStore = new ForumStore();

export default forumStore;
