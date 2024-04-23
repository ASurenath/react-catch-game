import { useEffect, useState } from 'react';
import './App.css';
import { Button } from 'react-bootstrap';

function App() {
  const [particles, setParticles] = useState([])
  const [count, setCount] = useState(0);
  const [trayPos, setTrayPos] = useState(0.05)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameRunning, setGameRunning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameRunning) {
        updateParticles()
        setCount(count + 1);
      }
    }, timeStep);
    return () => clearInterval(interval);
  }, [count, gameRunning]);

  const play = () => {
    setGameRunning(true)
  }
  const pause = () => {
    setGameRunning(false)
  }
  // parameters
  const trayHalf = 0.05
  const trayStep = 0.05
  const particleStep = 0.01
  const timeStep=50 //ms
  // console.log(particles);
  console.log(gameOver);
  const updateParticles = () => {
    let tempParticles = [...particles]
    // particle fall
    tempParticles.forEach((particle, index) => {
      particle[1] -= particleStep
      if (particle[1] <= 0) {
        if (trayPos - trayHalf < particle[0] && trayPos + trayHalf > particle[0]) {
          setScore(score + 10)
        }
        else {
          setGameOver(true)
          setGameRunning(false)
        }
        tempParticles.splice(index, 1)
      }
    })
    // add particle
    if (count % 50 == 0) {
      let x = Math.random()
      tempParticles.push([x, 1])
      setParticles(tempParticles)
    }
    setParticles(tempParticles)
  }

  // const interval = setInterval(addParticle, 1000);
  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key == 'ArrowRight') {
      if (trayPos + 0.1 > .95)
        setTrayPos(1 - trayHalf)
      else {
        setTrayPos(trayPos + trayStep)
      }
    }
    if (e.key == 'ArrowLeft') {
      if (trayPos - 0.1 < trayHalf)
        setTrayPos(trayHalf)
      else {
        setTrayPos(trayPos - trayStep)
      }
    }
  }
  const restart=()=>{
    setCount(0)
    setGameOver(false)
    setScore(0)
    setGameRunning(true)
    setParticles([])
  }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-100" tabIndex={0} onKeyDown={handleKeyDown} style={{ height: '100vh' }}>
      <h1>Catch game</h1>
      <div className='d-flex justify-content-evenly w-100'>
        <h1><i className="fa-solid fa-clock"></i>: {Math.floor(count*(timeStep/1000))}s</h1>
        <h1>Score: {score}</h1>
        <Button variant='warning' disabled={!gameRunning} onClick={pause}>Pause <i className="fa-solid fa-pause"></i></Button>
      </div>
      <div className='bg position-relative'>
        {particles.map((i, index) =>
          <div key={index} className='particle bg-dark' style={{ left: `${(i[0] * 500) - 5}px`, bottom: `${(i[1] * 500) + 5}px` }}></div>)}

        <div className='tray' style={{ width: `${0.1 * 500}px`, left: `${(trayPos - 0.05) * 500}px` }}></div>
        {!gameRunning? gameOver?
        <div className='gameover' onClick={restart}><h1>Game Over! Play again <i class="fa-solid fa-rotate-right"></i></h1></div>
      :<div className='play' onClick={play}><h1>Play <i className="fa-solid fa-play"></i></h1></div>
    :""}
      </div>

    </div>
  );
}

export default App;
