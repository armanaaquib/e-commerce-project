package com.ju.e_commerce_project.exception;

public class ProductCategoryNotFoundException extends RuntimeException {
    public ProductCategoryNotFoundException(Long id) {
        super("Product category with id " + id + " not found");
    }
}
