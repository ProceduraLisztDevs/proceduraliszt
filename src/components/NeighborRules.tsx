import { useEffect, useState } from "react"
import { useAppContext } from "../AppState"
import { ChordIR, chordIRToString, stringToChordIR } from "../music_theory/Chord"
import { nameOfSectionIR } from "../wfc/hierarchy/Section"
import { nameOfChordPrototypeIR } from "../wfc/hierarchy/Chordesque"

interface NeighborRulesProps {
	inputLabel: string
	checkboxLabel: string
	restrict: boolean
	setRestrict: (b: boolean) => void
	allowedSet: string[]
	setAllowedSet: (c: string[]) => void
}
export function NeighborRulesChordPrototype({ inputLabel, checkboxLabel, restrict, setRestrict, allowedSet, setAllowedSet }: NeighborRulesProps) {
	const { chordPrototypes } = useAppContext()

	const createString = (chord: ChordIR | string) => {
		if (typeof chord === "string") return chord
		else return chordIRToString(chord)
	}

	const isValid = (allowedSet: (string)[]) => {
		if (restrict && allowedSet.length === 0) return false
		let out = true
		allowedSet.forEach(s => {
			if (chordPrototypes.some(p => nameOfChordPrototypeIR(p) === s)) return
			const chordIR = stringToChordIR(s)
			if (chordIR) return
			out = false
		})
		return out
	}
	const [valid, setValid] = useState(isValid(allowedSet))

	useEffect(() => {
		setValid(isValid(allowedSet))
	}, [restrict, allowedSet])

	return <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
		<div style={{ display: "flex", justifyContent: "center", gap: "0.5em", marginTop: "2em" }}>
			<h3 style={{ marginBottom: 0, marginTop: 0, color: valid ? "white" : "red" }}>{checkboxLabel}</h3>
			<input type="checkbox" checked={restrict} onChange={(e) => setRestrict(e.target.checked)} />
		</div>
		{restrict && <>
			<input type="text" value={allowedSet.map(createString).join(" ")}
				placeholder={inputLabel} onChange={(e) => {
					setAllowedSet(e.target.value === "" ? [] : e.target.value.split(" "))
				}} />
		</>}
	</div>
}

export function NeighborRulesSection({ inputLabel, checkboxLabel, restrict, setRestrict, allowedSet, setAllowedSet }: NeighborRulesProps) {
	const { sections } = useAppContext()

	const isValid = (allowedSet: (string)[]) => {
		if (restrict && allowedSet.length === 0) return false
		let out = true
		allowedSet.forEach(s => {
			if (sections.some(p => nameOfSectionIR(p) === s)) return
			const chordIR = stringToChordIR(s)
			if (chordIR) return
			out = false
		})
		return out
	}
	const [valid, setValid] = useState(isValid(allowedSet))

	useEffect(() => {
		setValid(isValid(allowedSet))
	}, [restrict, allowedSet])

	return <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
		<div style={{ display: "flex", justifyContent: "center", gap: "0.5em", marginTop: "2em" }}>
			<h3 style={{ marginBottom: 0, marginTop: 0, color: valid ? "white" : "red" }}>{checkboxLabel}</h3>
			<input type="checkbox" checked={restrict} onChange={(e) => setRestrict(e.target.checked)} />
		</div>
		{restrict && <>
			<input type="text" value={allowedSet.join(" ")}
				placeholder={inputLabel} onChange={(e) => {
					setAllowedSet(e.target.value === "" ? [] : e.target.value.split(" "))
				}} />
		</>}
	</div>
}