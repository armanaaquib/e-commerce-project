package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.exception.ProductCategoryNotFoundException;
import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public ProductCategory findCategoryById(Long id) {
        Optional<ProductCategory> categoryOptional = productCategoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            throw new ProductCategoryNotFoundException(id);
        }

        return categoryOptional.get();
    }

    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }
}
