import { HigherValues } from "../HigherValues"

export const RootOfChordGrabber = (higherValues: HigherValues) =>
	higherValues.chord!.getRoot()

export const ThirdOfChordGrabber = (higherValues: HigherValues) =>
	higherValues.chord!.getThird()

export const FifthOfChordGrabber = (higherValues: HigherValues) =>
	higherValues.chord!.getFifth()
