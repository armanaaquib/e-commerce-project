package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.dto.request.AddProductRequest;
import com.ju.e_commerce_project.exception.ProductCategoryNotFoundException;
import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AuthService authService;

    @Mock
    private ProductCategoryService productCategoryService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void addProduct_ValidRequest_ReturnsSavedProduct() {
        AddProductRequest productRequest = new AddProductRequest("Test Product", "Test Description", new BigDecimal("10.00"), 1L);
        ProductCategory category = new ProductCategory("Test Category");
        category.setId(1L);
        User user = new User();
        user.setEmail("test@example.com");
        Product savedProduct = new Product(productRequest.name(), productRequest.description(), productRequest.price(), category, user);
        savedProduct.setId(1L);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(authService.findUserByUsername("test@example.com")).thenReturn(user);
        when(productCategoryService.findCategoryById(1L)).thenReturn(category);
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.addProduct(productRequest);

        assertNotNull(result);
        assertEquals(savedProduct.getId(), result.getId());
        assertEquals(savedProduct.getName(), result.getName());
        assertEquals(savedProduct.getDescription(), result.getDescription());
        assertEquals(savedProduct.getPrice(), result.getPrice());
        assertEquals(savedProduct.getCategory(), result.getCategory());
        assertEquals(savedProduct.getSeller(), result.getSeller());
    }

    @Test
    void addProduct_InvalidCategory_ThrowsProductCategoryNotFoundException() {
        AddProductRequest productRequest = new AddProductRequest("Test Product", "Test Description", new BigDecimal("10.00"), 99L);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(authService.findUserByUsername("test@example.com")).thenReturn(new User());
        when(productCategoryService.findCategoryById(99L)).thenThrow(new ProductCategoryNotFoundException(99L));

        assertThrows(ProductCategoryNotFoundException.class, () -> {
            productService.addProduct(productRequest);
        });
    }

    @Test
    void getProductsByCategory_ExistingCategory_ReturnsListOfProducts() {
        Long categoryId = 1L;
        List<Product> expectedProducts = new ArrayList<>();
        ProductCategory category = new ProductCategory("Test Category");
        category.setId(categoryId);
        User user = new User();
        user.setEmail("test@example.com");
        expectedProducts.add(new Product("Product 1", "Description 1", new BigDecimal("10.00"), category, user));
        expectedProducts.add(new Product("Product 2", "Description 2", new BigDecimal("20.00"), category, user));

        when(productRepository.findByCategoryId(categoryId)).thenReturn(expectedProducts);

        List<Product> actualProducts = productService.getProductsByCategory(categoryId);

        assertNotNull(actualProducts);
        assertEquals(2, actualProducts.size());
        assertEquals(expectedProducts.get(0).getName(), actualProducts.get(0).getName());
        assertEquals(expectedProducts.get(1).getName(), actualProducts.get(1).getName());
    }

    @Test
    void getProductsByCategory_NonExistingCategory_ReturnsEmptyList() {
        Long categoryId = 99L;
        when(productRepository.findByCategoryId(categoryId)).thenReturn(new ArrayList<>());

        List<Product> actualProducts = productService.getProductsByCategory(categoryId);

        assertNotNull(actualProducts);
        assertTrue(actualProducts.isEmpty());
    }
}