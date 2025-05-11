package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.dto.request.AddProductRequest;
import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.repository.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;

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
}
