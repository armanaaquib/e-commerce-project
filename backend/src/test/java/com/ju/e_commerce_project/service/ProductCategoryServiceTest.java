package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.exception.ProductCategoryNotFoundException;
import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.repository.ProductCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductCategoryServiceTest {

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @InjectMocks
    private ProductCategoryService productCategoryService;

    @Test
    void findCategoryById_ExistingId_ReturnsCategory() {
        Long categoryId = 1L;
        ProductCategory expectedCategory = new ProductCategory("Electronics");
        expectedCategory.setId(categoryId);

        when(productCategoryRepository.findById(categoryId)).thenReturn(Optional.of(expectedCategory));

        ProductCategory actualCategory = productCategoryService.findCategoryById(categoryId);

        assertNotNull(actualCategory);
        assertEquals(expectedCategory.getId(), actualCategory.getId());
        assertEquals(expectedCategory.getName(), actualCategory.getName());
    }

    @Test
    void findCategoryById_NonExistingId_ThrowsProductCategoryNotFoundException() {
        Long categoryId = 99L;
        when(productCategoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        assertThrows(ProductCategoryNotFoundException.class, () -> {
            productCategoryService.findCategoryById(categoryId);
        });
    }
}