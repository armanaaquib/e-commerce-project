// Path: C:/Users/Aaquib Equbal/work/projects/e-commerce-project/backend/src/main/java/com/ju/e_commerce_project/dto/response/OrderResponse.java
package com.ju.e_commerce_project.dto.response;

import com.ju.e_commerce_project.model.enums.OrderStatus;
import com.ju.e_commerce_project.model.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public record OrderResponse(
        Long orderId,
        Long userId,
        String shippingAddress,
        String phoneNumber,
        PaymentMethod paymentMethod,
        String paymentDetails,
        BigDecimal totalAmount,
        OrderStatus orderStatus,
        Date createdAt,
        List<OrderItemResponse> items
) {}
