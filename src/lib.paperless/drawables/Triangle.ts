import {Point} from '../Point.js';
import {Polygon} from './Polygon.js';
import {IDrawablePolygonAttributes} from '../interfaces/IDrawable.js';



/**
 * The Triangle class creates a new triangle [[Drawable]] with the specified attributes.
 *
 * The following code creates triangle with an angle of 75 degrees.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const triangle: Paperless.Drawables.Triangle;
 *
 * triangle = new Paperless.Drawables.Triangle({
 * 	angle: 75
 * });
 * 
 * context.attach(document.body);
 * context.attach(triangle);
 * ```
 */
export class Triangle extends Polygon
{
	/**
	 * Contructs an Triangle drawable.
	 */
	public constructor(attributes: IDrawablePolygonAttributes = {})
	{
		super({
			...{angle: 30},
			...attributes,
			...{sides: 3}
		});
	}

	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawablePolygonAttributes = {}): Triangle
	{
		const cloned: Triangle = new Triangle({
			...this.attributes,
			...{
				outerRadius: this.outerRadius,
				innerRadius: this.innerRadius,
				angleStart: this.angleStart,
				angleEnd: this.angleEnd,
				sides: this.sides,
			},
			...attributes
		});

		return cloned;
	}
}
