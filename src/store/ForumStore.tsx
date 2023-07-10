import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { auth, db } from "../firebase";

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
  userFavourites: Post[] = [];
  maxLength: number = 3000;
  errorMessage: string = "";

  constructor() {
    makeObservable(this, {
      title: observable,
      details: observable,
      posts: observable,
      maxLength: observable,
      errorMessage: observable,
      userFavourites: observable,
      setTitle: action.bound,
      setDetails: action.bound,
      setPosts: action.bound,
      setErrorMessage: action.bound,
      initializePosts: action.bound,
      markAsFavorite: action.bound,
      unmarkAsFavorite: action.bound,
      setUserFavourites: action.bound,
      getUserFavourites: action,
      handleFavorite: action
    });

    this.initializePosts();
  }

  setTitle(title: string) {
    this.title = title;
  }

  setDetails(details: string) {
    this.details = details;
    if (details.length === this.maxLength) {
      this.setErrorMessage('Character count limit reached');
    } else {
      this.setErrorMessage('');
    }
  }

  setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
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

  setUserFavourites(userFavourites: Post[]) {
    this.userFavourites = userFavourites;
  }

  getUserFavourites = async () => {
    const querySnapshot = await getDocs(collection(db, "users", auth.currentUser!.uid, "favorites"));
    // if (querySnapshot.empty) {
    //   const initialFavouritePost: Post = {
    //     timestamp: Date.now(),
    //   };
    //   await setDoc(doc(db, "users", auth.currentUser!.uid, "favorites"), initialFavouritePost);
    // } else {
      const data: Post[] = querySnapshot.docs.map((doc) =>
        doc.data() as Post
      );
      this.setUserFavourites(data);
    // }
  }

  handleFavorite = async (postId: string) => {
    if (!auth.currentUser) {
      // User is not logged in, handle accordingly
      return;
    }

    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      if (post.isFavorite) {
        try {
          await deleteDoc(doc(db, "users", auth.currentUser!.uid, "favorites", postId));
          this.unmarkAsFavorite(postId);
        } catch (error) {
          // Handle error while removing from favorites
        }
      } else {
        try {
          post.isFavorite = true;
          await setDoc(doc(db, "users", auth.currentUser!.uid, "favorites", postId), post);
          this.markAsFavorite(postId);
        } catch (error) {
          // Handle error while adding to favorites
        }
      }
    }
  };

}

const forumStore = new ForumStore();

export default forumStore;
