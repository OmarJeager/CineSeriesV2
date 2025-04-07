import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  orderBy
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from "../firebase";
import { getDatabase, ref, push, onValue, serverTimestamp as rtdbServerTimestamp, update, remove } from "firebase/database";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Details.css";
import Modal from "react-modal"; // Install react-modal if not already installed

Modal.setAppElement("#root"); // Set the root element for accessibility

const database = getDatabase();

const Comment = ({ comment, onAddReply, onEditComment, onDeleteComment, onReactToComment, currentUser }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onAddReply(comment.id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  const handleEditSubmit = () => {
    if (editedText.trim()) {
      onEditComment(comment.id, editedText);
      setIsEditing(false);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    onDeleteComment(comment.id);
    closeDeleteModal();
  };

  const handleReact = (emoji) => {
    onReactToComment(comment.id, emoji);
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "Just now";
    return timestamp.toDate().toLocaleString();
  };

  const renderReactions = () => {
    const reactions = comment.reactions || {};
    const sortedReactions = Object.entries(reactions).sort((a, b) => b[1] - a[1]);
    const displayedReactions = showAllReactions ? sortedReactions : sortedReactions.slice(0, 3);

    return (
      <div className="reactions">
        {displayedReactions.map(([emoji, count]) => (
          <span key={emoji} className="reaction">
            {emoji} {count}
          </span>
        ))}
        {sortedReactions.length > 3 && (
          <button onClick={() => setShowAllReactions(!showAllReactions)} className="show-more-btn">
            {showAllReactions ? "Show Less" : "Show More"
            }
          </button>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="comment"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="comment-header">
        <div className="comment-user-info">
          <span className="comment-author">{comment.userName}</span>
          <span className="comment-time">{formatDate(comment.createdAt)}</span>
        </div>
        <div className="comment-rating">
          {Array.from({ length: comment.rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={2}
          />
          <button onClick={handleEditSubmit} disabled={!editedText.trim()}>
            Save
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="comment-text">{comment.text}</div>
      )}

      {renderReactions()}

      {currentUser && (
        <div className="reaction-buttons">
          {["👍", "❤️", "😂", "😮", "😢", "👏"].map((emoji) => (
            <button key={emoji} onClick={() => handleReact(emoji)} className="emoji-btn">
              {emoji}
            </button>
          ))}
        </div>
      )}

      {currentUser && (
        <div className="comment-actions">
          <button onClick={handleReact}>
            👍 {comment.reactions || 0}
          </button>
          {currentUser.uid === comment.userId && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={openDeleteModal}>Delete</button>
            </>
          )}
          <button onClick={() => setShowReplyForm(!showReplyForm)}>
            {showReplyForm ? "Cancel" : "Reply"}
          </button>
        </div>
      )}

      {showReplyForm && (
        <div className="reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={2}
          />
          <button 
            onClick={handleReplySubmit}
            disabled={!replyText.trim()}
          >
            Submit Reply
          </button>
        </div>
      )}

      {comment.replies && Object.values(comment.replies).map((reply, index) => (
        <motion.div 
          key={index}
          className="reply"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="reply-user-info">
            <span className="reply-author">{reply.userName}</span>
            <span className="reply-time">{formatDate(reply.createdAt)}</span>
          </div>
          <div className="reply-text">{reply.text}</div>
        </motion.div>
      ))}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className="delete-modal"
        overlayClassName="delete-modal-overlay"
      >
        <h2>Are you sure you want to delete this comment?</h2>
        <p>{comment.text}</p>
        <div className="modal-actions">
          <button onClick={confirmDelete} className="delete-btn">Delete</button>
          <button onClick={closeDeleteModal} className="cancel-btn">Cancel</button>
        </div>
      </Modal>
    </motion.div>
  );
};

const Details = () => {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [expandedOverview, setExpandedOverview] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const navigate = useNavigate();
  const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch media details and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDetails(null);
        setSeasonDetails(null);
        
        // Fetch media details
        const detailsResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`
        );
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}`
        );
        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${API_KEY}`
        );
        const similarResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/similar?api_key=${API_KEY}`
        );

        setDetails(detailsResponse.data);
        setCredits(creditsResponse.data.cast);
        setVideos(videosResponse.data.results);
        setSimilar(similarResponse.data.results);

        // For TV shows
        if (mediaType === "tv") {
          setSeasons(detailsResponse.data.seasons);
          if (detailsResponse.data.seasons.length > 0) {
            fetchSeasonDetails(detailsResponse.data.seasons[0].season_number);
          }
        }

        // Set up Firestore comments listener
        const q = query(
          collection(firestore, 'comments'),
          where('mediaId', '==', id),
          where('mediaType', '==', mediaType),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const loadedComments = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.data()); // Log each comment
            loadedComments.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setComments(loadedComments);
          setLoadingComments(false);
        }, (error) => {
          console.error("Error loading comments:", error);
          setLoadingComments(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/");
      }
    };

    fetchData();
  }, [id, mediaType, navigate]);

  useEffect(() => {
    const q = query(
      collection(firestore, 'comments'),
      where('mediaId', '==', id),
      where('mediaType', '==', mediaType),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedComments = [];
      querySnapshot.forEach((doc) => {
        loadedComments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setComments(loadedComments);
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [id, mediaType]);

  useEffect(() => {
    const commentsRef = ref(database, 'comments');
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedComments = [];
      for (const key in data) {
        if (data[key].mediaId === id && data[key].mediaType === mediaType) {
          loadedComments.push({
            id: key,
            ...data[key]
          });
        }
      }
      setComments(loadedComments.reverse());
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [id, mediaType]);

  const fetchSeasonDetails = async (seasonNumber) => {
    try {
      setLoadingSeason(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      setSeasonDetails(response.data);
      setLoadingSeason(false);
    } catch (error) {
      console.error("Error fetching season details:", error);
      setLoadingSeason(false);
    }
  };

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    fetchSeasonDetails(seasonNumber);
  };

  const toggleWatchlist = () => {
    if (watchlist.some(item => item.id === details.id)) {
      setWatchlist(watchlist.filter(item => item.id !== details.id));
    } else {
      setWatchlist([...watchlist, details]);
    }
  };

  const toggleOverview = () => {
    setExpandedOverview(!expandedOverview);
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      alert("Please sign in to add a comment");
      return;
    }

    try {
      const commentsRef = ref(database, 'comments');
      await push(commentsRef, {
        mediaId: id,
        mediaType: mediaType,
        text: newComment,
        rating: newRating,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        createdAt: rtdbServerTimestamp(),
        replies: null // Change from [] to null
      });
      setNewComment("");
      setNewRating(0);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    if (!currentUser) {
      alert("Please sign in to reply");
      return;
    }

    try {
      const commentRef = ref(database, `comments/${commentId}/replies`);
      await push(commentRef, {
        text: replyText,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        createdAt: rtdbServerTimestamp()
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply. Please try again.");
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const commentRef = ref(database, `comments/${commentId}`);
      await update(commentRef, { text: newText });
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("Failed to edit comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = ref(database, `comments/${commentId}`);
      await remove(commentRef); // Use remove() to delete the comment

      // Update the comments state
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));

      // Show a success toast notification
      toast.success("Comment deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);

      // Show an error toast notification
      toast.error("Failed to delete comment. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleReactToComment = async (commentId, emoji) => {
    if (!currentUser) {
      alert("Please sign in to react to comments");
      return;
    }

    try {
      const commentRef = ref(database, `comments/${commentId}/reactions/${emoji}`);
      await update(commentRef, (prevCount) => (prevCount || 0) + 1);
    } catch (error) {
      console.error("Error reacting to comment:", error);
      alert("Failed to react to comment. Please try again.");
    }
  };

  if (!details) return (
    <motion.div 
      className="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="spinner"></div>
      Loading...
    </motion.div>
  );

  return (
    <motion.div 
      className="details-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.img
            src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
            alt={details.title || details.name}
            className="poster"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
          <motion.div 
            className="hero-info"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h1>{details.title || details.name}</h1>
            <div className="meta-info">
              <span>{new Date(details.release_date || details.first_air_date).getFullYear()}</span>
              {details.genres?.map((genre) => (
                <motion.span 
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                >
                  {genre.name}
                </motion.span>
              ))}
              {details.runtime && (
                <span>
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </span>
              )}
              {mediaType === "tv" && (
                <span>
                  {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="rating">
              <motion.div 
                className="rating-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                {details.vote_average?.toFixed(1)}
              </motion.div>
              <span>/ 10</span>
            </div>
            <h3>Overview</h3>
            <motion.p 
              className={`overview ${expandedOverview ? "expanded" : ""}`}
              onClick={() => setExpandedOverview(!expandedOverview)}
              whileHover={{ color: "#f5f5f5" }}
            >
              {details.overview}
              {!expandedOverview && details.overview.length > 200 && (
                <span 
                  className="read-more" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedOverview(true); // Fix: Expand the overview
                  }}
                >
                  ... Read More
                </span>
              )}
            </motion.p>
            <motion.button
              className="watchlist-btn"
              onClick={toggleWatchlist}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {watchlist.some(item => item.id === details.id)
                ? "Remove from Watchlist"
                : "Add to Watchlist"}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Seasons Selector for TV Shows */}
      {mediaType === "tv" && seasons.length > 0 && (
        <motion.div 
          className="seasons-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2>Seasons</h2>
          <div className="season-selector">
            {seasons.map((season) => (
              <motion.div
                key={season.id}
                className={`season-tab ${selectedSeason === season.season_number ? "active" : ""}`}
                onClick={() => handleSeasonChange(season.season_number)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {season.season_number === 0 ? "Specials" : `Season ${season.season_number}`}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Season Details Section */}
      {mediaType === "tv" && seasonDetails && (
        <motion.div 
          className="season-details-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {loadingSeason ? (
            <div className="loading-season">
              <div className="spinner"></div>
              Loading season details...
            </div>
          ) : (
            <>
              <div className="season-header">
                <h3>
                  {seasonDetails.name} ({new Date(seasonDetails.air_date).getFullYear()})
                </h3>
                <p>{seasonDetails.overview}</p>
                <div className="season-meta">
                  <span>{seasonDetails.episodes.length} Episodes</span>
                </div>
              </div>

              <div className="episodes-grid">
                {seasonDetails.episodes.map((episode) => (
                  <motion.div 
                    key={episode.id}
                    className="episode-card"
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="episode-image">
                      {episode.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt={episode.name}
                        />
                      ) : (
                        <div className="episode-placeholder">No Image</div>
                      )}
                      <div className="episode-number">Episode {episode.episode_number}</div>
                    </div>
                    <div className="episode-info">
                      <h4>{episode.name}</h4>
                      <div className="episode-meta">
                        <span>Rating: {episode.vote_average?.toFixed(1)}</span>
                        <span>Runtime: {episode.runtime || 'N/A'} min</span>
                      </div>
                      <p className="episode-overview">
                        {episode.overview || "No overview available."}
                      </p>
                      <div className="air-date">
                        Aired: {new Date(episode.air_date).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Cast Section */}
      <motion.div 
        className="cast-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <h2>Cast</h2>
        <div className="cast-scroll">
          {credits.slice(0, 10).map((cast) => (
            <motion.div 
              key={cast.id}
              className="cast-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={
                  cast.profile_path
                    ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                    : "/placeholder.jpg"
                }
                alt={cast.name}
              />
              <p>{cast.name}</p>
              <p className="character">{cast.character}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <motion.div 
          className="videos-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <h2>Videos</h2>
          <div className="videos-grid">
            {videos
              .filter((video) => video.site === "YouTube")
              .map((video) => (
                <motion.div 
                  key={video.id}
                  className="video-card"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${video.key}`}
                    width="100%"
                    height="100%"
                    controls
                    light={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  />
                  <p className="video-title">{video.name}</p>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Similar Section */}
      <motion.div 
        className="similar-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2>More Like This</h2>
        <div className="similar-scroll">
          {similar.map((item) => (
            <motion.div
              key={item.id}
              className="similar-card"
              onClick={() => navigate(`/details/${mediaType}/${item.id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={item.title || item.name}
              />
              <p>{item.title || item.name}</p>
              <div className="similar-meta">
                <span>
                  {item.release_date || item.first_air_date
                    ? new Date(item.release_date || item.first_air_date).getFullYear()
                    : "N/A"}
                </span>
                <span>★ {item.vote_average?.toFixed(1)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Comments Section */}
      <motion.div 
        className="comments-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <h2>Comments & Reviews</h2>
        
        {!currentUser ? (
          <div className="auth-prompt">
            <p>Please sign in to leave comments and reviews</p>
            <button onClick={() => navigate('/login')}>Sign In</button>
          </div>
        ) : (
          <div className="add-comment">
            <h3>Add Your Comment</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              rows={4}
            />
            <div className="rating-input">
              <span>Rating: </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= newRating ? "filled" : ""}`}
                  onClick={() => setNewRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim() || newRating === 0}
            >
              Submit Comment
            </button>
          </div>
        )}

        <div className="comments-list">
          {loadingComments ? (
            <div className="loading-comments">
              <div className="spinner"></div>
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <Comment 
                key={comment.id}
                comment={comment}
                onAddReply={handleAddReply}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onReactToComment={handleReactToComment}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Details;