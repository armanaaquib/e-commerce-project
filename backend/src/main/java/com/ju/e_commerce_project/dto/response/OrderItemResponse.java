package com.ju.e_commerce_project.dto.response;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long orderItemId,
        Long productId,
        String productName,
        int quantity,
        BigDecimal priceAtOrder,
        BigDecimal subtotal
) {}
