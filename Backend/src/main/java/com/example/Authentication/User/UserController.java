package com.example.Authentication.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping("/user")
@RestController
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return service.getUser(id);
    }

//    @GetMapping
//    public String test() {
//        return "GET TEST! ";
//    }
    @GetMapping
    public ResponseEntity<Object> isLoggedIn() {
        return service.isLoggedIn();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) throws Exception {
        return service.loginUser(user);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody RegistrationDto user) {
        return service.registerUser(user);
    }

    //update password based on userid
    @PutMapping("/{email}/{password}/{newPassword}")
    public ResponseEntity<Object> updateUser(@PathVariable String email, @PathVariable String password, @PathVariable String newPassword) {
        return service.updateUserPassword(email, password, newPassword);
    }

    @DeleteMapping("/{email}/{password}")
    public ResponseEntity<Object> deleteUser(@PathVariable String email, @PathVariable String password) {
        return service.deleteUser(email, password);
    }
}
