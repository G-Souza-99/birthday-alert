import { useState } from 'react';
import confetti from 'canvas-confetti';
import './App.css';

interface NamePosition {
  name: string;
  top: number;
  left: number;
}

function App() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showNames, setShowNames] = useState<NamePosition[]>([]); 
  const [error, setError] = useState(false);
  const [intervals, setIntervals] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmitted(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleBirthdayClick = () => {
    const randomTop = Math.random() * 80;
    const randomLeft = Math.random() * 80;

    setShowNames(prevNames => [...prevNames, { name, top: randomTop, left: randomLeft }]);


    const duration = 60 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const confettiInterval: number = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(confettiInterval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      );
    }, 250);

    setIntervals(prev => [...prev, confettiInterval]);

    setTimeout(() => {
      setShowNames(prevNames => prevNames.slice(1));
    }, 3000);
  };

  const handleReset = () => {
    setName(''); 
    setSubmitted(false);
    setError(false);

    intervals.forEach(interval => clearInterval(interval));
    setIntervals([]);
  };

  return (
    <div className="container">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="name">Enter your name:</label>
          <input
            type="text"
            id="initial-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name here"
            className={error ? 'error-input' : ''}
          />
          <button className="button" type="submit">Submit Name</button>
        </form>
      ) : (
        <div className="after-wish">
          <div className="names-container">
            {showNames.map((item, index) => (
              <h1
                key={index}
                className="animated-name"
                style={{ top: `${item.top}%`, left: `${item.left}%` }}
              >
                {item.name}
              </h1>
            ))}
          </div>
          <button onClick={handleBirthdayClick} className="button">
            Get Birthday Wish!
          </button>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              id="second-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name here"
            />
            <div className="button-row">
              <button type="submit" className="small-button">Submit New Name</button>
              <button type="button" className="small-button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
