package com.example.Authentication.User;

import com.example.Authentication.Security.JwtUtil;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository repo;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtil util;

    public ResponseEntity<?> loginUser(User user) throws Exception {
        try {
            Authentication auth = authenticationManager.authenticate(new
                    UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            String token = util.generateToken(auth);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization: Bearer ", token);
            return new ResponseEntity<Object>(headers,HttpStatus.OK);
        }catch (AuthenticationException e){
            throw new Exception("Invalid credentials");
        }
    }

    public ResponseEntity<Object> registerUser(RegistrationDto user) {
        //check if email exists in repo
        JSONObject json = new JSONObject();
        if (repo.existsByEmail(user.getEmail())){
            return responseBuilder("User with that email already exists", HttpStatus.UNAUTHORIZED);
        }
        //check empty fields
        if (user.getPassword().length() < 8){
            return responseBuilder("Password must be at least 8 characters", HttpStatus.UNAUTHORIZED);
        }
        if (user.getEmail().length() < 3){
            return responseBuilder("Incorrect email", HttpStatus.UNAUTHORIZED);
        }

        //check if passwords match
        if (!user.getPassword().equals(user.getConfirmedPassword())){
            json.appendField("Message", "Passwords do not match");
            return responseBuilder("Passwords do not match", HttpStatus.UNAUTHORIZED);
        }

        //create user object
        User newUser = new User();
        newUser.setRole(List.of("User"));
        newUser.setPassword(encoder.encode(user.getPassword()));
        newUser.setEmail(user.getEmail());

        repo.save(newUser);
        return responseBuilder("User " + newUser.getEmail() + " successfully registered", HttpStatus.OK);
    }

    public ResponseEntity<Object> deleteUser(String email, String password) {
        Optional<User> optionalUser = repo.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!encoder.matches(password,user.getPassword())){
                return responseBuilder("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
            repo.deleteById(user.getId());
            return responseBuilder("Deleted user : " + user.getId(), HttpStatus.OK);
        }
        return responseBuilder("User was not found", HttpStatus.UNAUTHORIZED);
    }

    public User getUser(Long id) {
        return repo.findById(id).orElse(new User());
    }

    public ResponseEntity<Object> updateUserPassword(String email, String password, String newPassword) {
        Optional<User> optionalUser = repo.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!encoder.matches(password,user.getPassword())){
                return responseBuilder("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
            //update to new password
            user.setPassword(encoder.encode(newPassword));
            repo.save(user);
            return responseBuilder("Updated User : " + user.getId(), HttpStatus.OK);

        }
        return responseBuilder("User was not found", HttpStatus.UNAUTHORIZED);
    }
    //authentication filter takes care of logged in check
    public ResponseEntity<Object> isLoggedIn() {
        return responseBuilder("User is logged in", HttpStatus.OK);
    }

    private ResponseEntity<Object> responseBuilder(String msg, HttpStatus status){
        JSONObject json = new JSONObject();
        json.appendField("Message", msg);
        return new ResponseEntity<Object>(json,status);
    }


}
