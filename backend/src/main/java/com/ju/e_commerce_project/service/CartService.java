package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.dto.request.AddItemToCartRequest;
import com.ju.e_commerce_project.dto.request.UpdateCartItemRequest;
import com.ju.e_commerce_project.dto.response.CartItemResponse;
import com.ju.e_commerce_project.dto.response.CartResponse;
import com.ju.e_commerce_project.exception.ResourceNotFoundException;
import com.ju.e_commerce_project.model.Cart;
import com.ju.e_commerce_project.model.CartItem;
import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.repository.CartItemRepository;
import com.ju.e_commerce_project.repository.CartRepository;
import com.ju.e_commerce_project.repository.ProductRepository;
import com.ju.e_commerce_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CartResponse getCart(String username) {
        User user = getUserByUsername(username);
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(String username, AddItemToCartRequest request) {
        User user = getUserByUsername(username);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.productId()));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem(cart, product, 0));

        cartItem.setQuantity(cartItem.getQuantity() + request.quantity());
        cartItemRepository.save(cartItem);

        if (!cart.getCartItems().contains(cartItem)) {
            cart.addCartItem(cartItem);
        }

        cartRepository.save(cart);

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(String username, Long cartItemId, UpdateCartItemRequest request) {
        User user = getUserByUsername(username);
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new SecurityException("Cart item does not belong to the current user's cart.");
        }

        cartItem.setQuantity(request.quantity());
        cartItemRepository.save(cartItem);

        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeCartItem(String username, Long cartItemId) {
        User user = getUserByUsername(username);
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new SecurityException("Cart item does not belong to the current user's cart.");
        }

        cartItemRepository.delete(cartItem);
        cart.removeCartItem(cartItem);
        cartRepository.save(cart);

        Cart updatedCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found after item removal"));
        return mapToCartResponse(updatedCart);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        Cart freshCart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with ID: " + cart.getId()));

        List<CartItemResponse> itemResponses = freshCart.getCartItems().stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getDescription(),
                        item.getProduct().getPrice(),
                        item.getQuantity(),
                        item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .collect(Collectors.toList());

        BigDecimal totalPrice = itemResponses.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = itemResponses.stream().mapToInt(CartItemResponse::quantity).sum();

        return new CartResponse(
                freshCart.getId(),
                freshCart.getUser().getUserId(),
                itemResponses,
                totalPrice,
                totalItems
        );
    }
}
