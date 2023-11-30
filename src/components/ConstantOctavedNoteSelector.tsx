import { useState } from "react"
import { Note, OctavedNoteIR } from "../music_theory/Note"
import { ConstantNoteSelector } from "./ConstantNoteSelector"

interface ConstantOctavedNoteSelectorProps {
	label?: string
	defaultValue: OctavedNoteIR
	setResult: (_: OctavedNoteIR) => void
	onChange?: (_: OctavedNoteIR) => void
}

export function ConstantOctavedNoteSelector({ defaultValue, setResult, onChange, label }: ConstantOctavedNoteSelectorProps) {
	const onChangeUsed = (onChange === undefined ?
		((option: OctavedNoteIR) => {
			setResult(option)
		}) :
		((option: OctavedNoteIR) => {
			setResult(option)
			onChange(option)
		}))

	const [note, setNote] = useState(defaultValue.note)
	const [octave, setOctave] = useState(defaultValue.octave)

	const setNoteUsed = (note: Note) => {
		setNote(note)
		onChangeUsed({ note, octave })
	}

	const setOctaveUsed = (octave: number) => {
		setOctave(octave)
		onChangeUsed({ note, octave })
	}

	return <div className="constant-octaved-note-selector">
		{label && <p style={{margin:"-0.5em"}}>{label}</p>}
		<div style={{ display: "flex" }}>
			<ConstantNoteSelector
				style={{ flex: 1 }}
				placeholder={"Select a note"}
				value={note}
				setValue={setNoteUsed}
			/>
			<input
				style={{ flex: 0.8 }}
				type="number"
				placeholder="Octave"
				value={octave}
				min={0}
				max={8}
				onChange={(e) => {
					setOctaveUsed(parseInt(e.target.value))
				}}
			/>
		</div>
	</div>
}