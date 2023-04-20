package com.test.javabot.service;

import com.test.javabot.model.Message;
import com.test.javabot.repository.MessageRepository;
import com.test.javabot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    MessageRepository messageRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    Session session;

    public ResponseEntity<List<Message>> getMessages() {
        if (session.getLevel() < 1)
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);

        return new ResponseEntity
                (messageRepo.findByUser(session.getUser()), HttpStatus.OK);
    }

    public ResponseEntity<List<Message>> saveMessage(Message message)
    {
        if(session.getLevel()<1)
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);

        List<Message> msgsResponseList = new ArrayList<>();
        message.setUser(session.getUser());
        message.setSent(LocalDateTime.now());
        message.setType("mine"); //his for bot
        msgsResponseList.add(messageRepo.save(message));
        Message botMsg = new Message();
        botMsg.setUser(session.getUser());
        botMsg.setSent(LocalDateTime.now());
        botMsg.setType("his");

        if(msgsResponseList.get(0).getContent().toLowerCase().contains("ciao")) {
            botMsg.setContent("Ciao " + session.getUser().getNickname() + "! sono il tuo bot, chiedimi tutto quello che vuoi!");
        } else if(msgsResponseList.get(0).getContent().toLowerCase().contains("java")) {
            botMsg.setContent("Java è un linguaggio di programmazione ad alto livello ed orientato agli oggetti");
        } else if(msgsResponseList.get(0).getContent().toLowerCase().contains("barzelletta")) {
            botMsg.setContent("Qual è il colmo per una lumaca? Chiamarsi Va-lentina!!");
        } else {
            botMsg.setContent("");
        }

        if(!botMsg.getContent().equals("")) {
            msgsResponseList.add(messageRepo.save(botMsg));
        }
        return new ResponseEntity(msgsResponseList, HttpStatus.OK);
    }

    public ResponseEntity<String> delete(int id)
    {
        if(session.getLevel()<1)
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);

        Optional<Message> toDelete = messageRepo.findById(id);


        if(toDelete.isEmpty())
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);

        if(toDelete.get().getUser().getId()!=session.getUser().getId())
            return new ResponseEntity(null, HttpStatus.FORBIDDEN);


        messageRepo.findByInreplyto(toDelete.get()).forEach( x -> {
            x.setDeletedReply(true);
            x.setInreplyto(null);
        });

        messageRepo.deleteById(id);
        return new ResponseEntity(null, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<String> deleteAllMsg()
    {
        if(session.getLevel()<1)
            return new ResponseEntity("Non sei loggato, torna al login", HttpStatus.FORBIDDEN);

        List<Message> toDelete = messageRepo.findByUser(session.getUser());

        if(toDelete.isEmpty())
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);

        messageRepo.deleteByUser(session.getUser());
        return new ResponseEntity(null, HttpStatus.OK);
    }


}
