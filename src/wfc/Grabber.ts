import { ConcreteChordQuality } from "../music_theory/Chord"
import { Note } from "../music_theory/Note"
import { HigherValues } from "./HigherValues"
export type Grabber<T> = (higherValues: HigherValues) => T

export type OctavedNoteGrabberIR = {
    type: "octavedNote",
    value: string
}

export type NumberGrabberIR = {
    type: "number",
    value: number
}

export type NumberArrayGrabberIR = {
    type: "numberArray",
    value: number[]
}

export type MelodyShapeGrabberIR = {
    type: "melodyShape",
    value: string
}

export type ConcreteChordQualityGrabberIR = {
    type: "concreteChordQuality",
    value: ConcreteChordQuality
}

export type NoteGrabberIR = {
    type: "note",
    value: Note
} | "RootOfChordGrabber" | "ThirdOfChordGrabber" | "FifthOfChordGrabber"

export type StringArrayGrabberIR = {
    type: "stringArray",
    value: string[]
}

export type GrabberIR = 
    OctavedNoteGrabberIR |
    NumberGrabberIR |
    NumberArrayGrabberIR |
    MelodyShapeGrabberIR |
    ConcreteChordQualityGrabberIR |
    NoteGrabberIR |
    StringArrayGrabberIR