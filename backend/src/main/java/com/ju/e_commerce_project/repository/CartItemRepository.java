package com.ju.e_commerce_project.repository;

import com.ju.e_commerce_project.model.Cart;
import com.ju.e_commerce_project.model.CartItem;
import com.ju.e_commerce_project.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    // Optional<CartItem> findByIdAndCartUserUsername(Long cartItemId, String username); // For security checks
}
