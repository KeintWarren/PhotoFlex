package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.entity.Pin;
import com.example.appdev.poliquitoct6.repository.PinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PinService {

    @Autowired
    private PinRepository pinRepository;

    public List<Pin> getAllPins() {
        return pinRepository.findAll();
    }

    public Optional<Pin> getPinById(Long id) {
        return pinRepository.findById(id);
    }

    public List<Pin> getPinsByUserId(Long userId) {
        return pinRepository.findByUser_UserId(userId);
    }

    public List<Pin> getPinsByBoardId(Long boardId) {
        return pinRepository.findByBoard_BoardId(boardId);
    }

    public Pin addPin(Pin pin) {
        pin.setCreatedDate(LocalDateTime.now());
        return pinRepository.save(pin);
    }

    public Pin updatePin(Long id, Pin updatedPin) {
        return pinRepository.findById(id).map(pin -> {
            pin.setBoard(updatedPin.getBoard());
            pin.setTitle(updatedPin.getTitle());
            pin.setDescription(updatedPin.getDescription());
            pin.setImageURL(updatedPin.getImageURL());
            return pinRepository.save(pin);
        }).orElseThrow(() -> new RuntimeException("Pin not found with id " + id));
    }

    public void deletePin(Long id) {
        pinRepository.deleteById(id);
    }
}
