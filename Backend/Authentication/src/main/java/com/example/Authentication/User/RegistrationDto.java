package com.example.Authentication.User;

public class RegistrationDto {
    private String email;
    private String password;
    private String confirmedPassword;

    public RegistrationDto(String email, String password, String confirmedPassword) {
        this.email = email;
        this.password = password;
        this.confirmedPassword = confirmedPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmedPassword() {
        return confirmedPassword;
    }

    public void setConfirmedPassword(String confirmedPassword) {
        this.confirmedPassword = confirmedPassword;
    }
}
