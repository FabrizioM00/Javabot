package com.test.javabot.service;


import com.test.javabot.model.User;
import com.test.javabot.repository.MessageRepository;
import com.test.javabot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepo;

    @Autowired
    MessageRepository messageRepo;

    @Autowired
    Session session;

    /**
     * a questo metodo invio un json contenenti i campi name e password e solo quelli
     * lui li impacchetta in un utente e cerca di fare login con quei dati
     * se non ci riesce da' errore
     */
    public ResponseEntity<User> checkUser(User user) {
        Optional<User> present = userRepo.findByNickname(user.getNickname());
        if(present.isEmpty() || !BCrypt.checkpw(user.getPassword(), present.get().getPassword()))
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);
        session.setUser(present.get());

        return new ResponseEntity(present.get(), HttpStatus.OK);
    }

    public ResponseEntity<String> addUser(User user)
    {
        if(user == null)
            return new ResponseEntity("Invalid data", HttpStatus.FORBIDDEN);
        Optional<User> present = userRepo.findByNickname(user.getNickname());
        if(!present.isEmpty())
            return new ResponseEntity("Username already in use", HttpStatus.FORBIDDEN);

        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12)));
        String nick = userRepo.save(user).getNickname();
        return new ResponseEntity(nick, HttpStatus.OK);
    }

    public ResponseEntity<User> updateUserPassword(int id, User userDetails)
    {
        Optional<User> present = userRepo.findById(id);
        if(present.isEmpty())
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);

        User user = present.get();

        user.setPassword(BCrypt.hashpw(userDetails.getPassword(), BCrypt.gensalt(12)));
        return new ResponseEntity(userRepo.save(user), HttpStatus.OK);
    }

    public void removeSession()
    {
        session.setUser(null);
    }

}
