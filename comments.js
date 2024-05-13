// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, 'comments.json');
const comments = require(commentsPath);

app.use(bodyParser.json());

app.post('/comments', (req, res) => {
  const newComment = req.body;
  const newCommentId = comments.length + 1;
  newComment.id = newCommentId;
  comments.push(newComment);
  fs.writeFile(commentsPath, JSON.stringify(comments), (err) => {
    if (err) {
      res.status(500).send('Could not write comment to file');
    } else {
      res.status(201).send(newComment);
    }
  });
});

app.get('/comments', (req, res) => {
  res.send(comments);
});

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});

// Path: app.js
// Create React app
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/comments')
      .then((response) => {
        setComments(response.data);
      });
  }, []);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handlePostComment = () => {
    axios.post('http://localhost:3001/comments', { content: newComment })
      .then((response) => {
        setComments([...comments, response.data]);
        setNewComment('');
      });
  };

  return (
    <div>
      <h1>Comments</h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={handleCommentChange}
      />
      <button onClick={handlePostComment}>Post Comment</button>
    </div>
  );
}

export default App;