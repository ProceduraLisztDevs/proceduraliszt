import { useState } from "react"
import { Note, OctavedNoteIR } from "../music_theory/Note"
import { ChordPrototypeIR } from "../wfc/hierarchy/Chordesque"
import { NoteConstraintIR } from "../wfc/constraints/constraintUtils"
import { ChordPrototypeProvider, useAppContext } from "../AppState"
import { InfiniteArray } from "../wfc/InfiniteArray"
import { NoteTiles } from "./NoteTiles"
import { NoteConstraints } from "./NoteConstraints"
import { buttonStyles, selectStyles } from "../styles"
import { InheritedBpmSelector, InheritedLengthSelector, MelodyKeySelector, melodyKeyTypeToOption } from "./GlobalSettings"
import { ChordIR, ChordQuality} from "../music_theory/Chord"
import Select from "react-select"
import { ConstantNoteSelector } from "./ConstantNoteSelector"
import { SelectKeyTypeOption, SelectOption } from "./utils"
import { InheritedRhythmSettings } from "./RhythmSettings"
import { NeighborRulesChordPrototype } from "./NeighborRules"

interface ChordPrototypeConfigProps {
	prototype: ChordPrototypeIR,
	removePrototype: () => void
	onUpdate: (changes: Partial<ChordPrototypeIR>) => void
}

export function ChordPrototypeConfig({ prototype, removePrototype, onUpdate }: ChordPrototypeConfigProps) {
	const updateNoteCanvasProps = (changes: Partial<ChordPrototypeIR["noteCanvasProps"]>) => {
		onUpdate({ noteCanvasProps: { ...prototype.noteCanvasProps, ...changes } })
	}
	const updateRhythmPatternOptions = (changes: Partial<ChordPrototypeIR["rhythmPatternOptions"]>) => {
		onUpdate({ rhythmPatternOptions: { ...prototype.rhythmPatternOptions, ...changes } })
	}

	const [noteOptionsPerCell, setNoteOptionsPerCell] = useState(prototype.noteCanvasProps.optionsPerCell)
	const handleNoteOptionsPerCellChange = (index: number, newNoteOptions: OctavedNoteIR[]) => {
		const newNoteOptionsPerCell = new InfiniteArray(noteOptionsPerCell)
		newNoteOptionsPerCell.set(index, newNoteOptions)
		setNoteOptionsPerCell(newNoteOptionsPerCell)
		updateNoteCanvasProps({ optionsPerCell: newNoteOptionsPerCell })
	}

	const [chordValue, setChordValue] = useState(prototype.chord)

	const [bpmStrategy, tempSetBpmStrategy] = useState(prototype.bpmStrategy)
	const setBpmStrategy = (newBpmStrategy: ChordPrototypeIR["bpmStrategy"]) => {
		tempSetBpmStrategy(newBpmStrategy)
		onUpdate({ bpmStrategy: newBpmStrategy })
	}

	const [bpm, tempSetBpm] = useState(prototype.bpm)
	const setBpm = (newBpm: number) => {
		tempSetBpm(newBpm)
		onUpdate({ bpm: newBpm })
	}

	const [rhythmStrategy, tempSetRhythmStrategy] = useState(prototype.rhythmStrategy)
	const setRhythmStrategy = (newRhythmStrategy: ChordPrototypeIR["rhythmStrategy"]) => {
		tempSetRhythmStrategy(newRhythmStrategy)
		onUpdate({ rhythmStrategy: newRhythmStrategy })
	}

	const [melodyLengthStrategy, tempSetMelodyLengthStrategy] = useState(prototype.melodyLengthStrategy)
	const setMelodyLengthStrategy = (newMelodyLengthStrategy: ChordPrototypeIR["melodyLengthStrategy"]) => {
		tempSetMelodyLengthStrategy(newMelodyLengthStrategy)
		onUpdate({ melodyLengthStrategy: newMelodyLengthStrategy })
	}

	const [tempMelodyLength, tempSetMelodyLength] = useState(prototype.melodyLength)
	const melodyLength = melodyLengthStrategy === "Inherit" ? useAppContext().melodyLength : tempMelodyLength
	const setMelodyLength = (newMelodyLength: number) => {
		tempSetMelodyLength(newMelodyLength)
		onUpdate({ melodyLength: newMelodyLength })
	}

	const [minNumNotes, tempSetMinNumNotes] = useState(prototype.rhythmPatternOptions.minimumNumberOfNotes)
	const setMinNumNotes = (newMinNumNotes: number) => {
		tempSetMinNumNotes(newMinNumNotes)
		updateRhythmPatternOptions({ minimumNumberOfNotes: newMinNumNotes })
	}
	const [startOnNote, tempSetStartOnNote] = useState(prototype.rhythmPatternOptions.onlyStartOnNote)
	const setStartOnNote = (newStartOnNote: boolean) => {
		tempSetStartOnNote(newStartOnNote)
		updateRhythmPatternOptions({ onlyStartOnNote: newStartOnNote })
	}
	const [maxRestLength, tempSetMaxRestLength] = useState(prototype.rhythmPatternOptions.maximumRestLength)
	const setMaxRestLength = (newMaxRestLength: number) => {
		tempSetMaxRestLength(newMaxRestLength)
		updateRhythmPatternOptions({ maximumRestLength: newMaxRestLength })
	}

	const [noteConstraintSet, tempSetNoteConstraintSet] = useState(prototype.noteCanvasProps.constraints)
	const setNoteConstraintSet = (newNoteConstraintSet: NoteConstraintIR[]) => {
		tempSetNoteConstraintSet(newNoteConstraintSet)
		updateNoteCanvasProps({ constraints: newNoteConstraintSet })
	}

	const addNoteConstraint = (constraint: NoteConstraintIR) => {
		setNoteConstraintSet([...noteConstraintSet, constraint])
	}

	const removeNoteConstraint = (index: number) => {
		const newConstraintSet = [...noteConstraintSet]
		newConstraintSet.splice(index, 1)
		setNoteConstraintSet(newConstraintSet)
	}

	const handleNoteConstraintChange = (index: number, constraint: NoteConstraintIR) => {
		const newConstraintSet = [...noteConstraintSet]
		newConstraintSet[index] = constraint
		setNoteConstraintSet(newConstraintSet)
	}

	const [differentMelodyKey, tempSetDifferentMelodyKey] = useState(prototype.useDifferentMelodyKey)
	const setDifferentMelodyKey = (newDifferentMelodyKey: boolean) => {
		tempSetDifferentMelodyKey(newDifferentMelodyKey)
		onUpdate({ useDifferentMelodyKey: newDifferentMelodyKey })
	}

	const [melodyKeyRoot, tempSetMelodyKeyRoot] = useState(prototype.melodyKeyRoot)
	const setMelodyKeyRoot = (newMelodyKeyRoot: Note) => {
		tempSetMelodyKeyRoot(newMelodyKeyRoot)
		onUpdate({ melodyKeyRoot: newMelodyKeyRoot })
	}

	const [melodyKeyType, tempSetMelodyKeyType] = useState(melodyKeyTypeToOption(prototype.melodyKeyType))
	const setMelodyKeyType = (newMelodyKeyType: SelectKeyTypeOption) => {
		if (newMelodyKeyType === null) return
		tempSetMelodyKeyType(newMelodyKeyType)
		onUpdate({ melodyKeyType: newMelodyKeyType.value })
	}

	const env = {
		noteOptionsPerCell,
		handleNoteOptionsPerCellChange,
		melodyLength,
		setMelodyLength,
		noteConstraintSet,
		addNoteConstraint,
		removeNoteConstraint,
		handleNoteConstraintChange,
		minNumNotes,
		setMinNumNotes,
		startOnNote,
		setStartOnNote,
		maxRestLength,
		setMaxRestLength,

		differentMelodyKey,
		setDifferentMelodyKey,
		melodyKeyRoot,
		setMelodyKeyRoot,
		melodyKeyType,
		setMelodyKeyType,

		bpmStrategy,
		setBpmStrategy,
		bpm,
		setBpm,
	}

	return <ChordPrototypeProvider env={env}>
		<div style={{ display: "flex", borderBottom: "1px solid grey", paddingBottom: "1em", flexDirection: "row", gap: "2em", alignItems: "end" }}>
			<div style={{ width: "15vw", display: "flex", flexDirection: "column", justifyContent: "left" }}>
				Name:
				<input type="text" value={prototype.name} placeholder={`ChordPrototype${prototype.id}`} onChange={(e) => {
					onUpdate({ name: e.target.value })
				}} />
			</div>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
				Value:
				<ChordSelector value={chordValue} setValue={(c) => {
					setChordValue(c)
					onUpdate({ chord: c })
				}} />
			</div>
			<div
				style={{
					...buttonStyles,
					color: "red",
					borderColor: "red",
					cursor: "pointer",
					marginLeft: "auto",
				}}
				onClick={removePrototype}>
				Delete prototype
			</div>
		</div>
		<div style={{ display: "flex", gap: "1em" }}>
			<div style={{ flex: 1 }}>
				<InheritedBpmSelector strategy={bpmStrategy} setStrategy={setBpmStrategy} value={bpm} setValue={setBpm} />
				<MelodyKeySelector />
				
				<InheritedLengthSelector  strategy={melodyLengthStrategy} setStrategy={setMelodyLengthStrategy} name="melody length" value={melodyLength} setValue={setMelodyLength}/>
				<NoteTiles />
				<InheritedRhythmSettings strategy={rhythmStrategy} setStrategy={setRhythmStrategy} />
			</div>
			<NoteConstraints />
			<div style={{ flex: 1 }}>
				<NeighborRulesChordPrototype
					inputLabel="Allowed preceding chords"
					checkboxLabel="Restrict preceding chords"
					restrict={prototype.restrictPrecedingChords}
					setRestrict={(b) => onUpdate({ restrictPrecedingChords: b })}
					allowedSet={prototype.allowedPrecedingChords}
					setAllowedSet={(c) => onUpdate({ allowedPrecedingChords: c })}
				/>
				<NeighborRulesChordPrototype
					inputLabel="Allowed following chords"
					checkboxLabel="Restrict following chords"
					restrict={prototype.restrictFollowingChords}
					setRestrict={(b) => onUpdate({ restrictFollowingChords: b })}
					allowedSet={prototype.allowedFollowingChords}
					setAllowedSet={(c) => onUpdate({ allowedFollowingChords: c })}
				/>
			</div>
		</div>
	</ChordPrototypeProvider>

}

const chordQualityOptions: [ChordQuality, { label: string, value: string }][] = [
	["major", { label: "Major", value: "major" }],
	["minor", { label: "Minor", value: "minor" }],
	["diminished", { label: "Diminished", value: "diminished" }],
	["augmented", { label: "Augmented", value: "augmented" }],
]
const chordQualityToOptionMap = new Map(chordQualityOptions)
const chordQualityToOption = (quality: ChordQuality) => chordQualityToOptionMap.get(quality)!

interface ChordSelectorProps {
	value: ChordIR,
	setValue: (c: ChordIR) => void
}

function ChordSelector({ value, setValue }: ChordSelectorProps) {
	const [root, tempSetRoot] = useState(value.root)
	const [quality, tempSetQuality] = useState(chordQualityToOption(value.quality))
	const setRoot = (newRoot: Note) => {
		tempSetRoot(newRoot)
		setValue({ ...value, root: newRoot })
	}
	const setQuality = (newQuality: SelectOption) => {
		tempSetQuality(newQuality!)
		setValue({ ...value, quality: newQuality!.value as ChordQuality })
	}

	return <>
		<div style={{ display: "flex", width: "20vw" }}>
			<ConstantNoteSelector placeholder={"Select a root"} value={root} setValue={setRoot} style={{ flex: 1 }} />
			<Select options={chordQualityOptions.map(t => t[1])} placeholder={"Select a key type"} styles={selectStyles} value={quality} onChange={(option: SelectOption) => { setQuality(option!) }} />
		</div>
	</>
}

