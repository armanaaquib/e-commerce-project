package com.ju.e_commerce_project.dto.response;

import java.math.BigDecimal;

public record CartItemResponse(
        Long cartItemId,
        Long productId,
        String productName,
        String productDescription, // Optional, but can be useful
        BigDecimal unitPrice,
        int quantity,
        BigDecimal subtotal // unitPrice * quantity
) {}
