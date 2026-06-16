package com.greenelegance.api.controller;

import com.greenelegance.api.entity.Category;
import com.greenelegance.api.entity.Post;
import com.greenelegance.api.entity.Product;
import com.greenelegance.api.repository.CategoryRepository;
import com.greenelegance.api.repository.PostRepository;
import com.greenelegance.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SeoController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;

    @org.springframework.beans.factory.annotation.Value("${app.seo.base-url:https://green-elegance.web.app}")
    private String baseUrl;

    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getRobotsTxt() {
        String robots = "User-agent: *\n" +
                        "Allow: /\n" +
                        "Sitemap: " + baseUrl + "/api/v1/sitemap.xml\n";
        return ResponseEntity.ok(robots);
    }

    @GetMapping(value = "/api/v1/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // Trang tĩnh
        appendUrl(xml, baseUrl + "/", "1.0");
        appendUrl(xml, baseUrl + "/shop", "0.9");
        appendUrl(xml, baseUrl + "/tin-tuc", "0.9");
        appendUrl(xml, baseUrl + "/lien-he", "0.8");
        appendUrl(xml, baseUrl + "/chinh-sach-giao-nhan", "0.5");
        appendUrl(xml, baseUrl + "/chinh-sach-doi-tra", "0.5");
        appendUrl(xml, baseUrl + "/chinh-sach-bao-mat", "0.5");

        // Categories
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            appendUrl(xml, baseUrl + "/shop?categoryId=" + category.getId(), "0.8");
        }

        // Products
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            appendUrl(xml, baseUrl + "/san-pham/" + product.getSlug(), "0.9");
        }

        // Posts
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
            appendUrl(xml, baseUrl + "/tin-tuc/" + post.getSlug(), "0.8");
        }

        xml.append("</urlset>");
        return ResponseEntity.ok(xml.toString());
    }

    private void appendUrl(StringBuilder xml, String loc, String priority) {
        xml.append("  <url>\n");
        xml.append("    <loc>").append(loc).append("</loc>\n");
        xml.append("    <priority>").append(priority).append("</priority>\n");
        xml.append("  </url>\n");
    }
}
