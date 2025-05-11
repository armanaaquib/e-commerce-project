package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.response.ProductResponse;
import com.ju.e_commerce_project.dto.request.AddProductRequest;
import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.service.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    @Test
    void addProduct_ValidRequest_ReturnsProductResponse() {
        // Arrange
        AddProductRequest productRequest = new AddProductRequest("Test Product", "Test Description", new BigDecimal("10.00"), 1L);
        ProductCategory category = new ProductCategory("Test Category");
        category.setId(1L);
        Product product = new Product("Test Product", "Test Description", new BigDecimal("10.00"), category, null);
        product.setId(1L);

        when(productService.addProduct(any(AddProductRequest.class))).thenReturn(product);

        ResponseEntity<ProductResponse> response = productController.addProduct(productRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertProduct(product, response.getBody());
    }

    @Test
    void getProductsByCategory_ExistingCategory_ReturnsListOfProductResponses() {
        Long categoryId = 1L;
        ProductCategory category = new ProductCategory("Test Category");
        category.setId(categoryId);
        List<Product> products = new ArrayList<>();
        Product product1 = new Product("Product 1", "Description 1", new BigDecimal("10.00"), category, null);
        product1.setId(1L);
        Product product2 = new Product("Product 2", "Description 2", new BigDecimal("20.00"), category, null);
        product2.setId(2L);
        products.add(product1);
        products.add(product2);

        when(productService.getProductsByCategory(categoryId)).thenReturn(products);

        ResponseEntity<List<ProductResponse>> response = productController.getProductsByCategory(categoryId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertProduct(product1, response.getBody().get(0));
        assertProduct(product2, response.getBody().get(1));
    }

    private static void assertProduct(Product product, ProductResponse response) {
        assertEquals(product.getId(), response.id());
        assertEquals(product.getName(), response.name());
        assertEquals(product.getDescription(), response.description());
        assertEquals(product.getPrice(), response.price());
        assertEquals(product.getCategory().getName(), response.categoryName());
    }
}
