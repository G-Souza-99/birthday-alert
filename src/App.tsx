import { useState } from 'react';
import confetti from 'canvas-confetti'; // Import the confetti library
import './App.css';

interface NamePosition {
  name: string;
  top: number;
  left: number;
}

function App() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showNames, setShowNames] = useState<NamePosition[]>([]); // Store names with random positions
  const [error, setError] = useState(false); // For triggering the shake and outline
  const [intervals, setIntervals] = useState<number[]>([]); // Store confetti intervals

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmitted(true);
      setError(false); // Reset error state if the name is valid
    } else {
      setError(true); // Trigger shake and red outline
      setTimeout(() => setError(false), 1000); // Remove error state after 1 second
    }
  };

  const handleBirthdayClick = () => {
    // Generate random top and left positions for the name
    const randomTop = Math.random() * 80; // Limit top position within 80% of viewport height
    const randomLeft = Math.random() * 80; // Limit left position within 80% of viewport width

    // Add the name with its random position to the list of names
    setShowNames(prevNames => [...prevNames, { name, top: randomTop, left: randomLeft }]);

    // Confetti effect
    const duration = 60 * 1000; // 60 seconds
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

      // Since particles fall down, start a bit higher than random
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

    // Remove each name after 3 seconds
    setTimeout(() => {
      setShowNames(prevNames => prevNames.slice(1)); // Remove the first name after timeout
    }, 3000);
  };

  const handleReset = () => {
    setName(''); // Clear the name
    setSubmitted(false); // Go back to the initial state
    setError(false); // Reset error state if resetting the form

    // Clear all active confetti intervals
    intervals.forEach(interval => clearInterval(interval));
    setIntervals([]); // Reset intervals
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
            className={error ? 'error-input' : ''} // Apply error styles if needed
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
                style={{ top: `${item.top}%`, left: `${item.left}%` }} // Apply random positions
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
