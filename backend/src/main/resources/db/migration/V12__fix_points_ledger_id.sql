-- Sửa lại kiểu dữ liệu của cột id từ Integer (SERIAL) thành BIGINT cho khớp với Entity trong Java
ALTER TABLE points_ledger ALTER COLUMN id TYPE BIGINT;
