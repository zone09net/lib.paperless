import {Context} from "../Context";
import {Component} from '../Component.js';



export interface IComponentAttributes 
{
	/**
	 * The Context can be set directly in the attributes, acting the same way as calling the [[Context.attach]] method.
	 */
	context?: Context,

	/**
	 * Setting the layer in the attributes will override the layer that the Component would have been set by the [[Context]]. 
	 * Need to have the context set in the attributes for this to work.
	 */
	layer?: number,

	/**
	 * Setting the x and y coordinates is not mandatory for the Component as it is not really used but it can serve the user
	 * in is own code. This will sets the Component internal [[Point]] variable.
	 */
	point?: {x?: number, y?: number},

	/**
	 * Setting the size is not mandatory for the Component as it is not really used but it can serve the user
	 * in is own code. This will sets the Component internal [[Size]] variable.
	 */
	size?: {width?: number, height?: number},
	
	/**
	 * Determines if the component is going to be sticky or not. When set to true, the sticky property tells the [[Context]] to draw 
	 * a [[Drawable]] at the top of the others. As a Component is a regroupment of Drawables and Controls, it is the responsibility 
	 * of the developer to make sure that the sticky value is spawned in the child entities. This can be done with the 
	 * [[Component.setStickyDrawables]] method.
	 *
	 * @defaultvalue false
	 */
	sticky?: boolean,
	
	/**
	 * Setting removable to false will deactivate the ability to detach the Component with the [[Context.detach]] method.
	 *
	 * @defaultvalue true
	 */
	removable?: boolean,

	/**
	 * Callback method when the Component is attached to a [[Context]].
	 *
	 * @param self				The component itself, automatically set by the Context.
	 */
	onAttach?: (self?: Component) => void,

	/**
	 * Callback method when the Component is detached from a [[Context]]. Since a Component use [[Drawable]] and
	 * [[Control]], the developer needs to make sure to detach every entities created on the life time of the Component.
	 *
	 * @param self				The component itself, automatically set by the Context.
	 */
	onDetach?: (self?: Component) => void,

	/**
	 * Callback method when the browser window get resized. Only called when the feature [[Context.autosize]] is set to true.
	 *
	 * @param self				The component itself, automatically set by the Context.
	 */
	onResize?: (self?: Component) => void,
}

