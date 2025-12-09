package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.dto.BoardDTO;
import com.example.appdev.poliquitoct6.dto.BoardCreationDTO; // Input DTO for creation
import com.example.appdev.poliquitoct6.util.DTOMapper;
import com.example.appdev.poliquitoct6.entity.Board;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.repository.BoardRepository;
import com.example.appdev.poliquitoct6.repository.UserRepository;
import com.example.appdev.poliquitoct6.repository.PinRepository; // To calculate pin count
import com.example.appdev.poliquitoct6.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final PinRepository pinRepository;

    // Constructor Injection
    public BoardService(BoardRepository boardRepository, UserRepository userRepository, PinRepository pinRepository) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
        this.pinRepository = pinRepository;
    }

    // --- Private Helper to Get Pin Count ---
    private Integer getPinCountForBoard(Long boardId) {
        return pinRepository.countByBoard_BoardId(boardId);
    }


    // 1. Creation Method (Accepts DTO, Returns DTO)
    public BoardDTO createBoard(BoardCreationDTO creationDto, Long userId) {

        // 1. Convert DTO to Entity
        Board newBoard = DTOMapper.fromBoardCreationDTO(creationDto);

        // 2. Fetch required related entity (User)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // 3. Set ownership and creation date
        newBoard.setUser(user);
        newBoard.setCreatedAt(LocalDateTime.now());

        // 4. Save and map back to DTO
        Board savedBoard = boardRepository.save(newBoard);

        // New boards have 0 pins
        return DTOMapper.toBoardDTO(savedBoard, 0);
    }
    // 2. Retrieval by ID (Returns DTO)
    public BoardDTO getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with ID: " + id));

        Integer pinCount = getPinCountForBoard(id);

        return DTOMapper.toBoardDTO(board, pinCount);
    }

    // 3. Retrieval All (Returns List<DTO>)
    public List<BoardDTO> getAllBoards() {
        return boardRepository.findAll().stream()
                // Map each entity, calculate the pin count on the fly, and use the DtoMapper
                .map(board -> DTOMapper.toBoardDTO(board, getPinCountForBoard(board.getBoardId())))
                .collect(Collectors.toList());
    }


    // 4. Retrieval by User ID (Returns List<DTO>)
    public List<BoardDTO> getBoardsByUserId(Long userId) {
        // Assuming BoardRepository has a method 'findByUserId' defined
        List<Board> boards = boardRepository.findByUser_UserId(userId);

        return boards.stream()
                .map(board -> DTOMapper.toBoardDTO(board, getPinCountForBoard(board.getBoardId())))
                .collect(Collectors.toList());
    }


    // 5. Delete Board (Still accepts ID)
    public void deleteBoard(Long id) {
        if (!boardRepository.existsById(id)) {
            throw new ResourceNotFoundException("Board not found with ID: " + id);
        }
        boardRepository.deleteById(id);
    }
}