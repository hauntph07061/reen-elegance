CREATE TABLE bank_accounts (
    id BIGSERIAL PRIMARY KEY,
    bank_id VARCHAR(50) NOT NULL,
    account_no VARCHAR(50) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO bank_accounts (bank_id, account_no, account_name, is_active)
VALUES ('bidv', '2601103280', 'NGUYEN TRAC HAU', TRUE);
