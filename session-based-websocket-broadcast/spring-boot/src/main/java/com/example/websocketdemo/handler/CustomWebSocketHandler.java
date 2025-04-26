package com.example.websocketdemo.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NonNull;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class CustomWebSocketHandler extends TextWebSocketHandler {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // Map userId -> WebSocketSession
    private static final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    // Map sessionId -> userId (reverse mapping)
    private static final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("WebSocket Connected: sessionId = " + session.getId());
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Received from client: " + payload);

        JsonNode jsonNode = objectMapper.readTree(payload);
        String type = jsonNode.get("type").asText();
        JsonNode data = jsonNode.get("data");

        if ("USER_PROFILE".equals(type)) {
            String userId = data.get("userId").asText();

            // Register user
            userSessions.put(userId, session);
            sessionUserMap.put(session.getId(), userId);

            System.out.println("Registered userId = " + userId + " to sessionId = " + session.getId());
        }
    }

    @Override
    @SuppressWarnings("resource")
    public void afterConnectionClosed(WebSocketSession session, @NonNull CloseStatus status) {
        String sessionId = session.getId();
        String userId = sessionUserMap.get(sessionId);

        if (userId != null) {
            userSessions.remove(userId);
            sessionUserMap.remove(sessionId);
            System.out.println("WebSocket Disconnected: userId = " + userId + ", sessionId = " + sessionId);
        } else {
            System.out.println("WebSocket Disconnected: unknown sessionId = " + sessionId);
        }
    }

    public void sendToUsers(Iterable<String> userIds, String message) {
        for (String userId : userIds) {
            WebSocketSession session = userSessions.get(userId);
            if (session != null && session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
