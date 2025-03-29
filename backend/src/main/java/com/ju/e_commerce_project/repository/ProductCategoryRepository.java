package com.ju.e_commerce_project.repository;

import com.ju.e_commerce_project.model.ProductCategory;
import jakarta.annotation.Nonnull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends CrudRepository<ProductCategory, Long> {
    @Nonnull
    Optional<ProductCategory> findById(@Nonnull Long id);
}
