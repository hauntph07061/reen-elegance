package com.greenelegance.api.controller;

import com.greenelegance.api.model.BankAccount;
import com.greenelegance.api.service.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bank-accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BankAccountController {
    private final BankAccountService bankAccountService;

    @GetMapping("/active")
    public ResponseEntity<BankAccount> getActive() {
        BankAccount active = bankAccountService.getActiveBankAccount();
        if (active != null) {
            return ResponseEntity.ok(active);
        }
        return ResponseEntity.notFound().build();
    }
}
