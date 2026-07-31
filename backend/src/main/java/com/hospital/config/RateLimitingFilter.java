package com.hospital.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(1)
public class RateLimitingFilter extends OncePerRequestFilter {
    private final Map<String, RateLimitEntry> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        boolean needsLimit = path.contains("/api/auth/") || path.contains("/api/admin/");

        if (needsLimit) {
            String key = request.getRemoteAddr() + ":" + path;
            long now = System.currentTimeMillis();
            RateLimitEntry entry = requestCounts.computeIfAbsent(key, k -> new RateLimitEntry(now));

            synchronized (entry) {
                if (now - entry.windowStart > 60000) {
                    entry.windowStart = now;
                    entry.count.set(1);
                } else if (entry.count.incrementAndGet() > 20) {
                    response.setStatus(429);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private static class RateLimitEntry {
        long windowStart;
        AtomicInteger count;

        RateLimitEntry(long now) {
            this.windowStart = now;
            this.count = new AtomicInteger(1);
        }
    }
}
