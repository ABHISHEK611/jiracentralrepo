package com.bosch.storypoint.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bosch.storypoint.model.StoryPoint;

@Repository
public interface StoryPointRepository extends JpaRepository<StoryPoint,String>{
    
}
