package com.example.websocketdemo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BroadcastRequest {
    private List<String> userIds;
    private String message;

}
