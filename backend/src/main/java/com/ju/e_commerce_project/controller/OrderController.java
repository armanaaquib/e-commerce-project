package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.request.PlaceOrderRequest;
import com.ju.e_commerce_project.dto.response.OrderResponse;
import com.ju.e_commerce_project.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        String username = getCurrentUsername();
        OrderResponse orderResponse = orderService.placeOrder(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrderHistory() {
        String username = getCurrentUsername();
        List<OrderResponse> orderHistory = orderService.getOrderHistory(username);
        return ResponseEntity.ok(orderHistory);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new SecurityException("User not authenticated");
        }
        return authentication.getName();
    }
}
