import React, { useState, useRef, useEffect } from 'react';
import { XYPlot, LineSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, CircularGridLines } from 'react-vis';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

const Attractor = () => {
    const [attractorData, setAttractorData] = useState([]);
   
    const [isRecording, setRecording] = useState(false);
    const [recordedData, setRecordedData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [userInputTime, setUserInputTime] = useState(0);
    const intervalIdRef = useRef(null);
    const [intervalRunning, setIntervalRunning] = useState(false);

    const generateAttractorPoint = (t) => {
        const x = Math.cos(t);
        const y = Math.sin(t);
        return { x, y };
    };

    const updateAttractor = () => {
        const t = currentTime;
        const point = generateAttractorPoint(t);
        setAttractorData((prevData) => [...prevData, point]);
       
    
        setCurrentTime(t + 0.01);
        if (isRecording) {
            setRecordedData([...recordedData, point]);
            console.log("Recorded Data: ", recordedData);
        }
    };
    const toggleRecording = () => {
        setRecording((prevRecording) => !prevRecording);
    };


    const handleTimeInputChange = (event) => {
        setUserInputTime(event.target.value);
    };

    const submitTime = () => {
        if (intervalRunning) {
            clearInterval(); 
            setIntervalRunning(false);
        }
        setCurrentTime(parseFloat(userInputTime));
      
    };


        useEffect(() => {
            // Set up an interval that calls updateAttractor every 50 milliseconds
            intervalIdRef.current= setInterval(() => {
                updateAttractor();
                setIntervalRunning(true);
            }, 50);

            // Clean up the interval when the component unmounts
            return () => {
                clearInterval(intervalIdRef.current);
                setIntervalRunning(false);
            };
        }, [updateAttractor]);



    return (
        <><XYPlot width={600} height={400}>
            <CircularGridLines />
         
                <LineSeries data={attractorData} />
    
            <XAxis title="X" />
            <YAxis title="Y" />
        </XYPlot>
            <Button variant="contained" onClick={toggleRecording} sx={{mb:4}}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <label htmlFor="userInputTime" style={{ fontSize: '18px', margin: 6,color: 'white' }}>Enter Time between 0 and 1 below:</label>
            <Input
                type="number"
                value={userInputTime}
                onChange={handleTimeInputChange}
                placeholder="Enter time between 0 and 1"
                sx={{ mb: 2, color: 'white', '::placeholder': { color: 'white' }  }}
            />
            <Button variant="contained" onClick={submitTime}>Set Time</Button>
        </>
        );
};

export default Attractor;