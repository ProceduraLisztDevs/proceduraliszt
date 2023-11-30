import { useState } from "react"
import { useAppContext } from "../AppState"
import Popup from "reactjs-popup"
import { stringToChordIR } from "../music_theory/Chord"
import { ChordPrototypeIR, ChordesqueIR, chordesqueIRToString, nameOfChordPrototypeIR } from "../wfc/hierarchy/Chordesque"

interface ChordTileProps {
	index: number;
	initialOptions?: string[];
}

function ChordTile({ index, initialOptions }: ChordTileProps) {
	const [popupOpen, setPopupOpen] = useState(false)
	const optionsString = (!initialOptions || initialOptions.length === 0) ? "*" : initialOptions.join(" | ")

	return (
		<div key={index} className='tile'>
			<button onClick={() => setPopupOpen(true)}>{optionsString}</button>
			<ChordValuesPopup popupOpen={popupOpen} index={index} setPopupOpen={setPopupOpen} initialOptions={initialOptions} />
		</div>
	)
}

interface ChordValuesInputProps {
	value: string
	setValue: (s: string) => void
}

export function ChordValuesInput({ value, setValue }: ChordValuesInputProps) {
	return <div style={{ display: "flex", gap: "0.5em" }}>
		<input type="text" onChange={e => setValue(e.target.value)} value={value} style={{ flex: 1 }} />
		<img src="hint.png" title="Try 'Dm' or 'C F'" width="30px" height="30px" />
	</div>
}

const parseChordsAndPrototypes = (input: string, chordPrototypes: ChordPrototypeIR[]): ChordesqueIR[] | undefined => {
	const items = input.split(" ").filter(item => item !== "")
	const out = [] as ChordesqueIR[]
	for (const item of items) {
		if (chordPrototypes.some(proto => nameOfChordPrototypeIR(proto) === item)) {
			out.push(item)
		} else {
			const chord = stringToChordIR(item)
			if (chord) {
				out.push(chord)
			} else {
				return undefined
			}
		}
	}
	return out
}

interface ChordValuesPopupProps {
	popupOpen: boolean
	index: number
	setPopupOpen: (b: boolean) => void
	initialOptions: string[] | undefined
}
function ChordValuesPopup({ popupOpen, index, setPopupOpen, initialOptions }: ChordValuesPopupProps) {
	const [input, setInput] = useState(initialOptions?.join(" ") || "")
	const { handleChordOptionsPerCellChange, chordPrototypes } = useAppContext()

	const chordesques = parseChordsAndPrototypes(input, chordPrototypes)

	return <Popup open={popupOpen} closeOnDocumentClick={false}>
		<div className='modal'>
			<h3>Set options for chord at position {index}</h3>
			<ChordValuesInput value={input} setValue={setInput} />
			<br />
			<p>Leaving this empty means allowing all chords</p>
			<button disabled={chordesques === undefined}
				onClick={() => {
					handleChordOptionsPerCellChange(index, chordesques as ChordesqueIR[])
					setPopupOpen(false)
				}}>Save</button>
			<button onClick={() => {
				setInput(initialOptions?.join(" ") || "")
				setPopupOpen(false)
			}}>Cancel</button>
		</div>
	</Popup>
}

export function ChordTiles() {
	const { numChords, chordOptionsPerCell } = useAppContext()
	const arr = Array(numChords).fill(0)

	return (
		<>
			<h3>Chords</h3>
			{arr.map((_, i) => (
				<ChordTile key={i} index={i} initialOptions={chordOptionsPerCell.get(i)?.map(chordesqueIRToString)} />
			))}
		</>
	)
}
