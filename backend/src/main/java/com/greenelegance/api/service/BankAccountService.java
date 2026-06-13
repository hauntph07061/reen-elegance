package com.greenelegance.api.service;

import com.greenelegance.api.model.BankAccount;
import com.greenelegance.api.repository.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankAccountService {
    private final BankAccountRepository bankAccountRepository;

    public List<BankAccount> getAllBankAccounts() {
        return bankAccountRepository.findAll();
    }

    public BankAccount getActiveBankAccount() {
        return bankAccountRepository.findByIsActiveTrue().orElse(null);
    }

    @Transactional
    public BankAccount createBankAccount(BankAccount bankAccount) {
        if (Boolean.TRUE.equals(bankAccount.getIsActive())) {
            deactivateAll();
        }
        return bankAccountRepository.save(bankAccount);
    }

    @Transactional
    public BankAccount updateBankAccount(Long id, BankAccount updatedAccount) {
        BankAccount account = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBankId(updatedAccount.getBankId());
        account.setAccountNo(updatedAccount.getAccountNo());
        account.setAccountName(updatedAccount.getAccountName());
        
        if (Boolean.TRUE.equals(updatedAccount.getIsActive()) && !Boolean.TRUE.equals(account.getIsActive())) {
            deactivateAll();
            account.setIsActive(true);
        } else if (updatedAccount.getIsActive() != null) {
            account.setIsActive(updatedAccount.getIsActive());
        }

        return bankAccountRepository.save(account);
    }

    @Transactional
    public void deleteBankAccount(Long id) {
        bankAccountRepository.deleteById(id);
    }

    private void deactivateAll() {
        List<BankAccount> activeAccounts = bankAccountRepository.findAll().stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsActive()))
                .toList();
        for (BankAccount account : activeAccounts) {
            account.setIsActive(false);
            bankAccountRepository.save(account);
        }
    }
}
