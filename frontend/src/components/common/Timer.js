import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';

const Timer = ({ durationInMinutes, onTimeUp, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [progress, setProgress] = useState(100);
  
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  useEffect(() => {
    // Initialize timer with the duration
    setTimeLeft(durationInMinutes * 60);
    
    // Start the countdown
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Calculate progress percentage
        const totalSeconds = durationInMinutes * 60;
        const newProgress = (newTime / totalSeconds) * 100;
        setProgress(newProgress);
        
        // Call the tick callback if provided
        if (onTick) {
          const elapsedSeconds = totalSeconds - newTime;
          onTick(elapsedSeconds);
        }
        
        // Handle time up
        if (newTime <= 0) {
          clearInterval(timer);
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [durationInMinutes, onTimeUp, onTick]);
  
  // Determine color based on time left
  const getColor = () => {
    if (progress > 50) return 'success';
    if (progress > 20) return 'warning';
    return 'error';
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <TimeIcon sx={{ mr: 1, color: getColor() + '.main' }} />
        <Typography variant="body2" color="textSecondary">
          Time Remaining
        </Typography>
      </Box>
      
      <Typography 
        variant="h4" 
        sx={{ 
          fontFamily: 'monospace', 
          fontWeight: 'bold',
          mb: 1,
          color: getColor() + '.main'
        }}
      >
        {formatTime(timeLeft)}
      </Typography>
      
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        color={getColor()}
        sx={{ height: 8, borderRadius: 5 }}
      />
    </Box>
  );
};

export default Timer;