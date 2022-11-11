import {Point} from '../Point.js';
import {Hexagon} from './Hexagon.js';
import {IDrawableAttributes} from '../IDrawable.js';



export class Triangle extends Hexagon
{
	public constructor(point: Point, radius: number, attributes: IDrawableAttributes = {})
	{
		super(point, radius, {...attributes, ...{sides: 3, rotation: 30}});
	}
}
