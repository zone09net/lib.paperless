import {Context} from "../Context";
import {MouseAction} from '../MouseAction.js';



export interface IMouseActionAttributes 
{
	context?: Context,
	layer?: number,

	onAttach?: (self?: MouseAction) => void,
	onDetach?: (self?: MouseAction) => void,
	onMouseMove?: (context: Context, self?: MouseAction) => void,
	onMouseDown?: (context: Context, self?: MouseAction) => void,
	onMouseUp?: (context: Context, self?: MouseAction) => void,
}

