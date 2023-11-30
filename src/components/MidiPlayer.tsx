import { useRef, useState, useEffect } from "react"
import * as Tone from "tone"
import { OctavedNote } from "../music_theory/Note"

const normalizeYPositions = (yPositions: number[]): number[] => {
	const maxY = Math.max(...yPositions)
	return yPositions.map(y => maxY - y)
}

export type NoteOutput = {
	octavedNote: OctavedNote;
	startTime: number;
	duration: number;
};

type MidiPlayerProps = {
	notes: NoteOutput[];
	length: number;
	isPlaying: boolean;
	setIsPlaying: (isPlaying: boolean) => void;
	updatePlayer: () => void;
};

export function MidiPlayer({ notes, length, isPlaying, setIsPlaying, updatePlayer }: MidiPlayerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [currentNotesIndices, setCurrentNotesIndices] = useState<number[]>([])
	const synthRef = useRef<Tone.PolySynth>();
	if (!synthRef.current) {
		synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
	}
	const [volume, setVolume] = useState(-25)
	synthRef.current.volume.setValueAtTime(volume, Tone.context.currentTime)

	const noteRectHeight = 2
	const yPositions = notes.map(note => note.octavedNote.toY(noteRectHeight))
	const normalizedYPositions = normalizeYPositions(yPositions)
	const canvasHeight = Math.max(...normalizedYPositions) + 20

	useEffect(() => {
		drawNotes()
	}, [notes, currentNotesIndices])

	const resetPlayback = () => {
		setCurrentNotesIndices([])
		setIsPlaying(false)
		Tone.Transport.cancel()
		Tone.Transport.stop()
		synthRef.current!.releaseAll()
	}

	const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(event.target.value)
		setVolume(newVolume)
		synthRef.current!.volume.setValueAtTime(newVolume, Tone.context.currentTime)
	}

	const handleTogglePlayback = () => {
		if (isPlaying) {
			resetPlayback()
			return
		}
		Tone.Transport.cancel()

		Tone.start()
		setIsPlaying(true)
		let endTime = 0

		notes.forEach((note, i) => {
			Tone.Transport.schedule(time => {
				setCurrentNotesIndices(prevIndices => [...prevIndices, i])
				synthRef.current!.triggerAttack(note.octavedNote.toString(), time)
			}, note.startTime)

			const releaseTime = i < notes.length - 1 && notes[i + 1].octavedNote.toString() === note.octavedNote.toString()
				? note.startTime + note.duration - 0.05 // introduce a 50ms delay for same notes
				: note.startTime + note.duration

				Tone.Transport.schedule(time => {
				setCurrentNotesIndices(prevIndices => prevIndices.filter(index => index !== i))
				synthRef.current!.triggerRelease(note.octavedNote.toString(), time)
			}, releaseTime)

			endTime = Math.max(endTime, note.startTime + note.duration)
		})

		Tone.Transport.schedule(() => resetPlayback(), endTime + 0.1) // slight delay to ensure all notes are released
		Tone.Transport.start()
	}

	useEffect(() => {
		return () => {
			//synthRef.current?.dispose()
			resetPlayback()
		}
	}, [])

	const noteRectLength = 20

	const drawNotes = () => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		notes.forEach((note, index) => {
			const yPosition = normalizedYPositions[index]
			ctx.fillStyle = currentNotesIndices.includes(index) ? "red" : "blue"
			ctx.fillRect(note.startTime * noteRectLength, yPosition, note.duration * noteRectLength, noteRectHeight)
		})
	}

	return (
		<div style={{ paddingTop: "1em" , display: "flex", flexDirection: "row", maxWidth: "90vw", alignItems:"center"}}>
			<div>
				<button onClick={updatePlayer} disabled={isPlaying}>
					Generate
				</button>
				<button onClick={handleTogglePlayback} disabled={notes.length < 1}>
					{isPlaying ? "■" : "▶"}
				</button>
				<br />
				<div style={{ padding: "1em", width: "180px", textAlign: "center" }}>
					<label>
						{volume < -35 ? "🔈" : volume < -15 ? "🔉" : "🔊"}
						<input
							type="range"
							min="-50"
							max="0"
							step="5"
							value={volume}
							onChange={handleVolumeChange}
							style={{ marginLeft: "5px", verticalAlign: "middle" }}
						/>
					</label>
				</div>
			</div>
			
			
			{notes.length > 0 &&
			<div style={{ overflowX: "scroll", paddingTop: "1em" }}>
				<canvas ref={canvasRef} width={length * noteRectLength} height={canvasHeight}></canvas>
			</div>
			}
		</div>
	)
}
