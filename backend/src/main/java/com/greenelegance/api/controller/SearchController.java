package com.greenelegance.api.controller;

import com.greenelegance.api.dto.AutocompleteDto;
import com.greenelegance.api.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Hỗ trợ dev Frontend localhost
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/autocomplete")
    public ResponseEntity<AutocompleteDto> autocomplete(@RequestParam("q") String keyword) {
        if (keyword == null || keyword.trim().length() < 2) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(searchService.getAutocompleteSuggestions(keyword));
    }
}
