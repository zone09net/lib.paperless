

import * as Drawables from './drawables/Drawables.js';
import {default as IntersectsJS} from '@extlib/intersects';



export class Intersects
{
	public static isCircleIntersectCircle(circle1: Drawables.Circle | Drawables.Smiley | Drawables.Star | Drawables.Blade, circle2: Drawables.Circle | Drawables.Smiley | Drawables.Star | Drawables.Blade): boolean
	{
		return IntersectsJS.circleCircle(circle1.x, circle1.y, circle1.outerRadius, circle2.x, circle2.y, circle2.outerRadius);
 	}
}
