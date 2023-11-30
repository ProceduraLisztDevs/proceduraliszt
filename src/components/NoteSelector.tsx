import Select from "react-select"
import { Note } from "../music_theory/Note"
import { useState } from "react"
import { Grabber } from "../wfc/Grabber"
import { constantGrabber } from "../wfc/grabbers/constantGrabbers"
import { FifthOfChordGrabber, RootOfChordGrabber, ThirdOfChordGrabber } from "../wfc/grabbers/noteGrabbers"
import { selectStyles } from "../styles"
import { ConstantNoteSelector } from "./ConstantNoteSelector"
import { SelectNoteOption, SelectOption } from "./utils"
import { HigherValues } from "../wfc/HigherValues"

interface NoteSelectorProps {
	setValue: (_: NoteSelectorResult) => void
	startValue?: NoteSelectorResult
}

export type NoteSelectorResult = Grabber<Note> | null

const noteSelectorOptions = [
	{ label: "Root of chord", value: "RootOfChord" },
	{ label: "Third of chord", value: "ThirdOfChord" },
	{ label: "Fifth of chord", value: "FifthOfChord" },
	{ label: "Custom", value: "Custom" },
]

const resultToOption = (result: NoteSelectorResult) => {
	switch (result) {
		case null: return null
		case RootOfChordGrabber: return noteSelectorOptions[0]
		case ThirdOfChordGrabber: return noteSelectorOptions[1]
		case FifthOfChordGrabber: return noteSelectorOptions[2]
		default: // Constant note
			return { ...noteSelectorOptions[3], note: result({} as HigherValues) }
	}
}

export function NoteSelector({ setValue, startValue }: NoteSelectorProps) {
	const startOption = resultToOption(startValue ?? null)
	const [selected, setSelected] = useState(startOption as SelectOption)
	const [customNoteSelected, setCustomNoteSelected] = useState((startOption as { note: Note })?.note ?? Note.C)

	const buildConstantGrabber = (option: SelectNoteOption) => {
		if (option === null) throw new Error("Invalid option")
		setValue(constantGrabber(option.value))
	}

	return <>
		<Select options={noteSelectorOptions} placeholder={"Select a note..."} styles={selectStyles}
			value={selected}
			onChange={(option) => {
				setSelected(option)
				switch (option?.value) {
					case "RootOfChord":
						setValue(RootOfChordGrabber)
						break
					case "ThirdOfChord":
						setValue(ThirdOfChordGrabber)
						break
					case "FifthOfChord":
						setValue(FifthOfChordGrabber)
						break
					case "Custom":
						if (customNoteSelected === null) throw new Error("Invalid custom note selected")
						setValue(constantGrabber(customNoteSelected))
						break
					default:
						throw new Error("Invalid note selector option")
				}
			}} />
		{selected?.value === "Custom" && <ConstantNoteSelector value={customNoteSelected} setValue={setCustomNoteSelected} onChange={buildConstantGrabber} />}
	</>
}