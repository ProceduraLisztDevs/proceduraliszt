import { useState } from "react"
import { useAppContext } from "../AppState"
import { ChordPrototypeIR, ChordPrototypeInit, nameOfChordPrototypeIR } from "../wfc/hierarchy/Chordesque"
import { ChordPrototypeConfig } from "./ChordPrototypeConfig"
import { buttonStyles } from "../styles"

export function ChordPrototypesPage() {
	const [chosenPrototypeIndex, setChosenPrototypeIndex] = useState<number | undefined>(undefined)
	const { chordPrototypes, addChordPrototype, removeChordPrototype, handleChordPrototypeChange, getNextChordPrototypeID, onlyUseChordPrototypes, setOnlyUseChordPrototypes } = useAppContext()

	const updatePrototype = (index: number, changes: Partial<ChordPrototypeIR>) => {
		const updatedPrototype = { ...chordPrototypes[index], ...changes }
		handleChordPrototypeChange(index, updatedPrototype)
	}

	const listEmpty = chordPrototypes.length === 0

	return <div style={{ display: "flex", gap: "1em", paddingTop: "1em" }}>
		<div style={{
			width: "10vw",
			borderRight: "1px solid grey",
			paddingRight: "1em",
			height: "70vh",
		}}>
			<div style={{ marginBottom: "1em" }}>
				<h3 style={{ color: listEmpty ? "gray" : "white", marginBottom: 0 }}>Only use chord prototypes</h3>
				<input type="checkbox" checked={onlyUseChordPrototypes} disabled={listEmpty} onChange={(e) => {
					setOnlyUseChordPrototypes(e.target.checked)
				}} />
			</div>
			{chordPrototypes.map((prototype, index) => {
				const effectiveName = nameOfChordPrototypeIR(prototype)
				const chosen = chosenPrototypeIndex === index
				const multipleWithSameName = chordPrototypes.filter((proto2) => nameOfChordPrototypeIR(proto2) === effectiveName).length > 1
				return <div key={index}
					style={{
						...buttonStyles,
						borderColor: chosen ? "white" : "grey",
						color: multipleWithSameName ? "red" : chosen ? "white" : "grey",
						cursor: chosen ? "default" : "pointer",

					}}
					onClick={() => {
						if (!chosen) {
							setChosenPrototypeIndex(index)
						}
					}
					}>{effectiveName}</div>
			})}
			<button style={{ width: "inherit" }} onClick={() => {
				addChordPrototype(ChordPrototypeInit(getNextChordPrototypeID()))
				setChosenPrototypeIndex(chordPrototypes.length)
			}}>+</button>
		</div>
		<div style={{ flex: 1 }}>
			{
				chosenPrototypeIndex === undefined ? <h2>Select a prototype to edit on the left!</h2> :
					<ChordPrototypeConfig
						key={chosenPrototypeIndex}
						prototype={chordPrototypes[chosenPrototypeIndex]}
						onUpdate={(changes) => {
							updatePrototype(chosenPrototypeIndex, changes)
						}}
						removePrototype={() => {
							setChosenPrototypeIndex(undefined)
							removeChordPrototype(chosenPrototypeIndex)
						}}
					/>
			}
		</div>
	</div>
}