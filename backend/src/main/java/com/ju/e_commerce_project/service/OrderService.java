package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.dto.request.PlaceOrderRequest;
import com.ju.e_commerce_project.dto.response.OrderItemResponse;
import com.ju.e_commerce_project.dto.response.OrderResponse;
import com.ju.e_commerce_project.exception.ResourceNotFoundException;
import com.ju.e_commerce_project.exception.EmptyCartException;
import com.ju.e_commerce_project.model.*;
import com.ju.e_commerce_project.model.enums.OrderStatus;
import com.ju.e_commerce_project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        CartRepository cartRepository,
                        CartService cartService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderResponse placeOrder(String username, PlaceOrderRequest request) {
        User user = getUserByUsername(username);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new EmptyCartException("Cannot place order with an empty or non-existent cart."));

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new EmptyCartException("Cart is empty. Add items to your cart before placing an order.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.shippingAddress());
        order.setPhoneNumber(request.phoneNumber());
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentDetails(request.paymentDetails());
        order.setOrderStatus(OrderStatus.PENDING);

        BigDecimal totalOrderAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product == null) {
                throw new ResourceNotFoundException("Product details missing for cart item: " + cartItem.getId());
            }

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    cartItem.getQuantity(),
                    product.getPrice()
            );
            order.addOrderItem(orderItem);
            totalOrderAmount = totalOrderAmount.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(totalOrderAmount);
        Order savedOrder = orderRepository.save(order);

        cartService.clearCart(username);

        return mapToOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderHistory(String username) {
        User user = getUserByUsername(username);
        List<Order> orders = orderRepository.findByUserWithOrderItemsOrderByCreatedAtDesc(user);
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProductNameSnapshot(),
                        item.getQuantity(),
                        item.getPriceAtOrder(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getUser().getUserId(),
                order.getShippingAddress(),
                order.getPhoneNumber(),
                order.getPaymentMethod(),
                order.getPaymentDetails(),
                order.getTotalAmount(),
                order.getOrderStatus(),
                order.getCreatedAt(),
                itemResponses
        );
    }
}
