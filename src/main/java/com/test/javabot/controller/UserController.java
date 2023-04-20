package com.test.javabot.controller;

import com.test.javabot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.test.javabot.model.User;


@RestController
@RequestMapping("/javabot/users")
public class UserController 
{
	@Autowired
	UserService userService;


	@PostMapping("/login")
	public ResponseEntity<User> doLogin(@RequestBody User user)
	{
		return userService.checkUser(user);
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> doRegister(@RequestBody User user)
	{
		return userService.addUser(user);
	}
	
	@PutMapping("/changepwd/{id}")
	public ResponseEntity<User> doChangePwd(@PathVariable int id, @RequestBody User userDetails)
	{
		return userService.updateUserPassword(id, userDetails);
	}

	@GetMapping("/logout")
	public ResponseEntity<String> doLogout() {
		userService.removeSession();
		return new ResponseEntity(null, HttpStatus.OK);
	}
}