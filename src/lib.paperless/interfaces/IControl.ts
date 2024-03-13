import {Restrict} from "../enums/Restrict";
import {Drawable} from "../Drawable";
import {Context} from "../Context";
import {Control} from "../Control.js";



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
	restrict?: Restrict,

	context?: Context,
	layer?: number,

	drawable?: Drawable,

	onLeftClick?: (self?: Control) => void,
	onRightClick?: (self?: Control) => void,
	onDragBegin?: (self?: Control) => void,
	onDrag?: (self?: Control) => void,
	onDragEnd?: (self?: Control) => void,
	onInside?: (self?: Control) => void,
	onOutside?: (self?: Control) => void,
	onFocus?: (self?: Control) => void,
	onLostFocus?: (self?: Control) => void,
	onAttach?: (self?: Control) => void,
	onDetach?: (self?: Control) => void,
	onDrawable?: (self?: Control) => void,
}

export interface IControlButtonAttributes extends IControlAttributes
{
	callbackLeftClick?: (smuggler: any) => void,
	callbackRightClick?: (smuggler: any) => void, 
	smugglerLeftClick?: any, 
	smugglerRightClick?: any
}
