import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
// import clickSound from './soundEffects/mixkit-game-ball-tap-2073.wav'
import catchSound from './soundEffects/catch.mp3'
import dropSound from './soundEffects/drop.mp3'


function App() {
  const [particles, setParticles] = useState([])
  const [count, setCount] = useState(0);
  const [trayPos, setTrayPos] = useState(0.05)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameRunning, setGameRunning] = useState(false)
  const [showWinnerMessage, setShowWinnerMessage] = useState(false)
  const [trayDragging, setTrayDragging] = useState(false)
  const audioCatch = useRef(null);
  const audioDrop = useRef(null);
  const gameBox = useRef(null)
  console.log(trayDragging);
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
    setShowWinnerMessage(false)
  }
  const pause = () => {
    setGameRunning(false)
  }
  // parameters
  const trayHalf = 0.05
  const trayStep = 0.05
  const winnerScore = 1000

  const particleStep = 0.005 * (1+(10*score / winnerScore))
  const timeStep = 50 //ms
  // console.log(particles);
  // console.log(gameOver);
  const updateParticles = () => {
    let tempParticles = [...particles]
    // particle fall
    tempParticles.forEach((particle, index) => {
      particle[1] -= particleStep
      if (particle[1] <= 0) {
        if (trayPos - trayHalf < particle[0] && trayPos + trayHalf > particle[0]) {
          if (score + 10 == winnerScore) {
            setShowWinnerMessage(true)
            setGameRunning(false)
          }
          setScore(score + 10)
          audioCatch.current.play()
          tempParticles.splice(index, 1)
        }
        else {
          setGameOver(true)
          setGameRunning(false)
          audioDrop.current.play()
        }

      }
    })
    // add particle
    if (count % Math.floor(100*winnerScore/(winnerScore+(10*score))) == 0) {
      let x = Math.random()
      tempParticles.push([x, 1])
      setParticles(tempParticles)
    }
    setParticles(tempParticles)
  }

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key == 'ArrowRight' && gameRunning) {
      if (trayPos + trayStep > 1 - trayHalf)
        setTrayPos(1 - trayHalf)
      else {
        setTrayPos(trayPos + trayStep)
      }
    }
    else if (e.key == 'ArrowLeft' && gameRunning) {
      if (trayPos - trayStep < trayHalf)
        setTrayPos(trayHalf)
      else {
        setTrayPos(trayPos - trayStep)
      }
    }
    else if (e.key == ' ' || e.key == 'Enter') {
      if (gameOver) {
        restart()
      }
      else { setGameRunning(!gameRunning) }
    }
  }
  const restart = () => {
    setCount(0)
    setGameOver(false)
    setScore(0)
    setGameRunning(true)
    setParticles([])
  }
  const handleDragOver = (e) => {
    var rect = gameBox.current
    var x = (e.clientX - rect.offsetLeft) / (rect.offsetWidth); //x position within the element.
    if (x < trayHalf) {
      setTrayPos(trayHalf)
    }
    else if (x > 1 - trayHalf) {
      setTrayPos(1 - trayHalf)
    }
    else { setTrayPos(x) }
  }
  const handleTouchMove = (e) => {
    if (trayDragging) {
      var rect = gameBox.current
      var x = (e.touches[0].clientX - rect.offsetLeft) / (rect.offsetWidth); //x position within the element.
      if (x < trayHalf) {
        setTrayPos(trayHalf)
      }
      else if (x > 1 - trayHalf) {
        setTrayPos(1 - trayHalf)
      }
      else { setTrayPos(x) }
    }
  }
  return (
    <>
      <div className="d-flex flex-column justify-content-between align-items-center w-100" tabIndex={0} onKeyDown={handleKeyDown} style={{ height: '100vh' }}>
        <h1 className='monoton-regular ' style={{height:'10%'}}>Catch game</h1>
        <div className='d-flex justify-content-evenly w-100 py-1' style={{height:'10%'}}>
          <h1><i className="fa-solid fa-clock"></i>: {Math.floor(count * (timeStep / 1000))}s</h1>
          <h1>Score: {score}</h1>
          <Button variant='outline-dark' disabled={!gameRunning} onClick={pause}>Pause <i className="fa-solid fa-pause"></i></Button>
        </div>
        <div className='bg position-relative' onTouchEnd={(e) => { setTrayDragging(false); e.preventDefault() }} onMouseMove={handleDragOver} onTouchMove={handleTouchMove} ref={gameBox}>
          {particles.map((i, index) =>
            <div key={index} className='particle bg-dark' style={{ left: `${i[0] * 100}%`, bottom: `${i[1] * 100}%` }}></div>)}

          <div className='tray' style={{ width: `${2 * trayHalf * 100}%`, left: `${(trayPos - trayHalf) * 100}%` }} onTouchStart={(e) => { setTrayDragging(true); e.preventDefault() }}
          // onDragEnd={()=>{setTrayDragging(false)}}
          ></div>
          {!gameRunning ?
            gameOver ?
              <div className='gameover' onClick={restart} onTouchEnd={restart}><h1>Game Over! Play again <i className="fa-solid fa-rotate-right"></i></h1></div>
              : showWinnerMessage ?
                <div className='winner-message' ><h1 className='text-center mt-5'>You won!<i className="fa-solid fa-medal fa-xl"></i></h1> <h1 className='play' onClick={play}>Continue</h1></div>
                : <div className='play' onClick={play} onTouchEnd={play}><h1>Play <i className="fa-solid fa-play"></i></h1></div>
            : ""}
        </div>
        <p className='text-secondary'>Created by anagha</p>
      </div>
      {/* sound effects */}
      <audio ref={audioCatch}>
        <source src={catchSound} type="audio/mp3" />
      </audio>
      <audio ref={audioDrop}>
        <source src={dropSound} type="audio/mp3" />
      </audio>
    </>
  );
}

export default App;
