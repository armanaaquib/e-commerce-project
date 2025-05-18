package com.ju.e_commerce_project.dto.request;

import com.ju.e_commerce_project.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PlaceOrderRequest(
        @NotBlank(message = "Shipping address cannot be blank")
        @Size(min = 10, max = 500, message = "Shipping address must be between 10 and 500 characters")
        String shippingAddress,

        @NotBlank(message = "Phone number cannot be blank")
        @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number format")
        String phoneNumber,

        @NotNull(message = "Payment method cannot be null")
        PaymentMethod paymentMethod,

        @Size(max = 100, message = "UPI ID cannot exceed 100 characters")
        String paymentDetails
) {}
