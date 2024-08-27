import {Context} from "../Context";
import {DragAction} from '../DragAction.js';



export interface IDragActionAttributes 
{
	/**
	 * The Context can be set directly in the attributes, acting the same way as calling the [[Context.attach]] method.
	 */
	context?: Context,

	/**
	 * Setting the layer in the attributes will override the layer that the DragAction would have been set by the [[Context]]. 
	 * Need to have the context set in the attributes for this to work.
	 */
	layer?: number,

	/**
	 * Sets the removable status of the DragAction. When set to false, the DragAction cannot be removed with the [[Context.detach]] method.
	 *
	 * @defaultvalue true
	 */
	removable?: boolean,

	/**
	 * Callback method when the DragAction is attached to a [[Context]].
	 *
	 * @param self				The DragAction itself, automatically set by the Context.
	 */
	onAttach?: (self?: DragAction) => void,
		
	/**
	 * Callback method when the DragAction is detached from a [[Context]]. 
	 *
	 * @param self				The DragAction itself, automatically set by the Context.
	 */	
	onDetach?: (self?: DragAction) => void,
	
	/**
	 * Callback method when entering the global drag phase.
	 *
	 * @param self				The DragAction itself, automatically set by the Context.
	 */	
	 onDragBegin?: (self?: DragAction) => void,

	 /**
	  * Callback method when in the global drag phase.
	  *
	  * @param self				The Control itself, automatically set by the Context.
	  */
	 onDrag?: (self?: DragAction) => void,
 
	 /**
	  * Callback method when the global drag phase as stopped.
	  *
	  * @param self				The DragAction itself, automatically set by the Context.
	  */
	 onDragEnd?: (self?: DragAction) => void,
}

