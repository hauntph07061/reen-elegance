package com.greenelegance.api.controller;

import com.greenelegance.api.dto.ContactRequestDto;
import com.greenelegance.api.dto.ContactResponseDto;
import com.greenelegance.api.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contacts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponseDto> submitContact(@Valid @RequestBody ContactRequestDto request) {
        return ResponseEntity.ok(contactService.submitContact(request));
    }
}
