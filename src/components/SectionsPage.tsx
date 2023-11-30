import { useState } from "react"
import { useAppContext } from "../AppState"
import { buttonStyles } from "../styles"
import { SectionIR , SectionInit, nameOfSectionIR} from "../wfc/hierarchy/Section"
import { SectionConfig } from "./SectionConfig"

export function SectionsPage() {
	const [chosenSectionIndex, setChosenSectionIndex] = useState<number | undefined>(undefined)
	const { sections, addSection, removeSection, handleSectionChange, getNextSectionID } = useAppContext()

	const updateSection = (index: number, changes: Partial<SectionIR>) => {
		const updatedPrototype = { ...sections[index], ...changes }
		handleSectionChange(index, updatedPrototype)
	}

	return <div style={{ display: "flex", gap: "1em", paddingTop: "1em" }}>
		<div style={{
			width: "10vw",
			borderRight: "1px solid grey",
			paddingRight: "1em",
			height: "70vh",
		}}>
			{sections.map((section, index) => {
				const effectiveName = nameOfSectionIR(section)
				const chosen = chosenSectionIndex === index
				const multipleWithSameName = sections.filter((proto2) => nameOfSectionIR(proto2) === effectiveName).length > 1
				return <div key={index}
					style={{
						...buttonStyles,
						borderColor: chosen ? "white" : "grey",
						color: multipleWithSameName ? "red" : chosen ? "white" : "grey",
						cursor: chosen ? "default" : "pointer",

					}}
					onClick={() => {
						if (!chosen) {
							setChosenSectionIndex(index)
						}
					}
					}>{effectiveName}</div>
			})}
			<button style={{ width: "inherit" }} onClick={() => {
				addSection(SectionInit(getNextSectionID()))
				setChosenSectionIndex(sections.length)
			}}>+</button>
		</div>
		<div style={{ flex: 1 }}>
			{
				chosenSectionIndex === undefined ? <h2>Select a section to edit on the left!</h2> :
					<SectionConfig
						key={chosenSectionIndex}
						section={sections[chosenSectionIndex]}
						onUpdate={(changes) => {
							updateSection(chosenSectionIndex, changes)
						}}
						removeSection={() => {
							setChosenSectionIndex(undefined)
							removeSection(chosenSectionIndex)
						}}
					/>
			}
		</div>
	</div>
}