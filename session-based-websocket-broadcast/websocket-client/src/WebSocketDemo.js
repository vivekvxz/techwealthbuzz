import React from "react";

export default function WebSocketDemo({ messages }) {
    return (
        <div style={{ padding: "20px" }}>
            <h2>Incoming Messages:</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index} style={{ marginBottom: "8px" }}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
