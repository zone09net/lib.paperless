export interface ISize
{
	/**
	 * This sets the blocked status of the width and/or height of [[Size]]. When blocked, the modification on the width and/or height
	 * will be ignored. Default value is false.
	 */
	blocked?: { width: boolean, height: boolean }
}
