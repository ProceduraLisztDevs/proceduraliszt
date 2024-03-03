import { useState } from "react"
import Popup from "reactjs-popup"
import { useAppContext } from "../AppState"
import { OctavedNote, OctavedNoteIR, parseOctavedNoteIRs } from "../music_theory/Note"
import { H2tooltip } from "./tooltips"

interface NoteValuesPopupProps {
	popupOpen: boolean
	index: number
	setPopupOpen: (b: boolean) => void
	initialOptions: string[] | undefined
}

function NoteValuesPopup({ popupOpen, index, setPopupOpen, initialOptions }: NoteValuesPopupProps) {
	const [input, setInput] = useState(initialOptions?.join(" ") || "")
	const { handleNoteOptionsPerCellChange } = useAppContext()

	const notes = parseOctavedNoteIRs(input)

	return <Popup open={popupOpen} closeOnDocumentClick={false}>
		<div className='modal'>
			<h3>Set options for note at position {index}</h3>
			<div style={{ display: "flex", gap: "0.5em" }}>
				<input type="text" onChange={e => setInput(e.target.value)} value={input} style={{ flex: 1 }} />
				<img src="hint.png" title="Try 'C5' or 'E5 F5'" width="30px" height="30px" /> <br />
			</div>
			<br />
			<p>Leaving this empty means allowing all notes</p>
			<button disabled={notes === undefined}
				onClick={() => {
					handleNoteOptionsPerCellChange(index, notes as OctavedNoteIR[])
					setPopupOpen(false)
				}}>Save</button>
			<button onClick={() => {
				setInput(initialOptions?.join(" ") || "")
				setPopupOpen(false)
			}}>Cancel</button>
		</div>
	</Popup>
}

interface NoteTileProps {
	index: number
	initialOptions?: string[]
}

function NoteTile({ index, initialOptions }: NoteTileProps) {
	const [popupOpen, setPopupOpen] = useState(false)
	const optionsString = (!initialOptions || initialOptions.length === 0) ? "*" : initialOptions.join(" | ")

	return <div key={index} className='tile'>
		<button onClick={() => setPopupOpen(true)}>{optionsString}</button>
		<NoteValuesPopup popupOpen={popupOpen} index={index} setPopupOpen={setPopupOpen} initialOptions={initialOptions} />
	</div>
}

export function NoteTiles() {
	const { melodyLength, noteOptionsPerCell } = useAppContext()
	const arr = Array(melodyLength).fill(0)

	return <div>
		<H2tooltip title="Melody" hint="Set the options for each of the notes. These options will apply to each of the melody canvases (so for each chord within each section). Multiple options can be given per index. If left empty for a given index, all notes have a chance to be chosen (according to the constraints)."/>
		{arr.map((_, i) => <NoteTile key={i} index={i} initialOptions={noteOptionsPerCell.get(i)?.map(OctavedNote.IRtoString)} />)}
	</div>
}