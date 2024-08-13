import * as React from 'react';
import {useState, useEffect} from 'react'

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

export function Timer() {
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  const flagStatus = Object.freeze({
    STOP: 0,
    START: 1,
    RESET: 2
  });

  const [countup, setCountup] = useState(0);

  const [flag, setFlag] = useState(flagStatus.RESET)

  const handleHour = (e) => {
    const value = e.target.value;
    if(value>=0) setHour(e.target.value)
  }

  const handleMinute = (e) => {
    const value = e.target.value;
    if(value>=0 && value<60) setMinute(e.target.value)
  }

  const handleSecond = (e) => {
    const value = e.target.value;
    if(value>=0 && value<60) setSecond(e.target.value)
  }

  useEffect(()=>{
    const stopTime = (+hour*3600)+(+minute*60)+ +second;
    if(flag===flagStatus.START && countup < stopTime) {
      let timer = setTimeout(()=>{
        setCountup(countup+1)
      }, 1)
  
      return () => clearTimeout(timer)
    }
  },[countup, flag])

  const [hhmmss, setHhmmss] = useState('')

  useEffect(() => {
    const s = countup % 60
    const m = (countup - s)/60 % 60
    const h = (countup - m*60 - s) / 3600

    const ss = ('0' + s).slice(-2)
    const mm = ('0' + m).slice(-2)
    
    setHhmmss(`${h}:${mm}:${ss}`)
  }, [countup])

  const handleReset = () => {
    setFlag(flagStatus.RESET)
    setCountup(0)
  }

  const handleStartStop = () => {
    if(flag===flagStatus.STOP || flag===flagStatus.RESET) setFlag(flagStatus.START)
    else setFlag(flagStatus.STOP)
  }

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Timer</CardTitle>
        <CardDescription>Countup</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="flex justify-center p-4 pt-0 text-4xl text-gray-800">{hhmmss}</p>
        <div className="text-gray-600">
          Stop time (h:mm:ss): 
          <div className="flex mt-2">
          <Input type="number" placeholder="H" className="mr-2" value={hour} onChange={handleHour} />
          <Input type="number" placeholder="m" className="mx-2" value={minute} onChange={handleMinute} />
          <Input type="number" placeholder="s" className="ml-2" value={second} onChange={handleSecond} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleReset} className="w-5/12">Reset</Button>
        <Button onClick={handleStartStop}  className="w-5/12">{flag===flagStatus.START ? 'Stop' : 'Start'}</Button>
      </CardFooter>
    </Card>
  );
}

export default Timer;
