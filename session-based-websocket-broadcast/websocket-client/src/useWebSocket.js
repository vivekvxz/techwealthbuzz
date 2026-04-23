import { useEffect, useRef, useState } from "react";

export default function useWebSocket(profile) {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!profile || !profile.userId) return;

        // Create connection only once
        const ws = new WebSocket(`ws://localhost:8080/ws`);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");

            // Send profile once on connection
            const payload = {
                type: "USER_PROFILE",
                data: profile,
            };
            ws.send(JSON.stringify(payload));
        };

        ws.onmessage = (event) => {
            console.log("Message from server:", event.data);
            setMessages(prev => [...prev, event.data]);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            console.log("Cleaning up WebSocket connection");
            ws.close();
        };
    }, [profile]);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return { messages, sendMessage };
}
