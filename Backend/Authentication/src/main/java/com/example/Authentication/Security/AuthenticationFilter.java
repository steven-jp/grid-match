package com.example.Authentication.Security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthenticationFilter extends OncePerRequestFilter {

    private AuthenticationManager manager;
    JwtUtil util;
    UserDetailsServiceImpl userDetailsService;

    public AuthenticationFilter(AuthenticationManager manager, JwtUtil util, UserDetailsServiceImpl userDetailsService) {
        this.manager = manager;
        this.util = util;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
       try {
           String authHeader = httpServletRequest.getHeader("authorization");
           String token = authHeader == null ? "" : authHeader;
           if (token.startsWith("Bearer : ")) {
               token = token.substring(9);
               UserDetails user = userDetailsService.loadUserByUsername(util.getUsername(token));
               if (util.validateToken(token, user)) {
                   UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword(), user.getAuthorities());
                   SecurityContextHolder.getContext().setAuthentication(auth);
               }
           }
       }catch (Exception e){
           e.printStackTrace();
       }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}



