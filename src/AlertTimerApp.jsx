import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AlertTimerApp = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [stopAtNextInterval, setStopAtNextInterval] = useState(false);
  const [timeframe, setTimeframe] = useState(15);
  const [nextTriggerTime, setNextTriggerTime] = useState(null);
  const audioRef = useRef(null);
  const endTimeRef = useRef(null);

  const calculateTimeToNextInterval = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const secondsToNextInterval = ((timeframe - (minutes % timeframe)) * 60) - now.getSeconds();
    return secondsToNextInterval;
  };

  const updateNextTriggerTime = () => {
    const now = new Date();
    const secondsToNext = calculateTimeToNextInterval();
    const nextTime = new Date(now.getTime() + secondsToNext * 1000);
    setNextTriggerTime(nextTime);
  };

  const startTimer = () => {
    const duration = calculateTimeToNextInterval();
    endTimeRef.current = new Date(new Date().getTime() + duration * 1000);
    setTimerActive(true);
    setTimeLeft(duration);
    setShowAlert(false);
    setStopAtNextInterval(false);
    updateNextTriggerTime();
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimeLeft(0);
    setStopAtNextInterval(false);
    setNextTriggerTime(null);
    setShowAlert(false);
  };

  const toggleTimer = () => {
    if (!timerActive) {
      startTimer();
    } else {
      setStopAtNextInterval(true);
    }
  };

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.error("Error playing sound:", error));
    }
  };

  const handleTimeframeChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value, 10) > 0)) {
      setTimeframe(value === "" ? "" : parseInt(value, 10));
      if (!timerActive) {
        updateNextTriggerTime();
      }
    }
  };

  useEffect(() => {
    let animationFrameId;

    const updateTimer = () => {
      if (timerActive && endTimeRef.current) {
        const now = new Date();
        const timeDiff = endTimeRef.current.getTime() - now.getTime();

        if (timeDiff <= 0) {
          playAlertSound();
          setShowAlert(true);
          
          if (stopAtNextInterval) {
            stopTimer();
          } else {
            startTimer(); // Reset the timer for the next interval
          }
        } else {
          setTimeLeft(Math.ceil(timeDiff / 1000));
          animationFrameId = requestAnimationFrame(updateTimer);
        }
      }
    };

    if (timerActive) {
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [timerActive, stopAtNextInterval, timeframe]);

  useEffect(() => {
    if (!timerActive) {
      updateNextTriggerTime();
    }
  }, [timeframe, timerActive]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Timeframe Alert Timer</h1>
      <div className="mb-4 flex items-center">
        <label htmlFor="timeframe" className="mr-2">Timeframe (minutes):</label>
        <Input 
          id="timeframe"
          type="number" 
          value={timeframe} 
          onChange={handleTimeframeChange}
          min="1"
          className="w-20"
          disabled={timerActive}
        />
      </div>
      <div className="flex space-x-2 mb-4">
        <Button onClick={toggleTimer}>
          {timerActive 
            ? (stopAtNextInterval ? "Cancel Stop" : `Stop at next ${timeframe}m timeframe`)
            : `Alert trigger at next ${timeframe}m timeframe time`}
        </Button>
        {timerActive && (
          <Button onClick={stopTimer} variant="destructive">
            Stop Now
          </Button>
        )}
      </div>
      {timerActive && (
        <p className="mb-4">Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
      )}
      {nextTriggerTime && (
        <p className="mb-4">Next trigger time: {formatTime(nextTriggerTime)}</p>
      )}
      {showAlert && (
        <Alert className="mb-4">
          <AlertTitle>Time's up!</AlertTitle>
          <AlertDescription>
            The next {timeframe}-minute interval has been reached.
          </AlertDescription>
        </Alert>
      )}
      <audio ref={audioRef}>
        <source src="https://assets.mixkit.co/active_storage/sfx/1000/1000.wav" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AlertTimerApp;
