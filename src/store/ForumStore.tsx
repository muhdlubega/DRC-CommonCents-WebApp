import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  // updateDoc,
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
  // maxLength: number = 3000;
  maxTitle: number = 80;
  // errorMessage: string = "";
  errorTitle: string = "";

  constructor() {
    makeObservable(this, {
      title: observable,
      details: observable,
      posts: observable,
      comments: observable,
      // maxLength: observable,
      maxTitle: observable,
      // errorMessage: observable,
      errorTitle: observable,
      userFavourites: observable,
      setTitle: action.bound,
      setDetails: action.bound,
      setPosts: action.bound,
      // setErrorMessage: action.bound,
      setErrorTitle: action.bound,
      initializePosts: action.bound,
      setContent: action.bound,
      // setComments: action.bound,
      // initializeComments: action.bound,
      markAsFavorite: action.bound,
      unmarkAsFavorite: action.bound,
      setUserFavourites: action.bound,
      getUserFavourites: action,
      handleFavorite: action,
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
    // if (details.length > this.maxLength) {
    //   this.setErrorMessage("Character count limit reached");
    // } else {
    //   this.setErrorMessage("");
    // }
  }

  // setErrorMessage(errorMessage: string) {
  //   this.errorMessage = errorMessage;
  // }

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
  
      const commentsQuerySnapshot = await getDocs(collection(db, "posts", doc.id, "comments"));
      const comments: Comment[] = commentsQuerySnapshot.docs.map((commentDoc) => {
        const commentData = commentDoc.data();
        return {
          id: commentDoc.id,
          postId: doc.id,
          content: commentData.content,
          author: commentData.author,
          authorImage: commentData.authorImage,
          timestamp: commentData.timestamp,
        };
      });
  
      post.comments = comments;
      post.commentCount = comments.length; 
      updatedPosts.push(post);
      console.log(post.comments);
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
    // if (content.length === this.maxLength) {
    //   this.setErrorMessage("Character count limit reached");
    // } else {
    //   this.setErrorMessage("");
    // }
  }

  // setComments(comments: Comment[]) {
  //   this.comments = comments;
  // }

  // async initializeComments(postId: string) {
  //   const querySnapshot = await getDocs(collection(db, "posts", postId, "comments"));
  //   const updatedComments: Comment[] = [];
  //   querySnapshot.forEach((doc) => {
  //     const { postId, content, author, authorImage, timestamp } = doc.data();
  //     const comments: Comment = {
  //       id: doc.id,
  //       postId: postId,
  //       content,
  //       author,
  //       authorImage,
  //       timestamp
  //     };
  //     updatedComments.push(comments);
  //   });

  //   this.setComments(updatedComments);
  // }

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
            message: "Unable to remove from favorites. Try again later",
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
            await setDoc(
              doc(db, "users", currentUser, "favorites", postId),
              {'id': post.id, 'title': post.title, 'details': post.details, 'author': post.author, 'authorImage': post.authorImage,
                'timestamp': post.timestamp, 'favourite':post.isFavorite}
            );
            this.markAsFavorite(postId);
          }
        } catch (error) {
          console.log(error);
          
          authStore.setAlert({
            open: true,
            message: "Unable to add to favorites. Try again later",
            type: "error",
          });
        }
      }
    }
  };
}

const forumStore = new ForumStore();

export default forumStore;
