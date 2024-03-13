import {Context} from "../Context";
import {Layer} from '../LAyer.js';



export interface ILayerAttributes 
{
	context?: Context,
	index?: number,

	onAttach?: (self?: Layer) => void,
	onDetach?: (self?: Layer) => void,
}

