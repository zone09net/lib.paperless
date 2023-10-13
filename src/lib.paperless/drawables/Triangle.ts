import {Point} from '../Point.js';
import {Hexagon} from './Hexagon.js';
import {IDrawableTriangleAttributes} from '../interfaces/IDrawable.js';



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
export class Triangle extends Hexagon
{
	/**
	 * Contructs an Triangle drawable.
	 */
	public constructor(attributes: IDrawableTriangleAttributes = {})
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
	public clone(attributes: IDrawableTriangleAttributes = {}): Triangle
	{
		const cloned: Triangle = new Triangle({
			...this.attributes,
			...{
				sides: 3,
				radius: this.radius
			},
			...attributes
		});

		return cloned;
	}
}
