package com.ju.e_commerce_project.model.enums;

public enum OrderStatus {
    PLACED,         // Order has been successfully placed by the customer
    PROCESSING,     // Order is being processed (e.g., payment confirmed if not COD, items being gathered)
    SHIPPED,        // Order has been shipped
    DELIVERED,      // Order has been delivered
    CANCELLED,      // Order was cancelled by user or admin
    FAILED          // Order failed (e.g., payment failure during processing)
}
