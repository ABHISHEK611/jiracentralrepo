package com.bosch.storypoint.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bosch.storypoint.repository.StoryPointRepository;

import java.util.List;
import com.bosch.storypoint.model.StoryPoint;

@Service
public class StoryPointService {
    
    @Autowired
    private StoryPointRepository pointRepository;

    public List<StoryPoint> list(){
        return pointRepository.findAll();
    }
    public StoryPoint insert(StoryPoint newStoryPoint){
       return pointRepository.save(newStoryPoint);
    }

   
}
