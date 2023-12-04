import { OctavedNote } from "../../music_theory/Note"
import { constantMelodyShapeGrabber, constantNumberArrayGrabber, constantOctavedNoteGrabber } from "../grabbers/constantGrabbers"
import { Chordesque } from "../hierarchy/Chordesque"
import {
	AscendingMelodySoftConstraint,
	AscendingMelodySoftConstraintIR,
	AscendingMelodySoftConstraintInit,
} from "./AscendingMelodySoftConstraint"
import {
	ChordInKeyHardConstraint,
	ChordInKeyHardConstraintIR,
	ChordInKeyHardConstraintInit,
} from "./ChordInKeyHardConstraint"
import {
	ChordRootAbsoluteStepSizeHardConstraint,
	ChordRootAbsoluteStepSizeHardConstraintIR,
	ChordRootAbsoluteStepSizeHardConstraintInit,
} from "./ChordRootAbsoluteStepSizeHardConstraint"
import {
	DescendingMelodySoftConstraint,
	DescendingMelodySoftConstraintIR,
	DescendingMelodySoftConstraintInit,
} from "./DescendingMelodySoftConstraint"
import {
	MelodyAbsoluteStepSizeHardConstraint,
	MelodyAbsoluteStepSizeHardConstraintIR,
	MelodyAbsoluteStepSizeHardConstraintInit,
} from "./MelodyAbsoluteStepSizeHardConstraint"
import {
	MelodyEndsOnNoteHardConstraint,
	MelodyEndsOnNoteHardConstraintIR,
	MelodyEndsOnNoteHardConstraintInit,
} from "./MelodyEndsOnNoteHardConstraint"
import {
	MelodyInRangeHardConstraint,
	MelodyInRangeHardConstraintIR,
	MelodyInRangeHardConstraintInit,
} from "./MelodyInRangeHardConstraint"
import {
	MelodyShapeHardConstraint,
	MelodyShapeHardConstraintIR,
	MelodyShapeHardConstraintInit,
} from "./MelodyShapeHardConstraint"
import {
	MelodyStartsOnNoteHardConstraint,
	MelodyStartsOnNoteHardConstraintIR,
	MelodyStartsOnNoteHardConstraintInit,
} from "./MelodyStartsOnNoteHardConstraint"
import {
	MelodyInKeyHardConstraint,
	MelodyInKeyHardConstraintIR,
	MelodyInKeyHardConstraintInit,
} from "./MelodyInKeyHardConstraint"
import {
	PerfectCadenceSoftConstraintIR,
	PerfectCadenceSoftConstraintInit,
} from "./cadences/PerfectCadenceSoftConstraint"
import {
	PlagalCadenceSoftConstraint,
	PlagalCadenceSoftConstraintIR,
	PlagalCadenceSoftConstraintInit,
} from "./cadences/PlagalCadenceSoftConstraint"
import { Constraint } from "./concepts/Constraint"
import { HigherValues } from "../HigherValues"
import { noteGrabberIRToGrabber } from "../grabbers/noteGrabbers"

export type ChordConstraintIR =
	| ChordInKeyHardConstraintIR
	| ChordRootAbsoluteStepSizeHardConstraintIR
	| PlagalCadenceSoftConstraintIR
	| PerfectCadenceSoftConstraintIR

export type NoteConstraintIR =
	| AscendingMelodySoftConstraintIR
	| DescendingMelodySoftConstraintIR
	| MelodyAbsoluteStepSizeHardConstraintIR
	| MelodyEndsOnNoteHardConstraintIR
	| MelodyStartsOnNoteHardConstraintIR
	| MelodyInRangeHardConstraintIR
	| MelodyShapeHardConstraintIR
	| MelodyInKeyHardConstraintIR

export type ChordConstraintType = ChordConstraintIR["type"]
export type NoteConstraintType = NoteConstraintIR["type"]

const chordConstraintTypesAndNames = [
	["ChordInKeyHardConstraint", "Chord in Key"],
	[
		"ChordRootAbsoluteStepSizeHardConstraint",
		"Chord root absolute step size",
	],
	["PlagalCadenceSoftConstraint", "Plagal Cadence"],
	["PerfectCadenceSoftConstraint", "Perfect Cadence"],
] as const

type ChordConstraintName = (typeof chordConstraintTypesAndNames)[number][1]

export const chordConstraintTypeToName = new Map<
	ChordConstraintType,
	ChordConstraintName
>(chordConstraintTypesAndNames)

export const chordConstraintOptions = Array.from(
	chordConstraintTypeToName.entries(),
).map(([value, label]) => ({ value, label }))

const noteConstraintTypesAndNames = [
	["MelodyInKeyHardConstraint", "Melody in Key"],
	["MelodyAbsoluteStepSizeHardConstraint", "Melody absolute step size"],
	["AscendingMelodySoftConstraint", "Ascending Melody"],
	["DescendingMelodySoftConstraint", "Descending Melody"],
	["MelodyEndsOnNoteHardConstraint", "Melody ends on note"],
	["MelodyStartsOnNoteHardConstraint", "Melody starts on note"],
	["MelodyInRangeHardConstraint", "Melody in range"],
	["MelodyShapeHardConstraint", "Melody shape"],
] as const

type NoteConstraintName = (typeof noteConstraintTypesAndNames)[number][1]

export const noteConstraintTypeToName = new Map<
	NoteConstraintType,
	NoteConstraintName
>(noteConstraintTypesAndNames)

export const noteConstraintOptions = Array.from(
	noteConstraintTypeToName.entries(),
).map(([value, label]) => ({ value, label }))

export const convertIRToChordConstraint = (
	ir: ChordConstraintIR,
): Constraint<Chordesque> => {
	const keyGrabber = (higherValues: HigherValues) => higherValues.key
	switch (ir.type) {
		case "ChordInKeyHardConstraint":
			return new ChordInKeyHardConstraint(keyGrabber)
		case "ChordRootAbsoluteStepSizeHardConstraint":
			return new ChordRootAbsoluteStepSizeHardConstraint(
				constantNumberArrayGrabber(ir.stepSizes),
			)
		case "PlagalCadenceSoftConstraint":
			return new PlagalCadenceSoftConstraint(ir.bonus, keyGrabber)
		case "PerfectCadenceSoftConstraint":
			return new PlagalCadenceSoftConstraint(ir.bonus, keyGrabber)
	}
}

export const convertIRToNoteConstraint = (
	ir: NoteConstraintIR,
): Constraint<OctavedNote> => {
	switch (ir.type) {
		case "MelodyInKeyHardConstraint":
			return new MelodyInKeyHardConstraint((higherValues: HigherValues) =>
				higherValues.melodyKey,
			)
		case "MelodyAbsoluteStepSizeHardConstraint":
			return new MelodyAbsoluteStepSizeHardConstraint(
				constantNumberArrayGrabber(ir.stepSizes),
			)
		case "AscendingMelodySoftConstraint":
			return new AscendingMelodySoftConstraint(ir.bonus)
		case "DescendingMelodySoftConstraint":
			return new DescendingMelodySoftConstraint(ir.bonus)
		case "MelodyEndsOnNoteHardConstraint":
			return new MelodyEndsOnNoteHardConstraint(noteGrabberIRToGrabber(ir.noteGrabber))
		case "MelodyStartsOnNoteHardConstraint":
			return new MelodyStartsOnNoteHardConstraint(noteGrabberIRToGrabber(ir.noteGrabber))
		case "MelodyInRangeHardConstraint":
			return new MelodyInRangeHardConstraint(
				constantOctavedNoteGrabber(OctavedNote.fromIR(ir.lowerNoteIR)),
				constantOctavedNoteGrabber(OctavedNote.fromIR(ir.higherNoteIR)),
			)
		case "MelodyShapeHardConstraint":
			return new MelodyShapeHardConstraint(constantMelodyShapeGrabber(ir.shape))
	}
}

export const initializeChordConstraint = (
	name: ChordConstraintType,
): ChordConstraintIR => {
	switch (name) {
		case "ChordInKeyHardConstraint":
			return ChordInKeyHardConstraintInit
		case "ChordRootAbsoluteStepSizeHardConstraint":
			return ChordRootAbsoluteStepSizeHardConstraintInit
		case "PlagalCadenceSoftConstraint":
			return PlagalCadenceSoftConstraintInit
		case "PerfectCadenceSoftConstraint":
			return PerfectCadenceSoftConstraintInit
	}
}

export const initializeNoteConstraint = (
	name: NoteConstraintType,
): NoteConstraintIR => {
	switch (name) {
		case "MelodyInKeyHardConstraint":
			return MelodyInKeyHardConstraintInit
		case "MelodyAbsoluteStepSizeHardConstraint":
			return MelodyAbsoluteStepSizeHardConstraintInit
		case "AscendingMelodySoftConstraint":
			return AscendingMelodySoftConstraintInit
		case "DescendingMelodySoftConstraint":
			return DescendingMelodySoftConstraintInit
		case "MelodyEndsOnNoteHardConstraint":
			return MelodyEndsOnNoteHardConstraintInit
		case "MelodyStartsOnNoteHardConstraint":
			return MelodyStartsOnNoteHardConstraintInit
		case "MelodyInRangeHardConstraint":
			return MelodyInRangeHardConstraintInit
		case "MelodyShapeHardConstraint":
			return MelodyShapeHardConstraintInit
	}
}