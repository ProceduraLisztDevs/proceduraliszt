import { HigherValues } from "./HigherValues"

export type Grabber<T> = (higherValues: HigherValues) => T
