import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { Avatar, Typography, Card, CardContent, Box, TextField, Button, IconButton } from "@mui/material";
import forumStore, { Comment } from "../../store/ForumStore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import authStore from "../../store/AuthStore";
import { ArrowDown2, Trash } from "iconsax-react";

const CommentSection = observer(({postId}: { postId: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    forumStore.initializeComments(postId);
  }, [isDropdownOpen]);

  const [content, setContent] = useState(""); 

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      authStore.setAlert({
        open: true,
        message: "Please input content",
        type: "error",
      });
      return;
    }
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        postId: postId,
        content: content,
        author: auth.currentUser?.displayName,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
      });

      const comment: Comment = {
        postId: postId,
        content: content,
        author: auth.currentUser?.displayName,
        authorImage: auth.currentUser?.photoURL!,
        timestamp: Date.now(),
      };
      forumStore.setComments([...forumStore.comments, comment]);

      setContent("");
    } catch (error) {
      console.log(error)
      authStore.setAlert({
        open: true,
        message: "Unable to leave a comment currently. Try again later",
        type: "error",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
      const updatedComments = forumStore.comments.filter((comment) => comment.id !== commentId);
      forumStore.setComments(updatedComments);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: "Unable to remove comment currently. Try again later",
        type: "error",
      });
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

  const sortedComments = forumStore.comments.slice().sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div>

{authStore.user && (
  <Box>
        <form onSubmit={handleSubmit}>
          <TextField
            multiline
            inputProps={{ maxLength: 3000 }}
            placeholder="Leave a comment.."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{my: '1vw', width: '100%', backgroundColor: '#F5F5F5'}}
          />
          {forumStore.errorMessage && <Typography style={{ color: 'red' }}>{forumStore.errorMessage}</Typography>}
          <Button type="submit" sx={{backgroundColor: 'blue', color: 'white', px: '3vw'}}>Post</Button>
        </form>
  </Box>
)}
<div className="sidebar-leaderboard">
        <h6 onClick={toggleDropdown}>
          Comments 
            <ArrowDown2 size={16} style={{ marginLeft: "0.5vw" }} />
          {isDropdownOpen ? (
            <Box>
              {/* <ArrowUp2 size={16} style={{ marginLeft: "0.5vw" }} /> */}
              <Box>
        {sortedComments.map((comment) => (
          <Card key={comment.timestamp} style={{ margin: '2vw', border: '0.1vw solid black', borderRadius: '1vw' }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  className="sidebar-picture"
                  src={comment.authorImage!}
                  alt={comment.author!}
                />
                {comment.author === auth.currentUser?.displayName && (
                  <IconButton onClick={() => handleDelete(comment.id!)}>
                    <Trash />
                  </IconButton>
                )}
              </div>
              <Typography variant="body1" component="p">{comment.content}</Typography>
              <Typography variant="body2" component="p">Author: {comment.author}</Typography>
              <Typography variant="body2" component="p">{formatTimestamp(comment.timestamp)}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
              </Box>
          ) : (
            <Box></Box>
          )}
        </h6>
        {/* <Modal open={isDropdownOpen} onClose={toggleDropdown}>
          
        </Modal> */}
      </div>
      
    </div>
  );
});

export default CommentSection;
