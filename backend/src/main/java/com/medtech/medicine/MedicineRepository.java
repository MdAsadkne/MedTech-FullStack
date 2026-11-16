package com.medtech.medicine;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrderByNameAsc(String name, String category);
    List<Medicine> findAllByOrderByNameAsc();
}
