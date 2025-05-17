package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.request.AddItemToCartRequest;
import com.ju.e_commerce_project.dto.request.UpdateCartItemRequest;
import com.ju.e_commerce_project.dto.response.CartResponse;
import com.ju.e_commerce_project.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        String username = getCurrentUsername();
        CartResponse cartResponse = cartService.getCart(username);
        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@Valid @RequestBody AddItemToCartRequest request) {
        String username = getCurrentUsername();
        CartResponse cartResponse = cartService.addItemToCart(username, request);
        return ResponseEntity.ok(cartResponse);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        String username = getCurrentUsername();
        CartResponse cartResponse = cartService.updateCartItem(username, cartItemId, request);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(@PathVariable Long cartItemId) {
        String username = getCurrentUsername();
        CartResponse cartResponse = cartService.removeCartItem(username, cartItemId);
        return ResponseEntity.ok(cartResponse);
    }
}
