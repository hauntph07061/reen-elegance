CREATE TABLE shops (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    map_iframe TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO shops (name, address, phone, map_iframe) VALUES
('Chi nhánh Quận 1', 'Số 12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', '0901 123 456', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.516843657788!2d106.7021671!3d10.7724395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4165682855%3A0xc07ce8fb4eefb747!2zTmfCuyBIdeG7hywgUXXhuq1uIDEsIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'),
('Chi nhánh Quận 3', 'Số 45 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM', '0902 234 567', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.418299292857!2d106.6908581!3d10.7792437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a612542a1%3A0x6b4421111624c965!2zVsO1IFbEg24gVOG6p24sIFF14bqtbiAzLCBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1700000000001!5m2!1svi!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'),
('Chi nhánh Gò Vấp', 'Số 89 Quang Trung, Phường 10, Quận Gò Vấp, TP.HCM', '0903 345 678', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7758362615995!2d106.666986!3d10.8284643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290b2848c7bd%3A0x5824e4d5fb51fb66!2zUXVhbmcgVHJ1bmcsIEfDsiBW4bqlcCwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1700000000002!5m2!1svi!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'),
('Chi nhánh Hoàn Kiếm', 'Số 15 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội', '0904 456 789', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0883296185854!2d105.852445!3d21.0291515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abe850024987%3A0xe54e6012c8b73f88!2zVHLDoG5nIFRp4buBbiwgSG_DoG4gS2nhurFtLCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1700000000003!5m2!1svi!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'),
('Chi nhánh Cầu Giấy', 'Số 99 Xuân Thủy, Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội', '0905 567 890', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9023472097984!2d105.7831131!3d21.0366668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab355cae5f2b%3A0x6b4fb6c1eb258de1!2zWHXDom4gVGjhu6d5LCBD4bqndSBHaeG6pXksIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1700000000004!5m2!1svi!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>');

SELECT setval('shops_id_seq', 5);
