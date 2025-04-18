import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './DashboardChat.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaInfoCircle, FaComments } from 'react-icons/fa';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { auth } from '../firebase';

const DashboardChat = () => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupRules, setGroupRules] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groups, setGroups] = useState(JSON.parse(localStorage.getItem('groups')) || []);
  const [expandedGroupIndex, setExpandedGroupIndex] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const database = getDatabase();

  const handleCreateGroup = () => {
    if (!groupName || !groupRules || !groupDescription) {
      toast.error('All fields are required!');
      return;
    }

    const newGroup = {
      name: groupName,
      rules: groupRules,
      description: groupDescription,
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));

    setGroupName('');
    setGroupRules('');
    setGroupDescription('');
    setShowCreateGroup(false);

    toast.success('Group created successfully!');
  };

  const toggleGroupDetails = (index) => {
    setExpandedGroupIndex(expandedGroupIndex === index ? null : index);
  };

  const handleGroupChat = (groupName) => {
    setCurrentGroup(groupName);

    // Fetch messages for the selected group
    const messagesRef = ref(database, `chats/${groupName}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.values(data) : [];
      setMessages(messagesArray);
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to send messages!');
      return;
    }

    const message = {
      text: newMessage,
      userName: user.displayName || user.email.split('@')[0],
      userId: user.uid,
      timestamp: Date.now(),
    };

    const messagesRef = ref(database, `chats/${currentGroup}`);
    push(messagesRef, message);

    setNewMessage('');
  };

  return (
    <div className="container">
      <h1>Dashboard Chat</h1>
      <button className="create-group-button" onClick={() => setShowCreateGroup(!showCreateGroup)}>
        {showCreateGroup ? 'Cancel' : 'Create Group'}
      </button>

      {showCreateGroup && (
        <div
          className="form-container"
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            className="input"
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Group Rules"
            value={groupRules}
            onChange={(e) => setGroupRules(e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <button className="submit-button" onClick={handleCreateGroup}>
            Add Group
          </button>
        </div>
      )}

      <div className="group-list">
        {groups.map((group, index) => (
          <div className="group-card" key={index}>
            <h3>{group.name}</h3>
            <div className="group-actions">
              <FaInfoCircle
                className="details-icon"
                onClick={() => toggleGroupDetails(index)}
              />
              <FaComments
                className="chat-icon"
                onClick={() => handleGroupChat(group.name)}
              />
            </div>
            {expandedGroupIndex === index && (
              <div className="group-details">
                <p>{group.description}</p>
                <small>{group.rules}</small>
              </div>
            )}
          </div>
        ))}
      </div>

      {currentGroup && (
        <div className="chat-container">
          <h2>Chat: {currentGroup}</h2>
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <strong>{message.userName}:</strong> {message.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DashboardChat;
