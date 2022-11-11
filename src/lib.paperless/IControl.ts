export interface IControlAttributes 
{
	/**
	 * When set to false, the [[Control]] is completely disabled, no action can be made on the [[Drawable]] that is atached to it.
	 * Default value is true.
	 */
	enabled?: boolean,
	/**
	 * When set to false, the [[Control]] can't be moved in the [[Context]]. When moving a Control, the user need to click and
	 * hold the left button of the mouse.
	 */
	movable?: boolean,
	/**
	 * Setting removable to false will deactivate the ability to [[detach]] the [[Control]] from the [[Context]].
	 */
	removable?: boolean,
	/**
	 * Determines if the [[Control]] can be focused. A focused Control takes precedence on every other Control that are focusable.
	 * When the Control is clicked, the [[onLostFocus]] is called first on the Control that was previously focussed and then the [[onFocus]]
	 * is called on the Control that just got it.
	 */
	focusable?: boolean,
	/**
	 * This property determine the movement the [[Control]] can have when dragging it. Value can be **vertical** or **horizontal**.
	 */
	movement?: string,
}
