package com.greenelegance.api.service;

import com.greenelegance.api.dto.ContactRequestDto;
import com.greenelegance.api.dto.ContactResponseDto;
import com.greenelegance.api.entity.Contact;
import com.greenelegance.api.entity.ContactStatus;
import com.greenelegance.api.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactResponseDto submitContact(ContactRequestDto request) {
        Contact contact = new Contact();
        contact.setFullName(request.getFullName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setSubject(request.getSubject());
        contact.setMessage(request.getMessage());
        
        Contact savedContact = contactRepository.save(contact);
        return mapToResponse(savedContact);
    }

    public Page<ContactResponseDto> getAllContacts(Pageable pageable) {
        return contactRepository.findAll(pageable).map(this::mapToResponse);
    }

    public ContactResponseDto getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        return mapToResponse(contact);
    }

    public ContactResponseDto updateContactStatus(Long id, ContactStatus status) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        
        contact.setStatus(status);
        Contact updatedContact = contactRepository.save(contact);
        return mapToResponse(updatedContact);
    }

    private ContactResponseDto mapToResponse(Contact contact) {
        return ContactResponseDto.builder()
                .id(contact.getId())
                .fullName(contact.getFullName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .subject(contact.getSubject())
                .message(contact.getMessage())
                .status(contact.getStatus())
                .createdAt(contact.getCreatedAt())
                .build();
    }
}
