import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { db } from "../firebase";

export interface Post {
  id: string;
  title: string;
  details: string;
  author: string;
  timestamp: number;
}

class ForumStore {
    title: string = "";
    details: string = "";
    posts: Post[] = [];

    constructor(){
        makeObservable(this,{
            title: observable,
            details: observable,
            posts: observable,
            setTitle: action.bound,
            setDetails: action.bound,
            setPosts: action.bound,
            initializePosts: action.bound
        });

        this.initializePosts();
    }

    setTitle(title: string){
        this.title = title;
    }

    setDetails(details: string){
        this.details = details;
    }

    setPosts(posts: Post[]){
        this.posts = posts;
    }

    async initializePosts() {
        // const querySnapshot = await getDocs(collection(db, "posts"));
        //   const updatedPosts: Post[] = [];
        //   querySnapshot.forEach((doc) => {
        //     const { post } = doc.data();
        //     updatedPosts.push({ post });
        //     if (auth.currentUser && auth.currentUser.uid === doc.id) {
        //       this.user!.balance = balance || null;
        //     }
        //   });

        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const updatedPosts: Post[] = [];
      snapshot.forEach(async (doc) => {
        const post: Post = { id: doc.id, ...doc.data() } as Post;
        const userDoc = await getDocs(collection(db, "users"));
        userDoc.forEach((doc) => {
          const { displayName } = doc.data();
          post.author = displayName || "";
        })

        updatedPosts.push(post);
      });
      this.setPosts(updatedPosts);
    });

    return () => {
        unsubscribe();
      };
      }
}

const forumStore = new ForumStore();

export default forumStore;
