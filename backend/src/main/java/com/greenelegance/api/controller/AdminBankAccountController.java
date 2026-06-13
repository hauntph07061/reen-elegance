package com.greenelegance.api.controller;

import com.greenelegance.api.model.BankAccount;
import com.greenelegance.api.service.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/bank-accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBankAccountController {
    private final BankAccountService bankAccountService;

    @GetMapping
    public ResponseEntity<List<BankAccount>> getAll() {
        return ResponseEntity.ok(bankAccountService.getAllBankAccounts());
    }

    @PostMapping
    public ResponseEntity<BankAccount> create(@RequestBody BankAccount bankAccount) {
        return ResponseEntity.ok(bankAccountService.createBankAccount(bankAccount));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccount> update(@PathVariable Long id, @RequestBody BankAccount bankAccount) {
        return ResponseEntity.ok(bankAccountService.updateBankAccount(id, bankAccount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bankAccountService.deleteBankAccount(id);
        return ResponseEntity.ok().build();
    }
}
