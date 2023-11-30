import Select from "react-select"
import { selectStyles } from "../styles"
import { noteOptions } from "./GlobalSettings"
import { Note } from "../music_theory/Note"
import { SelectNoteOption } from "./utils"

interface ConstantNoteSelectorProps {
	placeholder?: string;
	value: Note;
	setValue: (option: Note) => void;
	onChange?: (option: SelectNoteOption) => void;
	style?: React.CSSProperties;
}

export function ConstantNoteSelector({ placeholder, value, setValue, onChange, style }: ConstantNoteSelectorProps) {
	const onChangeUsed = (onChange === undefined ?
		((option: SelectNoteOption) => {
			if (option === null) throw new Error("option should not be null")
			setValue(option.value)
		}) :
		((option: SelectNoteOption) => {
			if (option === null) throw new Error("option should not be null")
			setValue(option.value)
			onChange(option)
		}))

	return <div style={style}>
		<Select
			options={noteOptions}
			placeholder={placeholder}
			styles={selectStyles}
			value={{ value, label: value.toString() }}
			onChange={onChangeUsed}
			isClearable={false}
		/>
	</div>
}
