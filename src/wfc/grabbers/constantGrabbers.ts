import { Grabber } from "../Grabber"

export function constantGrabber<T>(result: T): Grabber<T> {
	return () => result
}
