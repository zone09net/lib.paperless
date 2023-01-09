import {Point} from '../Point.js';
import {Hexagon} from './Hexagon.js';
import {IDrawableAttributes} from '../interfaces/IDrawable.js';



export class Triangle extends Hexagon
{
	public constructor(point: Point, radius: number, attributes: IDrawableAttributes = {})
	{
		super(point, radius, {...{sides: 3, angle: 30}, ...attributes});
	}
}
