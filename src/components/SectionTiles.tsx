import { useState } from "react"
import { useAppContext } from "../AppState"
import Popup from "reactjs-popup"
import { SectionIR, nameOfSectionIR } from "../wfc/hierarchy/Section"
import { H2tooltip } from "./tooltips"

interface SectionTileProps {
	index: number;
	initialOptions?: string[];
}

function SectionTile({ index, initialOptions }: SectionTileProps) {
	const [popupOpen, setPopupOpen] = useState(false)
	const optionsString = (!initialOptions || initialOptions.length === 0) ? "*" : initialOptions.join(" | ")

	return (
		<div key={index} className='tile'>
			<button onClick={() => setPopupOpen(true)}>{optionsString}</button>
			<SectionValuesPopup popupOpen={popupOpen} index={index} setPopupOpen={setPopupOpen} initialOptions={initialOptions} />
		</div>
	)
}

interface SectionValuesInputProps {
	value: string
	setValue: (s: string) => void
}

export function SectionValuesInput({ value, setValue }: SectionValuesInputProps) {
	return <div style={{ display: "flex", gap: "0.5em" }}>
		<input type="text" onChange={e => setValue(e.target.value)} value={value} style={{ flex: 1 }} />
	</div>
}

const parseSections = (input: string, sections: SectionIR[]): SectionIR[] | undefined => {
	const items = input.split(" ").filter(item => item !== "")
	const out = [] as SectionIR[]
	for (const item of items) {
		const section = sections.find(section => nameOfSectionIR(section) === item)
		if (section) {
			out.push(section)
		} else {
			return undefined
		}
	}
	return out
}

interface SectionValuesPopupProps {
	popupOpen: boolean
	index: number
	setPopupOpen: (b: boolean) => void
	initialOptions: string[] | undefined
}
function SectionValuesPopup({ popupOpen, index, setPopupOpen, initialOptions }: SectionValuesPopupProps) {
	const [input, setInput] = useState(initialOptions?.join(" ") || "")
	const { handleSectionOptionsPerCellChange, sections } = useAppContext()

	const parsedSections = parseSections(input, sections)

	return <Popup open={popupOpen} closeOnDocumentClick={false}>
		<div className='modal'>
			<h3>Set options for section at position {index}</h3>
			<SectionValuesInput value={input} setValue={setInput} />
			<br />
			<p>Leaving this empty means allowing all sections</p>
			<button disabled={parsedSections === undefined}
				onClick={() => {
					handleSectionOptionsPerCellChange(index, parsedSections as SectionIR[])
					setPopupOpen(false)
				}}>Save</button>
			<button onClick={() => {
				setInput(initialOptions?.join(" ") || "")
				setPopupOpen(false)
			}}>Cancel</button>
		</div>
	</Popup>
}

export function SectionTiles() {
	const { numSections, sectionOptionsPerCell } = useAppContext()
	const arr = Array(numSections).fill(0)

	return (
		<>
			<H2tooltip title="Sections" hint="Set the options for each of the sections. Multiple options can be given per index. If left empty for a given index, all sections have a chance to be chosen."/>
			{arr.map((_, i) => (
				<SectionTile key={i} index={i} initialOptions={sectionOptionsPerCell.get(i)?.map(nameOfSectionIR)} />
			))}
		</>
	)
}
