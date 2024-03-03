import { useState } from "react"
import { useAppContext } from "../AppState"
import Select from "react-select"
import { NoteConstraintIR, NoteConstraintType, initializeNoteConstraint, noteConstraintOptions, noteConstraintTypeToName } from "../wfc/constraints/constraintUtils"
import { selectStyles } from "../styles"
import { NoteSelector } from "./NoteSelector"
import { OctavedNote, OctavedNoteIR } from "../music_theory/Note"
import { ConstantOctavedNoteSelector } from "./ConstantOctavedNoteSelector"
import { MelodyShape, } from "../wfc/constraints/concepts/MelodyShape"
import { MelodyShapeSelector } from "./MelodyShapeSelector"
import { SimpleConstraintConfigDiv } from "./SimpleConstraintConfigDiv"
import { H4tooltip } from "./tooltips"

interface NoteConstraintConfigProps {
	constraintIR: NoteConstraintIR
	onConstraintChange: (updatedConstraint: NoteConstraintIR) => void
	setValid: (valid: boolean) => void
}

function NoteConstraintConfig({ constraintIR, onConstraintChange, setValid }: NoteConstraintConfigProps) {
	switch (constraintIR.type) {
		case "MelodyInKeyHardConstraint": return <></>
		case "AscendingMelodySoftConstraint": return <SimpleConstraintConfigDiv>
			<input
				type="number"
				placeholder="Boost value"
				min={1}
				defaultValue={constraintIR.bonus}
				onChange={(e) => {
					const bonus = parseInt(e.target.value)
					if (bonus > 0) {
						setValid(true)
						onConstraintChange({ ...constraintIR, bonus })
					}
					else setValid(false)
				}}
			/>
		</SimpleConstraintConfigDiv>
		case "DescendingMelodySoftConstraint": return <SimpleConstraintConfigDiv>
			<input
				type="number"
				placeholder="Boost value"
				min={1}
				defaultValue={constraintIR.bonus}
				onChange={(e) => {
					const bonus = parseInt(e.target.value)
					if (bonus > 0) {
						setValid(true)
						onConstraintChange({ ...constraintIR, bonus })
					}
					else setValid(false)
				}}
			/>
		</SimpleConstraintConfigDiv>
		case "MelodyAbsoluteStepSizeHardConstraint":
			setValid(constraintIR.stepSizes.length > 0)
			return <SimpleConstraintConfigDiv>
				<input
					type="text"
					placeholder="Allowed intervals"
					defaultValue={constraintIR.stepSizes.join(" ")}
					onChange={(e) => {
						const stepSizes = e.target.value.split(" ").map(str => parseInt(str)).filter(num => !isNaN(num))
						onConstraintChange({ ...constraintIR, stepSizes })
						setValid(stepSizes.length > 0)
					}}
				/>
			</SimpleConstraintConfigDiv>
		case "MelodyEndsOnNoteHardConstraint": return <SimpleConstraintConfigDiv>
			<NoteSelector
				startValue={constraintIR.noteGrabber}
				setValue={(noteGrabber) => {
					if (noteGrabber === null) {
						return setValid(false)
					} else {
						setValid(true)
						onConstraintChange({ ...constraintIR, noteGrabber })
					}
				}}
			/>
		</SimpleConstraintConfigDiv>
		case "MelodyStartsOnNoteHardConstraint": return <SimpleConstraintConfigDiv>
			<NoteSelector
				startValue={constraintIR.noteGrabber}
				setValue={(result) => {
					if (result === null) {
						return setValid(false)
					} else {
						setValid(true)
						onConstraintChange({ ...constraintIR, noteGrabber: result })
					}
				}}
			/>
		</SimpleConstraintConfigDiv>
		case "MelodyInRangeHardConstraint": {
			const [lowerNoteIR, setLowerNoteIR] = useState(constraintIR.lowerNoteIR)
			const [higherNoteIR, setHigherNoteIR] = useState(constraintIR.higherNoteIR)

			const checkValid = (lowerNoteIR: OctavedNoteIR, higherNoteIR: OctavedNoteIR) => {
				if (lowerNoteIR === null || isNaN(lowerNoteIR.octave) || higherNoteIR === null || isNaN(higherNoteIR.octave)) return setValid(false)
				if (OctavedNote.getStepSize(OctavedNote.fromIR(lowerNoteIR), OctavedNote.fromIR(higherNoteIR)) < 0) return setValid(false)
				setValid(true)
				onConstraintChange({ ...constraintIR, lowerNoteIR, higherNoteIR })
			}
			return <>
				<ConstantOctavedNoteSelector label={"Lower bound:"} defaultValue={lowerNoteIR} setResult={newLowerNote => {
					setLowerNoteIR(newLowerNote)
					checkValid(newLowerNote, higherNoteIR)
				}} />
				<div style={{height: "0.5em"}}/>
				<ConstantOctavedNoteSelector label={"Higher bound:"} defaultValue={higherNoteIR} setResult={newHigherNote => {
					setHigherNoteIR(newHigherNote)
					checkValid(lowerNoteIR, newHigherNote)
				}} />
			</>
		}
		case "MelodyShapeHardConstraint": {
			const { melodyLength } = useAppContext()
			const shapeSize = melodyLength - 1

			const setShape = (shape: MelodyShape) => {
				onConstraintChange({ ...constraintIR, shape })
			}

			return <MelodyShapeSelector size={shapeSize} setResult={setShape} startValue={constraintIR.shape} />
		}
	}
	throw new Error("Invalid constraint type")
}

interface NoteConstraintDivProps {
	constraintIR: NoteConstraintIR
	onConstraintChange: (updatedIR: NoteConstraintIR) => void
	onRemove: () => void
}

function NoteConstraintDiv({ constraintIR, onConstraintChange, onRemove }: NoteConstraintDivProps) {
	const [valid, setValid] = useState(constraintIR.validByDefault)

	const noteConstraintReadable = noteConstraintTypeToName.get(constraintIR.type)!

	return <div className="constraint-div">
		<div style={{ display: "flex", justifyContent: "end", gap: "0.5em", flexDirection: "row", alignItems: "center", fontSize: 8 }}>
			<button style={{ width: "fit-content", height: "fit-content" }} onClick={onRemove}>X</button>
		</div>
		{
			noteConstraintReadable.hint ?
			<H4tooltip title={noteConstraintReadable.name} hint={noteConstraintReadable.hint} style={{ color: valid ? "white" : "red", marginTop: 0 }} /> :
			<h4 style={{ color: valid ? "white" : "red", marginTop: 0 }}>{noteConstraintReadable.name}</h4>
		}
		<NoteConstraintConfig constraintIR={constraintIR} onConstraintChange={onConstraintChange} setValid={setValid} />
	</div>
}

type NoteConstraintTypeOption = { value: NoteConstraintType, label: string }

interface AddNoteConstraintProps {
	onAddConstraint: (constraintIR: NoteConstraintIR) => void
}

function AddNoteConstraint({ onAddConstraint }: AddNoteConstraintProps) {
	const { noteConstraintSet } = useAppContext()
	const [selectedType, setSelectedType] = useState<NoteConstraintTypeOption | null>(null)

	const getNoteConstraintOptions = () => noteConstraintOptions.filter(option => !noteConstraintSet.map(constraint => constraint.type).includes(option.value)).map(option => ({ value: option.value, label: option.label.name }))

	const handleAddButtonClick = () => {
		if (!selectedType) return

		onAddConstraint(initializeNoteConstraint(selectedType.value))
		setSelectedType(null)
	}

	return (
		<div className="add-constraint">
			<Select
				options={getNoteConstraintOptions()}
				value={selectedType}
				placeholder="Note constraints..."
				onChange={(option) => setSelectedType(option || null)}
				styles={selectStyles}
			/>
			<button onClick={() => { handleAddButtonClick(); setSelectedType(null) }}>Add</button>
		</div>
	)
}

export function NoteConstraints() {
	const { noteConstraintSet, addNoteConstraint, removeNoteConstraint, handleNoteConstraintChange } = useAppContext()

	return (
		<div style={{ flex: 1 }}>
			<h3>Melody constraints</h3>
			<AddNoteConstraint onAddConstraint={addNoteConstraint} />
			{noteConstraintSet.map((constraintIR, index) => (
				<NoteConstraintDiv
					key={index}
					constraintIR={constraintIR}
					onConstraintChange={(updatedIR) => handleNoteConstraintChange(index, updatedIR)}
					onRemove={() => removeNoteConstraint(index)}
				/>
			))}
		</div>
	)
}

