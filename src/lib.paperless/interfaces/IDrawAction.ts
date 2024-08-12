import {Context} from "../Context";
import {DrawAction} from '../DrawAction.js';



export interface IDrawActionAttributes 
{
	/**
	 * The Context can be set directly in the attributes, acting the same way as calling the [[Context.attach]] method.
	 */
	context?: Context,

	/**
	 * Setting the layer in the attributes will override the layer that the DrawAction would have been set by the [[Context]]. 
	 * Need to have the context set in the attributes for this to work.
	 */
	layer?: number,

	/**
	 * Sets the removable status of the DrawAction. When set to false, the DrawAction cannot be removed with the [[Context.detach]] method.
	 *
	 * @defaultvalue true
	 */
	removable?: boolean,

	/**
	 * Callback method when the DrawAction is attached to a [[Context]].
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */
	onAttach?: (self?: DrawAction) => void,
		
	/**
	 * Callback method when the DrawAction is detached from a [[Context]]. 
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */	
	onDetach?: (self?: DrawAction) => void,
	
	/**
	 * Callback method in the draw phase of the [[Context]], just before every drawables are beeing rendered. 
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */
	onDrawBefore?: (context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction) => void,

	/**
	 * Callback method in the draw phase of the [[Context]], just after every drawables are beeing rendered. 
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */
	onDrawAfter?: (context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction) => void,
}

