import {Restrict} from "../enums/Restrict";
import {Drawable} from "../Drawable";
import {Context} from "../Context";
import {Control} from "../Control.js";



export interface IControlAttributes 
{
	/**
	 * The Context can be set directly in the attributes, acting the same way as calling the [[Context.attach]] method.
	 */
	context?: Context,

	/**
	 * A [[Drawable]] can be attached directly in the attributes, it is the same as using the [[Control.attach]] method.
	 */
	drawable?: Drawable,

	/**
	 * Setting the layer in the attributes will override the layer that the Component would have been set by the [[Context]]. 
	 * Need to have the context set in the attributes for this to work.
	 */
	layer?: number,

	/**
	 * Sets the enabled status of the Control. When set to false, the Control cannot be clicked or moved with the mouse events.
	 *
	 * @defaultvalue true
	 */
	enabled?: boolean,

	/**
	 * Sets the movable status of the Control. When set to false, the Control cannot be moved with the mouse events.
	 *
	 * @defaultvalue true
	 */
	movable?: boolean,
	
	/**
	 * Sets the removable status of the Control. When set to false, the Control cannot be removed with the [[Context.detach]] method.
	 *
	 * @defaultvalue true
	 */
	removable?: boolean,
	
	/**
	 * Sets the focusable status of the Control. When set to false, the Control cannot be focussed with the [[Context.setFocus]] method.
	 *
	 * @defaultvalue true
	 */
	focusable?: boolean,
	/**
	 * This property determine the movement the [[Control]] can have when dragging it. Value can be **vertical** or **horizontal**.
	 */
	
	/**
	 * Sets the restrict status of the Control, meaning the movement restriction on this one.
	 * 
	 * @defaultvalue [[Restrict.none]]
	 */
	restrict?: Restrict.none | Restrict.horizontal | Restrict.vertical,

	/**
	 * Callback method when the Control is clicked with the left mouse event.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	onLeftClick?: (self?: Control) => void,

	/**
	 * Callback method when the Control is clicked with the right mouse event.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	onRightClick?: (self?: Control) => void,

	/**
	 * Callback method when the Control is clicked and beeing dragged. Will be called just before moving the attached [[Drawable]].
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */	
	onDragBegin?: (self?: Control) => void,

	/**
	 * Callback method when the Control is beeing dragged. Will be called at every redraw phase.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	onDrag?: (self?: Control) => void,

	/**
	 * Callback method when the dragging of the Control is stopped. Will be called just after moving the attached [[Drawable]].
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	onDragEnd?: (self?: Control) => void,

	/**
	 * Callback method when the mouse cursor is touching the attached [[Drawable]] of the Control.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */	
	onInside?: (self?: Control) => void,

	/**
	 * Callback method when the mouse cursor is exiting the attached [[Drawable]] of the Control.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	onOutside?: (self?: Control) => void,

	/**
	 * Callback method when the Control gain focus with the [[Context.setFocus]] method.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	onFocus?: (self?: Control) => void,

	/**
	 * Callback method when the Control lose focus either with the [[Context.removeFocus]] method or when another
	 * Control is beeing focussed.
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	onLostFocus?: (self?: Control) => void,

	/**
	 * Callback method when the Control is attached to a [[Context]].
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	onAttach?: (self?: Control) => void,

	/**
	 * Callback method when the Control is detached from a [[Context]]. 
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	onDetach?: (self?: Control) => void,

	/**
	 * Callback method when a [[Drawable]] has just been attached on the Control. 
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	onDrawable?: (self?: Control) => void,
}

export interface IControlButtonAttributes extends IControlAttributes
{
	callbackLeftClick?: (smuggler: any) => void,
	callbackRightClick?: (smuggler: any) => void, 
	smugglerLeftClick?: any, 
	smugglerRightClick?: any
}
