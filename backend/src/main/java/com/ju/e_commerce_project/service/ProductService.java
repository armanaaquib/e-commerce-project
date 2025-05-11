package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.dto.request.AddProductRequest;
import com.ju.e_commerce_project.dto.request.UpdateProductRequest;
import com.ju.e_commerce_project.exception.ProductNotFoundException;
import com.ju.e_commerce_project.exception.UnauthorizedOperationException;
import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.repository.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final AuthService authService;
    private final ProductCategoryService productCategoryService;

    public ProductService(
            ProductRepository productRepository,
            ProductCategoryService productCategoryService,
            AuthService authService
    ) {
        this.productRepository = productRepository;
        this.productCategoryService = productCategoryService;
        this.authService = authService;
    }

    public Product addProduct(AddProductRequest productRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetail = (UserDetails) authentication.getPrincipal();
        User user = authService.findUserByUsername(userDetail.getUsername());

        ProductCategory category = productCategoryService.findCategoryById(productRequest.categoryId());

        var product = new Product(
                productRequest.name(),
                productRequest.description(),
                productRequest.price(),
                category,
                user
        );

        return productRepository.save(product);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getProductsBySeller(String sellerUsername) {
        return productRepository.findBySellerUsername(sellerUsername);
    }

    @Transactional
    public Product updateProduct(Long productId, UpdateProductRequest updateRequest, String sellerUsername) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        if (!Objects.equals(product.getSeller().getUsername(), sellerUsername)) {
            throw new UnauthorizedOperationException("You are not authorized to update this product.");
        }

        product.setName(updateRequest.name());
        product.setDescription(updateRequest.description());
        product.setPrice(updateRequest.price());

        if (updateRequest.categoryId() != null) {
            ProductCategory newCategory = productCategoryService.findCategoryById(updateRequest.categoryId());
            product.setCategory(newCategory);
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long productId, String sellerUsername) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        if (!Objects.equals(product.getSeller().getUsername(), sellerUsername)) {
            throw new UnauthorizedOperationException("You are not authorized to delete this product.");
        }

        productRepository.delete(product);
    }
}
