import {Context} from "../Context";
import {Component} from '../Component.js';



export interface IComponentAttributes 
{
	point?: {x?: number, y?: number},

	size?: {width?: number, height?: number},
	
	/**
	 * Determines if the component is going to be sticky or not. When set to true, the sticky property tells the [[Context]] to draw 
	 * a [[Drawable]] at the top of the others. As a [[Component]] is a regroupment of Drawables and Controls, it is the responsibility 
	 * of the developer to make sure that the sticky value is spawned in the child entities.
	 */
	sticky?: boolean,
	/**
	 * Setting removable to false will deactivate the ability to [[detach]] the [[Component]] from the [[Context]].
	 * 
	 * @todo						Not usable, need to be implemented.
	 */
	removable?: boolean,

	context?: Context,

	onAttach?: (self?: Component) => void,
	onDetach?: (self?: Component) => void,
	onResize?: (self?: Component) => void,
}
