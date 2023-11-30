import { ChordQuality, Chord } from "../../../music_theory/Chord"
import { MusicalKey } from "../../../music_theory/MusicalKey"
import { relativeNote } from "../../../music_theory/Note"
import { Grabber } from "../../Grabber"
import { HigherValues } from "../../HigherValues"
import { Tile } from "../../Tile"
import { Chordesque } from "../../hierarchy/Chordesque"
import { SoftConstraint } from "../concepts/Constraint"

export abstract class GenericCadenceSoftConstraint extends SoftConstraint<Chordesque> {
	protected firstOffsetGrabber: Grabber<number>
	protected secondOffsetGrabber: Grabber<number>
	protected firstChordGrabber: Grabber<ChordQuality>
	protected secondChordGrabber: Grabber<ChordQuality>
	protected keyGrabber: Grabber<MusicalKey>

	constructor(
		bonus: number,
		firstOffsetGrabber: Grabber<number>,
		secondOffsetGrabber: Grabber<number>,
		firstChordGrabber: Grabber<ChordQuality>,
		secondChordGrabber: Grabber<ChordQuality>,
		keyGrabber: Grabber<MusicalKey>,
	) {
		super(bonus)
		this.firstOffsetGrabber = firstOffsetGrabber
		this.secondOffsetGrabber = secondOffsetGrabber
		this.firstChordGrabber = firstChordGrabber
		this.secondChordGrabber = secondChordGrabber
		this.keyGrabber = keyGrabber
	}

	weight(tile: Tile<Chordesque>, higherValues: HigherValues): number {
		const chord = tile.getValue().getChord()

		const rootOfKey = this.keyGrabber(higherValues).getRoot()

		const firstRoot = relativeNote(
			rootOfKey,
			this.firstOffsetGrabber(higherValues),
		)
		const firstChord = Chord.fromRootAndQuality(
			firstRoot,
			this.firstChordGrabber(higherValues),
		)

		const secondRoot = relativeNote(
			rootOfKey,
			this.secondOffsetGrabber(higherValues),
		)
		const secondChord = Chord.fromRootAndQuality(
			secondRoot,
			this.secondChordGrabber(higherValues),
		)

		if (chord == secondChord) {
			const prev = tile.getPrev()
			if (
				prev.isCollapsed() &&
				prev.getValue().getChord() == firstChord
			) {
				return this.bonus
			}
		} else if (chord == firstChord) {
			const next = tile.getNext()
			if (
				next.isCollapsed() &&
				next.getValue().getChord() == secondChord
			) {
				return this.bonus
			}
		}
		return 0
	}
}
