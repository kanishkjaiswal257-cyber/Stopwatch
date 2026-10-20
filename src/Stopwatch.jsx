import { useEffect, useRef, useState } from 'react'
import './Stopwatch.css'

const formatTime = (milliseconds) => {
    const centiseconds = Math.floor(milliseconds / 10) % 100
    const totalSeconds = Math.floor(milliseconds / 1000)
    const seconds = totalSeconds % 60
    const minutes = Math.floor(totalSeconds / 60)

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
}

function Stopwatch() {
    const [elapsed, setElapsed] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [laps, setLaps] = useState([])
    const startedAt = useRef(null)
    const pausedAt = useRef(0)

    useEffect(() => {
        if (!isRunning) return undefined

        const updateElapsed = () => {
            setElapsed(performance.now() - startedAt.current)
        }

        updateElapsed()
        const intervalId = window.setInterval(updateElapsed, 25)
        return () => window.clearInterval(intervalId)
    }, [isRunning])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space' && event.target === document.body) {
                event.preventDefault()
                toggleRunning()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    })

    const toggleRunning = () => {
        if (isRunning) {
            pausedAt.current = elapsed
            setIsRunning(false)
            return
        }

        startedAt.current = performance.now() - pausedAt.current
        setIsRunning(true)
    }

    const reset = () => {
        setIsRunning(false)
        setElapsed(0)
        setLaps([])
        startedAt.current = null
        pausedAt.current = 0
    }

    const addLap = () => {
        if (!isRunning || elapsed === 0) return

        const previousTotal = laps[0]?.total ?? 0
        setLaps((currentLaps) => [
            { total: elapsed, split: elapsed - previousTotal },
            ...currentLaps,
        ])
    }

    return (
        <main className="stopwatch-shell">
            <header className="topbar">
                <div className="brand-mark" aria-hidden="true">S</div>
                <div>
                    <p className="eyebrow">Time instrument / 01</p>
                    <h1>Stopwatch</h1>
                </div>
                <div className={`status ${isRunning ? 'status-live' : ''}`}>
                    <span className="status-dot" />
                    {isRunning ? 'Running' : 'Ready'}
                </div>
            </header>

            <section className="timer-panel" aria-label="Stopwatch display">
                <div className="timer-label">Elapsed time</div>
                <div className="timer" aria-live="polite">{formatTime(elapsed)}</div>
                <div className="ticks" aria-hidden="true">
                    <span /> <span /> <span /> <span /> <span /> <span /> <span />
                </div>
                <div className="controls">
                    <button className="button button-primary" type="button" onClick={toggleRunning}>
                        <span aria-hidden="true">{isRunning ? 'II' : '>'}</span>
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button className="button button-secondary" type="button" onClick={addLap} disabled={!isRunning}>
                        <span aria-hidden="true">+</span>
                        Lap
                    </button>
                    <button className="button button-quiet" type="button" onClick={reset} disabled={elapsed === 0 && laps.length === 0}>
                        Reset
                    </button>
                </div>
            </section>

            <section className="laps-panel" aria-labelledby="laps-title">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Recorded intervals</p>
                        <h2 id="laps-title">Laps</h2>
                    </div>
                    <span className="lap-count">{String(laps.length).padStart(2, '0')}</span>
                </div>
                {laps.length === 0 ? (
                    <div className="empty-state">Your recorded laps will appear here.</div>
                ) : (
                    <ol className="lap-list">
                        {laps.map((lap, index) => (
                            <li key={`${lap.total}-${index}`}>
                                <span className="lap-number">{String(laps.length - index).padStart(2, '0')}</span>
                                <span className="lap-name">Lap {laps.length - index}</span>
                                <span className="lap-split">+{formatTime(lap.split)}</span>
                                <strong>{formatTime(lap.total)}</strong>
                            </li>
                        ))}
                    </ol>
                )}
            </section>

            <footer className="footer-note">
                <span>Precision to 1/100 second</span>
                <span>Use spacebar to start / pause</span>
            </footer>
        </main>
    )
}

export default Stopwatch







 