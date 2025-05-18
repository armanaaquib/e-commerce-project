package com.ju.e_commerce_project.model.enums;

public enum OrderStatus {
    PENDING,        // Order placed, awaiting payment or processing
    PROCESSING,     // Payment received, order is being processed
    SHIPPED,        // Order has been shipped
    DELIVERED,      // Order has been delivered
    CANCELLED,      // Order was cancelled by user or admin
    FAILED          // Order failed (e.g., payment failure)
}
