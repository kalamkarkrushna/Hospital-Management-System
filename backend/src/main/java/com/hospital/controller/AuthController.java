package com.hospital.controller;

import com.hospital.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body, HttpServletResponse response) {
        Map<String, Object> result = authService.register(
                body.get("hospitalName"), body.get("name"), body.get("email"),
                body.get("password"), body.get("phone"));
        setTokenCookie(response, result);
        return result;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body, HttpServletResponse response) {
        Map<String, Object> result = authService.login(body.get("email"), body.get("password"));
        setTokenCookie(response, result);
        return result;
    }

    private void setTokenCookie(HttpServletResponse response, Map<String, Object> result) {
        String token = (String) result.get("token");
        if (token != null) {
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(86400);
            cookie.setAttribute("SameSite", "Lax");
            response.addCookie(cookie);
        }
    }
}
