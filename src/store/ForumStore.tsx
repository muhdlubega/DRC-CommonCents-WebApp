import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { auth, db } from "../firebase";
import authStore from "./AuthStore";

export interface Post {
  id?: string;
  title?: string;
  details?: string;
  author?: string | null;
  authorImage?: string | null;
  timestamp: number;
  isFavorite?: boolean;
  comments?: Comment[];
  commentCount?: number;
}

export interface Comment {
  id?: string;
  postId: string;
  content: string;
  author?: string | null;
  authorImage?: string | "";
  timestamp: number;
}

class ForumStore {
  title: string = "";
  details: string = "";
  isFavourite: boolean = false;
  content: string = "";
  posts: Post[] = [];
  comments: Comment[] = [];
  userFavourites: Post[] = [];
  maxTitle: number = 80;
  errorTitle: string = "";

  constructor() {
    makeObservable(this, {
      title: observable,
      details: observable,
      posts: observable,
      comments: observable,
      maxTitle: observable,
      errorTitle: observable,
      userFavourites: observable,
      setTitle: action.bound,
      setDetails: action.bound,
      setPosts: action.bound,
      setErrorTitle: action.bound,
      initializePosts: action.bound,
      setContent: action.bound,
      markAsFavorite: action.bound,
      unmarkAsFavorite: action.bound,
      setUserFavourites: action.bound,
      getUserFavourites: action,
      handleFavorite: action,
      handleDelete: action,
      handleSubmit: action,
      handleSubmitComment: action,
      handleDeleteComment: action,
    });

    this.initializePosts();
  }

  setTitle(title: string) {
    this.title = title;
    if (title.length > this.maxTitle) {
      this.setErrorTitle("Character count limit reached");
    } else {
      this.setErrorTitle("");
    }
  }

  setDetails(details: string) {
    this.details = details;
  }

  setErrorTitle(errorTitle: string) {
    this.errorTitle = errorTitle;
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
  }

  async initializePosts() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const updatedPosts: Post[] = [];
    this.getUserFavourites();

    for (const doc of querySnapshot.docs) {
      const postData = doc.data();
      const post: Post = {
        id: doc.id,
        title: postData.title,
        details: postData.details,
        author: postData.author,
        authorImage: postData.authorImage,
        timestamp: postData.timestamp,
        comments: [],
      };

      const commentsQuerySnapshot = await getDocs(
        collection(db, "posts", doc.id, "comments")
      );
      const comments: Comment[] = commentsQuerySnapshot.docs.map(
        (commentDoc) => {
          const commentData = commentDoc.data();
          return {
            id: commentDoc.id,
            postId: doc.id,
            content: commentData.content,
            author: commentData.author,
            authorImage: commentData.authorImage,
            timestamp: commentData.timestamp,
          };
        }
      );

      post.comments = comments;
      post.commentCount = comments.length;
      updatedPosts.push(post);
    }

    updatedPosts.forEach((element) => {
      for (let i = 0; i < this.userFavourites.length; i++) {
        if (this.userFavourites[i].id === element.id) {
          element.isFavorite = true;
        }
      }
    });

    this.setPosts(updatedPosts);
  }

  setContent(content: string) {
    this.content = content;
  }

  handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.setPosts(updatedPosts);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to remove post currently. Please refresh or try again later",
        type: "error",
      });
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!this.title || !this.details) {
      authStore.setAlert({
        open: true,
        message: "Please input title and details",
        type: "error",
      });
      return;
    }
    try {
      await addDoc(collection(db, "posts"), {
        title: this.title,
        details: this.details,
        author: auth.currentUser?.displayName,
        authorImage: auth.currentUser?.photoURL,
        timestamp: Date.now(),
        comments: [],
      });

      const post: Post = {
        title: this.title,
        details: this.details,
        author: auth.currentUser?.displayName!,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
        comments: [],
      };
      this.setPosts([...this.posts, post]);

      this.setTitle("");
      this.setDetails("");
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to create post currently. Please refresh or try again later",
        type: "error",
      });
    }
  };

  handleSubmitComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();

    if (!this.content) {
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
        content: this.content,
        author: auth.currentUser?.displayName,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
      };

      console.log(postId);
      const docRef = await addDoc(
        collection(db, "posts", postId, "comments"),
        commentData
      );

      const comment: Comment = {
        id: docRef.id,
        ...commentData,
      };

      const updatedPosts = this.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), comment],
          };
        }
        return post;
      });

      this.setPosts(updatedPosts);
      this.setContent("");
    } catch (error) {
      console.log(error)
      authStore.setAlert({
        open: true,
        message: "Unable to leave a comment currently. Please refresh or try again later",
        type: "error",
      });
    }
  };

  handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));

      const updatedPosts = this.posts.map((post) => {
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

      this.setPosts(updatedPosts);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to remove comment currently. Please refresh or try again later",
        type: "error",
      });
    }
  };

  async markAsFavorite(postId: string) {
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
    const querySnapshot = await getDocs(
      collection(db, "users", auth.currentUser!.uid, "favorites")
    );
    const data: Post[] = querySnapshot.docs.map((doc) => doc.data() as Post);
    this.setUserFavourites(data);
  };

  handleFavorite = async (postId: string) => {
    if (!auth.currentUser) {
      authStore.setAlert({
        open: true,
        message: "Please log in to access this feature",
        type: "error",
      });
      return;
    }

    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      if (post.isFavorite) {
        try {
          await deleteDoc(
            doc(db, "users", auth.currentUser!.uid, "favorites", postId)
          );
          this.unmarkAsFavorite(postId);
        } catch (error) {
          authStore.setAlert({
            open: true,
            message: "Unable to remove from favorites. Please refresh or try again later",
            type: "error",
          });
        }
      } else {
        try {
          authStore.setAlert({
            open: true,
            message: "Post added to favourites",
            type: "success",
          });

          post.isFavorite = true;

          if (auth.currentUser != null) {
            let currentUser = auth.currentUser.uid;
            await setDoc(doc(db, "users", currentUser, "favorites", postId), {
              id: post.id,
              title: post.title,
              details: post.details,
              author: post.author,
              authorImage: post.authorImage,
              timestamp: post.timestamp,
              favourite: post.isFavorite,
            });
            this.markAsFavorite(postId);
          }
        } catch (error) {
          console.log(error);

          authStore.setAlert({
            open: true,
            message: "Unable to add to favorites. Please refresh or try again later",
            type: "error",
          });
        }
      }
    }
  };
}

const forumStore = new ForumStore();

export default forumStore;
