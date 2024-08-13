import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlayCircle, PauseCircle, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const TimerStatus = {
  STOPPED: 'stopped',
  RUNNING: 'running',
  PAUSED: 'paused',
};

export function EnhancedTimer() {
  const [targetTime, setTargetTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState(TimerStatus.STOPPED);
  const [showMilliseconds, setShowMilliseconds] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const formatTime = useCallback((time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    
    return showMilliseconds
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
      : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [showMilliseconds]);

  const targetTimeInSeconds = useMemo(() => {
    return targetTime.hours * 3600 + targetTime.minutes * 60 + targetTime.seconds;
  }, [targetTime]);

  useEffect(() => {
    let interval;
    if (status === TimerStatus.RUNNING) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 0.1;
          if (newTime >= targetTimeInSeconds) {
            clearInterval(interval);
            setStatus(TimerStatus.STOPPED);
            if (soundEnabled) {
              playAlarmSound();
            }
            return targetTimeInSeconds;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, targetTimeInSeconds, soundEnabled]);

  const handleTimeInput = useCallback((field) => (e) => {
    const value = Math.max(0, Math.min(parseInt(e.target.value, 10) || 0, field === 'hours' ? 99 : 59));
    setTargetTime((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleStart = useCallback(() => {
    if (targetTimeInSeconds > 0) {
      setStatus(TimerStatus.RUNNING);
    }
  }, [targetTimeInSeconds]);

  const handlePauseResume = useCallback(() => {
    setStatus((prevStatus) => 
      prevStatus === TimerStatus.RUNNING ? TimerStatus.PAUSED : TimerStatus.RUNNING
    );
  }, []);

  const handleReset = useCallback(() => {
    setStatus(TimerStatus.STOPPED);
    setElapsedTime(0);
  }, []);

  const playAlarmSound = () => {
    // In a real application, you would implement actual sound playing here
    console.log("Alarm sound played!");
  };

  const progressPercentage = useMemo(() => {
    return targetTimeInSeconds > 0 ? (elapsedTime / targetTimeInSeconds) * 100 : 0;
  }, [elapsedTime, targetTimeInSeconds]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Countup Timer</CardTitle>
        <CardDescription>Set your target time and start counting up</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-4xl font-bold text-center mb-2" style={{fontFamily: 'monospace'}}>
            {formatTime(elapsedTime)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Input type="number" placeholder="HH" value={targetTime.hours} onChange={handleTimeInput('hours')} min="0" max="99" />
          <Input type="number" placeholder="MM" value={targetTime.minutes} onChange={handleTimeInput('minutes')} min="0" max="59" />
          <Input type="number" placeholder="SS" value={targetTime.seconds} onChange={handleTimeInput('seconds')} min="0" max="59" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Switch id="show-ms" checked={showMilliseconds} onCheckedChange={setShowMilliseconds} />
            <Label htmlFor="show-ms">Show milliseconds</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            <Label htmlFor="sound">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleReset} variant="outline" className="w-1/4">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button onClick={handleStart} disabled={status !== TimerStatus.STOPPED} className="w-1/3">
          Start
        </Button>
        <Button onClick={handlePauseResume} disabled={status === TimerStatus.STOPPED} className="w-1/3">
          {status === TimerStatus.RUNNING ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EnhancedTimer;