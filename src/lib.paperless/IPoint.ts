export interface IPoint
{
	/**
	 * This sets the blocked status of x and/or y of [[Point]]. When blocked, the modification on x and/or y
	 * will be ignored. Default value is false.
	 */
	blocked?: { x: boolean, y: boolean },
	/**
	 * Determines the scale value of a [[Point]]. Value can be from 0 to 1, default is 1.
	 */
	scale?: number,
}
