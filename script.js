const { useState, useEffect, useRef } = React;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Session");

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // TIMER
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            audioRef.current.play();

            if (mode === "Session") {
              setMode("Break");
              return breakLength * 60;
            } else {
              setMode("Session");
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, breakLength, sessionLength]);

  // FORMAT TIME
  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  // RESET
  const handleReset = () => {
    clearInterval(intervalRef.current);

    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setMode("Session");

    if (audioRef.current) {
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
}
  };

  // CHANGE SESSION
  const changeSession = (amount) => {
    if (isRunning) return;

    setSessionLength(prev => {
      const newVal = prev + amount;
      if (newVal < 1 || newVal > 60) return prev;

      if (mode === "Session") {
        setTimeLeft(newVal * 60);
      }

      return newVal;
    });
  };

  // CHANGE BREAK
  const changeBreak = (amount) => {
    if (isRunning) return;

    setBreakLength(prev => {
      const newVal = prev + amount;
      if (newVal < 1 || newVal > 60) return prev;
      return newVal;
    });
  };

  return (
    <div className="App">
  <h1>25 + 5 Clock</h1>

  <div className="length-container">
    {/* Break */}
    <div>
      <h2 id="break-label">Break Length</h2>
      <button id="break-decrement" onClick={() => changeBreak(-1)}><i className="fas fa-arrow-down"></i></button>
      <span id="break-length">{breakLength}</span>
      <button id="break-increment" onClick={() => changeBreak(1)}><i className="fas fa-arrow-up"></i></button>
    </div>

    {/* Session */}
    <div>
      <h2 id="session-label">Session Length</h2>
      <button id="session-decrement" onClick={() => changeSession(-1)}><i className="fas fa-arrow-down"></i></button>
      <span id="session-length">{sessionLength}</span>
      <button id="session-increment" onClick={() => changeSession(1)}><i className="fas fa-arrow-up"></i></button>
    </div>
  </div>

  {/* Timer */}
  <div className="timer-box">
    <h2 id="timer-label">
      {mode === "Session" ? "Session" : "Break"}
    </h2>
    <div id="time-left">{formatTime(timeLeft)}</div>
  </div>

  {/* Controls */}
  <div className="controls">
    <button id="start_stop" onClick={() => setIsRunning(!isRunning)}>
      <i className={isRunning ? "fas fa-pause" : "fas fa-play"}></i>
    </button>

    <button id="reset" onClick={handleReset}>
     <i className="fas fa-sync-alt"></i>
    </button>
  </div>
      <audio
  id="beep"
  ref={audioRef}
  src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
/>
</div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);