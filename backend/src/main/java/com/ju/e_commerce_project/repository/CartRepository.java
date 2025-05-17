package com.ju.e_commerce_project.repository;

import com.ju.e_commerce_project.model.Cart;
import com.ju.e_commerce_project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserUserId(Long userId); // Convenience method
    Optional<Cart> findByUserUsername(String username);
}
