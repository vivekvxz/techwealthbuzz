import React, { useEffect, useState } from "react";
import useWebSocket from "./useWebSocket";
import WebSocketDemo from "./WebSocketDemo";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Generate random 3-digit user ID
    const randomUserId = Math.floor(100 + Math.random() * 900).toString();
    const newProfile = {
      userId: randomUserId,
      name: `User ${randomUserId}`,
      preferences: {
        theme: "dark",
        language: "en",
      },
      avatarUrl: `https://randomuser.me/api/portraits/lego/1.jpg`,
    };
    setProfile(newProfile);
  }, []);

  const { messages } = useWebSocket(profile);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>Welcome {profile.name}</h1>
      <p>UserID: {profile.userId}</p>
      <WebSocketDemo messages={messages} />
    </div>
  );
}

export default App;
