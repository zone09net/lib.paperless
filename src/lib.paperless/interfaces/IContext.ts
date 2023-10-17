import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Restrict} from '../enums/Restrict.js';



export interface IFeatures 
{
	nohover?: boolean,
	nodragging?: boolean,
	nosnapping?: boolean,
}

export interface IDragging 
{
	delay?: number,
	grid?: {x?: number, y?: number},
	restrict?: Restrict
}

export interface IContextAttributes {
	scale?: number,
	size?: Size,
	autosize?: boolean,
	features?: IFeatures,
	dragging?: IDragging,
}

export interface IStates 
{
	mobile: boolean,
	mousedown: boolean,
	pinch: boolean,
	drag: boolean,
	focussed: string,
	sorted: boolean,
	norefresh: boolean, 

	pointer: {
		current: Point,
		last: Point,
		clicked: Point,
		control: string,
		dragdiff: Point,
	},

	touch: {
	},

	refresh: {
		delta: number,
		elapsed: number
	}
}
