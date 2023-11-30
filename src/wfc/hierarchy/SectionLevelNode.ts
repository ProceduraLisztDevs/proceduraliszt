import { NoteOutput } from "../../components/MidiPlayer"
import { OctavedNote } from "../../music_theory/Note"
import { Random } from "../../util/Random"
import { HigherValues } from "../HigherValues"
import { TileCanvasProps, TileCanvas, unionOfTileCanvasProps } from "../TileCanvas"
import { ChordLevelNode } from "./ChordLevelNode"
import { Chordesque } from "./Chordesque"
import { Section } from "./Section"

interface SectionLevelNodeProps {
	higherValues: HigherValues
	noteCanvasProps: TileCanvasProps<OctavedNote>
	chordesqueCanvasProps: TileCanvasProps<Chordesque>
	sectionCanvasProps: TileCanvasProps<Section>
	random: Random
}

export class SectionLevelNode {
	private higherValues: HigherValues
	private noteCanvasProps: TileCanvasProps<OctavedNote>
	private chordesqueCanvasProps: TileCanvasProps<Chordesque>
	private sectionCanvas: TileCanvas<Section>
	private random: Random

	constructor(props: SectionLevelNodeProps) {
		this.higherValues = props.higherValues
		this.noteCanvasProps = props.noteCanvasProps
		this.chordesqueCanvasProps = props.chordesqueCanvasProps
		this.sectionCanvas = new TileCanvas(
			this.higherValues.numSections,
			props.sectionCanvasProps,
			this.higherValues,
			props.random,
		)
		this.random = props.random
	}

	private createChordLevelNode(section: Section) {
		return new ChordLevelNode({
			higherValues: {
				...this.higherValues, 
				section, 
				bpm: section.bpmStrategy === "Custom" ? section.bpm : this.higherValues.bpm,
				numChords: section.numChordsStrategy === "Custom" ? section.numChords : this.higherValues.numChords,
				useRhythm: section.rhythmStrategy === "On" || (section.rhythmStrategy === "Inherit" && this.higherValues.useRhythm),
				rhythmPatternOptions: section.rhythmStrategy === "On" ? section.rhythmPatternOptions : this.higherValues.rhythmPatternOptions,
				melodyLength: section.melodyLengthStrategy === "Custom" ? section.melodyLength : this.higherValues.melodyLength,
			},
			noteCanvasProps: unionOfTileCanvasProps( 
				this.noteCanvasProps, 
				section.noteCanvasProps
			),
			chordesqueCanvasProps: unionOfTileCanvasProps(
				this.chordesqueCanvasProps,
				section.chordesqueCanvasProps
			),
			random: this.random,
		})
	}

	public generate(): [NoteOutput[], number] {
		const sections = this.sectionCanvas.generate()
		const noteOutputs: NoteOutput[] = []
		let totalDuration = 0
		for (const section of sections) {
			const chordLevelNode = this.createChordLevelNode(section)
			const [sectionNoteOutputs, sectionDuration] = chordLevelNode.generate()

			noteOutputs.push(...(sectionNoteOutputs.map((noteOutput) => {
				noteOutput.startTime += totalDuration
				return noteOutput
			})))

			totalDuration += sectionDuration
		}
		return [noteOutputs, totalDuration]
	}
}
