package com.medtech.medicine;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
    private final MedicineRepository repository;

    public MedicineController(MedicineRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Medicine> list(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) return repository.findAllByOrderByNameAsc();
        String term = search.trim();
        return repository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrderByNameAsc(term, term);
    }

    @GetMapping("/{id}")
    public Medicine get(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catalogue item not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Medicine create(@Valid @RequestBody Medicine medicine) {
        return repository.save(medicine);
    }

    @PutMapping("/{id}")
    public Medicine update(@PathVariable Long id, @Valid @RequestBody Medicine input) {
        Medicine current = get(id);
        current.setName(input.getName());
        current.setDescription(input.getDescription());
        current.setCategory(input.getCategory());
        current.setPrice(input.getPrice());
        current.setPrescriptionRequired(input.isPrescriptionRequired());
        return repository.save(current);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(get(id));
    }
}

