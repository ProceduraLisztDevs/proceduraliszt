import { useEffect } from "react"
import { useAppContext } from "../AppState"
import { NumberSelector } from "./GlobalSettings"

export function RhythmSettings() {
	const { useRhythm, setUseRhythm } = useAppContext()
	return <>
		<div style={{ display: "flex", justifyContent: "center", gap: "0.5em", marginTop: "1em" }}>
			<h2 style={{ marginBottom: 0, marginTop: 0 }}>Rhythm</h2>
			<input type="checkbox" checked={useRhythm} onChange={(e) => setUseRhythm(e.target.checked)} />
		</div>
		{useRhythm && <RhythmSettingsInner />}
	</>
}

function RhythmSettingsInner() {
	const { minNumNotes, setMinNumNotes, melodyLength, startOnNote, setStartOnNote, maxRestLength, setMaxRestLength } = useAppContext()

	useEffect(() => {
		if (minNumNotes > melodyLength) setMinNumNotes(melodyLength)
	}, [melodyLength])

	return <>
		<NumberSelector value={minNumNotes} setValue={setMinNumNotes} min={1} max={melodyLength} label="Minimum number of notes" />
		<NumberSelector value={maxRestLength} setValue={setMaxRestLength} min={1} max={16} label="Maximum rest length" />
		<div style={{ display: "flex", justifyContent: "center", gap: "0.5em" }}>
			<h3>Start on note</h3>
			<input type="checkbox" checked={startOnNote} onChange={(e) => setStartOnNote(e.target.checked)} />
		</div>
	</>
}

export type RhythmStrategy = "Inherit" | "On" | "Off"
interface InheritedRhythmSettingsProps {
	strategy: RhythmStrategy,
	setStrategy: (s: RhythmStrategy) => void,
}
export function InheritedRhythmSettings({ strategy, setStrategy }: InheritedRhythmSettingsProps) {

	const toggleStrategy = () => {
		if (strategy === "Inherit") setStrategy("On")
		else if (strategy === "On") setStrategy("Off")
		else setStrategy("Inherit")
	}

	return <>
		<div style={{ display: "flex", justifyContent: "center", gap: "0.5em", marginTop: "2em" }}>
			<h2 style={{ marginBottom: 0, marginTop: 0 }}>Rhythm: </h2>
			<button onClick={toggleStrategy}>{strategy}</button>
		</div>
		{strategy === "On" && <RhythmSettingsInner />}
	</>
}