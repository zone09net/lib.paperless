import {Context} from "../Context";
import {DrawAction} from '../DrawAction.js';



export interface IDrawActionAttributes 
{
	context?: Context,
	layer?: number,

	onAttach?: (self?: DrawAction) => void,
	onDetach?: (self?: DrawAction) => void,
	onDrawBefore?: (context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction) => void,
	onDrawAfter?: (context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction) => void,
}

