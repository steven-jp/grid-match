package com.example.Authentication.Security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class JwtUtil {
    private final long TOKEN_EXPIRATION = System.currentTimeMillis() + 120 * 60 * 1000; // 2hrs
    private String secret;

    public JwtUtil(String secret) {
        this.secret = secret;
    }

    public String generateToken(Authentication authResult){
        UserDetailsImpl user = (UserDetailsImpl) authResult.getPrincipal();
        List<String> roles = new ArrayList<>();
        for (GrantedAuthority authority : user.getAuthorities()) {
            roles.add(authority.toString());
        }
        return JWT.create().withSubject(user.getUsername())
                .withClaim("roles", roles)
                .withExpiresAt(new Date(TOKEN_EXPIRATION))
                .sign(Algorithm.HMAC256(secret));
    }

    public Claim getRoles(String token){
        return JWT.decode(token).getClaim("roles");
    }

    public boolean isExpired(String token){
        return JWT.decode(token).getExpiresAt().before(new Date());
    }

    //verify token is active and belongs to authenticated user
    public boolean validateToken(String token, UserDetails user){
        if (isExpired(token)){
            return false;
        }
        return getUsername(token).equals(user.getUsername());
    }

    public String getUsername(String token) {
        return JWT.decode(token).getSubject();
    }
}
