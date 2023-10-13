import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableRectangleAttributes} from '../interfaces/IDrawable.js';



/**
 * The Rectangle class creates a new rectangle [[Drawable]] with the specified attributes.
 *
 * The following code creates rectangle with no border and 2 rounded corner.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const rectangle: Paperless.Drawables.Rectangle;
 *
 * rectangle = new Paperless.Drawables.Rectangle({
 * 	size: {width: 100, height: 50},
 * 	rounded: {topLeft: 10, bottomRight: 10},
 * 	nostroke: true
 * });
 * 
 * context.attach(document.body);
 * context.attach(rectangle);
 * ```
 */
export class Rectangle extends Drawable
{
	private _rounded: {topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number};
	//---

	/**
	 * Contructs an Rectangle drawable.
	 */
	public constructor(attributes: IDrawableRectangleAttributes = {})
	{
		super(attributes);

		const {
			generate = true,
			rounded = {}
		} = attributes;

		this._rounded = {...{topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0}, ...rounded};

		if(generate)
			this.generate();
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		const point: Point = new Point(-this.width / 2, -this.height / 2);
		const points: Point[] = [
			new Point(point.x, point.y),
			new Point(point.x + this.width, point.y),
			new Point(point.x + this.width, point.y + this.height),
			new Point(point.x, point.y + this.height),
		];

		this.path = new Path2D();
		this.path.moveTo(points[0].x + this._rounded.topLeft, points[0].y);
		this.path.lineTo(points[1].x - this._rounded.topRight, points[1].y);
		this.path.quadraticCurveTo(points[1].x, points[1].y, points[1].x, points[1].y + this._rounded.topRight);
		this.path.lineTo(points[2].x, points[2].y - this._rounded.bottomRight);
		this.path.quadraticCurveTo(points[2].x, points[2].y, points[2].x - this._rounded.bottomRight, points[2].y);
		this.path.lineTo(points[3].x + this._rounded.bottomLeft, points[3].y);
		this.path.quadraticCurveTo(points[3].x, points[3].y, points[3].x, points[3].y - this._rounded.bottomLeft);
		this.path.lineTo(points[0].x, points[0].y + this._rounded.topLeft);
		this.path.quadraticCurveTo(points[0].x, points[0].y, points[0].x + this._rounded.topLeft, points[0].y);
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
	public clone(attributes: IDrawableRectangleAttributes = {}): Rectangle
	{
		const cloned: Rectangle = new Rectangle({
			...this.attributes,
			...{
				rounded: this._rounded,
			},
			...attributes
		});

		return cloned;
	}


	
	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the current rounded values of the different corner.
	 */
	public get rounded(): {topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number}
	{
		return this._rounded;
	}
	/**
	 * Sets the current value of the different corner. 
	 */
	public set rounded(rounded: {topLeft?: number, topRight?: number, bottomLeft?: number, bottomRight?: number})
	{
		this._rounded = rounded;
	}
}
