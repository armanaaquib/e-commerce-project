package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.reponse.ProductResponse;
import com.ju.e_commerce_project.dto.request.AddProductRequest;
import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/")
    public ResponseEntity<ProductResponse> addProduct(@RequestBody @Valid AddProductRequest productRequest) {
        Product product = productService.addProduct(productRequest);

        ProductResponse productResponse = new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory().getName()
        );

        return ResponseEntity.ok(productResponse);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable @NotNull Long categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);

        List<ProductResponse> productResponses = products.stream().map(product -> new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory().getName()
        )).toList();
        
        return ResponseEntity.ok(productResponses);
    }
}
