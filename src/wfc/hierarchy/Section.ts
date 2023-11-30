import { InfiniteArray } from "../InfiniteArray"
import { LengthStrategy, MusicalKeyType } from "../../components/GlobalSettings"
import { RhythmStrategy } from "../../components/RhythmSettings"
import { Chord } from "../../music_theory/Chord"
import { MusicalKey } from "../../music_theory/MusicalKey"
import { Note, OctavedNote, OctavedNoteIR } from "../../music_theory/Note"
import { RhythmPatternOptions } from "../../music_theory/Rhythm"
import { ConstraintSet } from "../ConstraintSet"
import { OptionsPerCell } from "../OptionsPerCell"
import { TileCanvasProps } from "../TileCanvas"
import { ChordConstraintIR, NoteConstraintIR, convertIRToChordConstraint, convertIRToNoteConstraint } from "../constraints/constraintUtils"
import { ChordPrototypeIR, Chordesque, ChordesqueIR, chordesqueIRMapToChordesqueMap } from "./Chordesque"
import { parseChordPrototypes } from "../../components/Output"

export interface Section {
    name: string
    noteCanvasProps: TileCanvasProps<OctavedNote>
    chordesqueCanvasProps: TileCanvasProps<Chordesque>
    rhythmPatternOptions: RhythmPatternOptions
    melodyLength: number
    melodyLengthStrategy: LengthStrategy
    rhythmStrategy: RhythmStrategy
    useDifferentMelodyKey: boolean
    melodyKey: MusicalKey
    numChordsStrategy: LengthStrategy
    numChords: number
    bpmStrategy: LengthStrategy
    bpm: number
}

export const SectionInit = (id: number) => {
    return {
		name: "",
		id: id,
		noteCanvasProps: {
			size: 4,
			optionsPerCell: new InfiniteArray<OctavedNoteIR[]>(),
			constraints: [] as NoteConstraintIR[],
		},
		chordesqueCanvasProps: {
			size: 4,
			optionsPerCell: new InfiniteArray<ChordesqueIR[]>(),
			constraints: [] as ChordConstraintIR[],
		},
		allowedPrecedingSections: [] as string[],
		allowedFollowingSections: [] as string[],
		restrictPrecedingSections: false,
		restrictFollowingSections: false,
		rhythmStrategy: "Inherit" as RhythmStrategy,
		melodyLengthStrategy: "Inherit" as LengthStrategy,
		melodyLength: 4,
        numChordsStrategy: "Inherit" as LengthStrategy,
        numChords: 4,
        bpmStrategy: "Inherit" as LengthStrategy,
        bpm: 120,
		rhythmPatternOptions: {
			onlyStartOnNote: true,
			minimumNumberOfNotes: 3,
			maximumRestLength: 1,
		} as RhythmPatternOptions,
        useDifferentKey: false,
        keyRoot: Note.C,
        keyType: "major" as MusicalKeyType,
		useDifferentMelodyKey: false,
		melodyKeyRoot: Note.C,
		melodyKeyType: "major" as MusicalKeyType,
	}
}

export type SectionIR = ReturnType<typeof SectionInit>

export function nameOfSectionIR(sectionIR: SectionIR) {
    return sectionIR.name === "" ? `Section${sectionIR.id}` : sectionIR.name
}

export function sectionIRToSection(
    sectionIR: SectionIR,
    chordPrototypes: ChordPrototypeIR[],
    onlyUseChordPrototypes: boolean,
): Section {
    const noteCanvasProps: TileCanvasProps<OctavedNote> = {
        optionsPerCell: new OptionsPerCell(
            OctavedNote.all(),
            sectionIR.noteCanvasProps.optionsPerCell.transform(OctavedNote.multipleFromIRs),
        ),
        constraints: new ConstraintSet(
            sectionIR.noteCanvasProps.constraints.map((noteConstraint) =>
                convertIRToNoteConstraint(noteConstraint)
            )
        )
        }
    const {parsedChordPrototypes} = parseChordPrototypes(chordPrototypes)
    const chordesqueCanvasProps : TileCanvasProps<Chordesque> = {
        optionsPerCell: new OptionsPerCell([
            ...parsedChordPrototypes,
            ...(onlyUseChordPrototypes ? [] : Chord.allBasicChords()),
        ],
            chordesqueIRMapToChordesqueMap(sectionIR.chordesqueCanvasProps.optionsPerCell, chordPrototypes)
        ),
        constraints: new ConstraintSet(
            sectionIR.chordesqueCanvasProps.constraints.map((chordConstraint) =>
                convertIRToChordConstraint(chordConstraint)
            )
        )
        }

    return {
        ...sectionIR,
        noteCanvasProps,
        chordesqueCanvasProps,
        melodyKey: MusicalKey.fromRootAndType(
            sectionIR.melodyKeyRoot,
            sectionIR.melodyKeyType,
        ),
    }
}

export function sectionIRMapToSectionMap(
	sectionIRMap: InfiniteArray<SectionIR[]>,
    sections: SectionIR[],
	chordPrototypes: ChordPrototypeIR[],
    onlyUseChordPrototypes: boolean,
): InfiniteArray<Section[]> {
	const sectionMap = new InfiniteArray<Section[]>()

	for (const [position, sectionIRs] of sectionIRMap.entries()) {
		const sectionList: Section[] = sectionIRs.map(
			(sectionIR) => {
                const section = sections.find(
                    (section) => section.name === sectionIR.name,
                )
                if (section === undefined)
                    throw new Error(
                        `Section ${sectionIR.name} not found`,
                    )
                return sectionIRToSection(section, chordPrototypes, onlyUseChordPrototypes)
            }
		)
		sectionMap.set(position, sectionList)
	}
	return sectionMap
}
