package com.example.websocketdemo.controller;

import com.example.websocketdemo.dto.BroadcastRequest;
import com.example.websocketdemo.handler.CustomWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/broadcast")
public class BroadcastController {

    @Autowired
    private CustomWebSocketHandler customWebSocketHandler;

    @PostMapping
    public String broadcastMessage(@RequestBody BroadcastRequest request) {
        customWebSocketHandler.sendToUsers(request.getUserIds(), request.getMessage());
        return "Message broadcasted to users: " + request.getUserIds();
    }
}
