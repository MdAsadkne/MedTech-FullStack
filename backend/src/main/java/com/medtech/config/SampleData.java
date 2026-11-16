package com.medtech.config;

import com.medtech.medicine.Medicine;
import com.medtech.medicine.MedicineRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SampleData {
    @Bean
    CommandLineRunner seedCatalogue(MedicineRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.save(entry("Allergy Relief 10 mg", "Allergy", "Fictional sample listing for the catalogue demo.", "58.50", true));
            repository.save(entry("Daily Wellness Pack", "Wellness", "Illustrative catalogue data only.", "249.00", false));
            repository.save(entry("First Aid Essentials", "First aid", "Fictional general first aid category example.", "315.00", false));
            repository.save(entry("Hydration Salts", "Wellness", "Sample entry used to demonstrate catalogue search.", "42.00", false));
            repository.save(entry("Skin Care Cream", "Personal care", "Fictional item. No medical claims are made.", "180.00", false));
            repository.save(entry("Vitamin C 500 mg", "Supplements", "Fictional sample listing for the catalogue demo.", "99.00", false));
        };
    }

    private Medicine entry(String name, String category, String description, String price, boolean prescriptionRequired) {
        Medicine medicine = new Medicine();
        medicine.setName(name);
        medicine.setCategory(category);
        medicine.setDescription(description);
        medicine.setPrice(new BigDecimal(price));
        medicine.setPrescriptionRequired(prescriptionRequired);
        return medicine;
    }
}
