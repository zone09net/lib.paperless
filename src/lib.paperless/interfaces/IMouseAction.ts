import {Context} from "../Context";
import {MouseAction} from '../MouseAction.js';



export interface IMouseActionAttributes 
{
	/**
	 * The Context can be set directly in the attributes, acting the same way as calling the [[Context.attach]] method.
	 */
	context?: Context,

	/**
	 * Setting the layer in the attributes will override the layer that the MouseAction would have been set by the [[Context]]. 
	 * Need to have the context set in the attributes for this to work.
	 */
	layer?: number,

	/**
	 * Sets the removable status of the MouseAction. When set to false, the MouseAction cannot be removed with the [[Context.detach]] method.
	 *
	 * @defaultvalue true
	 */
	removable?: boolean,

	/**
	 * Callback method when the MouseAction is attached to a [[Context]].
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */
	onAttach?: (self?: MouseAction) => void,

	/**
	 * Callback method when the MouseAction is detached from a [[Context]]. 
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */
	onDetach?: (self?: MouseAction) => void,

	/**
	 * Callback method when the mouse move event is set on the [[Context]]. On every event, the last and current variables of 
	 * [[IStates.pointer]] are updated, see [[Context.states]].
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */
	onMouseMove?: (self?: MouseAction) => void,

	/**
	 * Callback method when the mouse click event is set on the [[Context]]. On the event, the clicked variable of 
	 * [[IStates.pointer]] and [[IStates.mousedown]] are updated, see [[Context.states]].
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */
	onMouseDown?: (self?: MouseAction) => void,

	/**
	 * Callback method when the mouse release event is set on the [[Context]]. On the event, the control variable of 
	 * [[IStates.pointer]] and [[IStates.mousedown]] are updated, see [[Context.states]].
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */	
	onMouseUp?: (self?: MouseAction) => void,
}

