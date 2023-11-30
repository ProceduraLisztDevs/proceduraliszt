import { HigherValues } from "../HigherValues"
import { Tile } from "../Tile"
import { Chordesque, ChordPrototype } from "../hierarchy/Chordesque"
import { Grabber } from "../Grabber"
import { HardConstraint } from "./concepts/Constraint"

export class ChordPrototypeOnlyFollowedByConstraint
	implements HardConstraint<Chordesque>
{
	name = "Chord Prototype Only Followed By"

	constructor(
		private chordPrototypeName: string,
		private grabber: Grabber<string[]>,
	) {}

	check(tile: Tile<Chordesque>, higherValues: HigherValues): boolean {
		const chordesque = tile.getValue()
		const prev = tile.getPrev()
		const next = tile.getNext()

		let out = true
		if (prev.isCollapsed()){
			out &&= this.checkPair(prev.getValue(), chordesque, higherValues)
		}
		if (next.isCollapsed()){
			out &&= this.checkPair(chordesque, next.getValue(), higherValues)
		}
		return out
	}

	private checkPair(
		first: Chordesque,
		second: Chordesque,
		higherValues: HigherValues,
	): boolean {
		if (!(first instanceof ChordPrototype)) return true
		if (first.getName() !== this.chordPrototypeName) return true
		const chordSet = this.grabber(higherValues)
		return chordSet.some((chordString) => chordString === second.getName())
	}
}
