package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.repo.TaskRepository;
import com.example.demo.ws.TaskWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository repo;

    @Autowired
    private TaskWebSocketHandler wsHandler;

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Task saved = repo.save(task);
        wsHandler.broadcastTask(saved);
        return saved;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return repo.findAll();
    }
}