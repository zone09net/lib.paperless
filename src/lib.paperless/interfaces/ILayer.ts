import {Context} from "../Context";
import {Layer} from '../Layer.js';



export interface ILayerAttributes 
{
	context?: Context,
	index?: number,
	freezed?: boolean,
	visible?: boolean,

	onAttach?: (self?: Layer) => void,
	onDetach?: (self?: Layer) => void,
}

