package com.greenelegance.api.controller;

import com.greenelegance.api.dto.ContactResponseDto;
import com.greenelegance.api.entity.ContactStatus;
import com.greenelegance.api.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/contacts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<Page<ContactResponseDto>> getAllContacts(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(contactService.getAllContacts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponseDto> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ContactResponseDto> updateContactStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusMap) {
        ContactStatus status = ContactStatus.valueOf(statusMap.get("status").toUpperCase());
        return ResponseEntity.ok(contactService.updateContactStatus(id, status));
    }
}
