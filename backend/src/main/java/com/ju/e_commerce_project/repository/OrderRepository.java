package com.ju.e_commerce_project.repository;

import com.ju.e_commerce_project.model.Order;
import com.ju.e_commerce_project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Fetch orders with their items eagerly to avoid N+1 problem when listing orders
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.user = :user ORDER BY o.createdAt DESC")
    List<Order> findByUserWithOrderItemsOrderByCreatedAtDesc(User user);

    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
