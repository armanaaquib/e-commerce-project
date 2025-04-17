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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

    @Test
    void getAllCategories_shouldReturnListOfCategories_whenRepositoryReturnsCategories() {
        ProductCategory cat1 = new ProductCategory("Electronics");
        cat1.setId(1L);
        ProductCategory cat2 = new ProductCategory("Books");
        cat2.setId(2L);
        List<ProductCategory> expectedCategories = Arrays.asList(cat1, cat2);

        when(productCategoryRepository.findAll()).thenReturn(expectedCategories);

        List<ProductCategory> actualCategories = productCategoryService.getAllCategories();

        assertNotNull(actualCategories, "The returned list should not be null.");
        assertEquals(2, actualCategories.size(), "The list size should match the expected size.");
        assertEquals(expectedCategories, actualCategories, "The returned list should match the expected list.");
        verify(productCategoryRepository, times(1)).findAll();
    }
}
