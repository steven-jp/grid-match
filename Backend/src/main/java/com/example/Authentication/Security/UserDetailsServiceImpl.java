package com.example.Authentication.Security;

import com.example.Authentication.User.User;
import com.example.Authentication.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Optional<User> user = repo.findByEmail(s);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException(s);
        }
        return new UserDetailsImpl(user.get());
    }
}
