package com.ju.e_commerce_project.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductCategoryNotFoundException extends RuntimeException {
    public ProductCategoryNotFoundException(Long id) {
        super("Product category with id " + id + " not found");
    }
}
