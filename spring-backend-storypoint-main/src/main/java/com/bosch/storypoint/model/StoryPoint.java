package com.bosch.storypoint.model;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class StoryPoint {
    
    @Id
    private String issueKey;
    private Integer storyPoint;

    
}
