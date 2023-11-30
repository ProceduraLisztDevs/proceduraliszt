import { OctavedNote } from "../../music_theory/Note"
import { Random } from "../../util/Random"
import { HigherValues } from "../HigherValues"
import { TileCanvas, TileCanvasProps } from "../TileCanvas"

export class NoteLevelNode {
	private canvas: TileCanvas<OctavedNote>

	constructor(
		canvasProps: TileCanvasProps<OctavedNote>,
		higherValues: HigherValues,
		random: Random,
	) {
		this.canvas = new TileCanvas<OctavedNote>(
			higherValues.melodyLength,
			canvasProps,
			higherValues,
			random,
		)
	}

	public generate(): OctavedNote[] {
		return this.canvas.generate()
	}
}
