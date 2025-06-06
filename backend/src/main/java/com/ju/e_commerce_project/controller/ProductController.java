package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.response.ProductResponse;
import com.ju.e_commerce_project.dto.request.AddProductRequest;
import com.ju.e_commerce_project.dto.request.UpdateProductRequest;
import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

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

    @GetMapping("/my-products")
    public ResponseEntity<List<ProductResponse>> getMyProducts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        List<Product> products = productService.getProductsBySeller(currentPrincipalName);

        List<ProductResponse> productResponses = products.stream().map(product -> new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory().getName()
        )).toList();

        return ResponseEntity.ok(productResponses);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long productId,
            @RequestBody @Valid UpdateProductRequest updateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerUsername = authentication.getName();

        Product updatedProduct = productService.updateProduct(productId, updateRequest, sellerUsername);

        ProductResponse productResponse = new ProductResponse(
                updatedProduct.getId(),
                updatedProduct.getName(),
                updatedProduct.getDescription(),
                updatedProduct.getPrice(),
                updatedProduct.getCategory().getName()
        );
        return ResponseEntity.ok(productResponse);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerUsername = authentication.getName();

        productService.deleteProduct(productId, sellerUsername);
        return ResponseEntity.noContent().build();
    }
}
