// 


import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://socket-ac59.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    // Listen for broadcast messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { type: "broadcast", text: data }]);
    });

    // Listen for private messages
    socket.on("receive_private_message", ({ message, from }) => {
      setMessages((prev) => [...prev, { type: "private", text: `Private from ${from}: ${message}` }]);
    });

    // Get updated user list
    socket.on("user_list", (users) => {
      setUserList(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_private_message");
      socket.off("user_list");
    };
  }, []);

  // Set username when joining
  const joinChat = () => {
    if (username.trim()) {
      socket.emit("set_username", username);
    }
  };

  // Send broadcast message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessage("");
    }
  };

  // Send private message
  const sendPrivateMessage = () => {
    if (privateMessage.trim() && selectedUser) {
      socket.emit("send_private_message", { message: privateMessage, receiverUsername: selectedUser });
      setMessages((prev) => [...prev, { type: "private", text: `You to ${selectedUser}: ${privateMessage}` }]);
      setPrivateMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Socket.IO Chat</h1>

      {/* Username Input */}
      <div>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinChat}>Join Chat</button>
      </div>

      {/* Message Input */}
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send to All</button>
      </div>

      {/* Private Message Input */}
      <div>
        <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
          <option value="">Select User</option>
          {userList.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Private message"
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
        />
        <button onClick={sendPrivateMessage}>Send Private</button>
      </div>

      {/* Chat Messages */}
      <div style={{ marginTop: 20 }}>
        <h2>Chat</h2>
        {messages.map((msg, index) => (
          <p key={index} style={{ color: msg.type === "private" ? "red" : "black" }}>
            {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;





