import { useEffect } from 'react';

export default function SEO({ title, description, image, url, schema }) {
  useEffect(() => {
    // 1. Cập nhật Title
    const defaultTitle = 'Green Elegance - Hoa Tươi & Cây Cảnh Cao Cấp';
    const finalTitle = title ? `${title} | Green Elegance` : defaultTitle;
    document.title = finalTitle;

    // Helper: Tạo hoặc cập nhật thẻ meta
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Cập nhật Description
    const defaultDesc = 'Cửa hàng hoa tươi và cây cảnh nghệ thuật cao cấp Green Elegance tại TP.HCM và Hà Nội. Giao hoa hỏa tốc 2h.';
    const finalDesc = description || defaultDesc;
    setMetaTag('name', 'description', finalDesc);

    // 3. Cập nhật Open Graph (OG)
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:type', 'website');
    if (url) setMetaTag('property', 'og:url', url);
    if (image) {
      setMetaTag('property', 'og:image', image);
    } else {
      setMetaTag('property', 'og:image', 'https://greenelegance.vn/default-og.jpg');
    }

    // 4. Cập nhật JSON-LD Schema
    let scriptElement = document.querySelector('script[id="structured-data"]');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'application/ld+json');
      scriptElement.setAttribute('id', 'structured-data');
      document.head.appendChild(scriptElement);
    }
    
    // Nếu có schema riêng thì dùng, không thì dùng schema LocalBusiness mặc định
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Florist",
      "name": "Green Elegance",
      "image": "https://greenelegance.vn/default-og.jpg",
      "url": "https://greenelegance.vn",
      "telephone": "0987654321",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Đường Láng",
        "addressLocality": "Đống Đa",
        "addressRegion": "Hà Nội",
        "addressCountry": "VN"
      }
    };
    
    scriptElement.textContent = JSON.stringify(schema || defaultSchema);

    // Cleanup khi component unmount
    return () => {
      // Giữ nguyên các thẻ meta nếu muốn, hoặc dọn dẹp để trang khác set lại.
      // (Đối với SPA, việc ghi đè lên nhau sẽ tự động xảy ra khi chuyển trang nên không cần xóa quá kỹ,
      // tuy nhiên ta có thể reset JSON-LD để không bị trùng lặp).
    };
  }, [title, description, image, url, schema]);

  return null; // Component này không render ra giao diện
}
