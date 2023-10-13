import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableCrossAttributes} from '../interfaces/IDrawable.js';


/**
 * The Cross class creates a new cross [[Drawable]] with the specified attributes.
 *
 * ```typescript
 * const context: Paperless.Context;
 * const cross: Paperless.Drawables.Cross;
 *
 * cross = new Paperless.Drawables.Cross({
 * 	linewidth: 15,
 * 	angle: 30
 * });
 * 
 * context.attach(document.body);
 * context.attach(cross);
 * ```
 */
export class Cross extends Drawable
{
	/**
	 * Contructs an Cross drawable.
	 */	
	public constructor(attributes: IDrawableCrossAttributes = {})
	{
		super({
			...{linewidth: 10}, 
			...attributes,
			...{nofill: true}
		});

		const {
			generate = true,
		} = attributes;

		if(generate)
			this.generate();
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		const points: Point[] = [
			new Point(0, -this.height / 2),
			new Point(0, this.height / 2),
			new Point(-this.width / 2, 0),
			new Point(this.width / 2, 0)
		];

		this.path = new Path2D();
		this.path.moveTo(points[0].x, points[0].y);
		this.path.lineTo(points[1].x, points[1].y);
		this.path.moveTo(points[2].x, points[2].y);
		this.path.lineTo(points[3].x, points[3].y);
		this.path.closePath();

		this.points = points;
		this.boundaries = { 
			topleft: new Point(this.x - (this.width / 2) - (this.nostroke ? 0 : this.linewidth / 2), this.y - (this.height / 2) - (this.nostroke ? 0 : this.linewidth / 2)), 
			bottomright: new Point(this.x + (this.width / 2) + (this.nostroke ? 0 : this.linewidth / 2), this.y + (this.height / 2) + (this.nostroke ? 0 : this.linewidth / 2)) 
		}
	}


	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableCrossAttributes = {}): Cross
	{
		const cloned: Cross = new Cross({
			...this.attributes,
			...attributes
		});

		return cloned;
	}
}
