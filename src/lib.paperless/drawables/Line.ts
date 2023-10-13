import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableLineAttributes} from '../interfaces/IDrawable.js';




/**
 * The Line class creates a new line [[Drawable]] with the specified attributes.
 *
 * The following code creates line on the y position 50.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const line: Paperless.Drawables.Line;
 *
 * line = new Paperless.Drawables.Line({
 * 	point0: {x: 100, y: 50},
 * 	point1: {x: 250, y: 50}
 * });
 * 
 * context.attach(document.body);
 * context.attach(line);
 * ```
 */
export class Line extends Drawable
{
	private _point0: Point;
	private _point1: Point;
	//---

	/**
	 * Contructs an Line drawable.
	 */
	public constructor(attributes: IDrawableLineAttributes = {})
	{
		super({
			...{linewidth: 10},
			...attributes,
			...{nofill: true}
		});

		const {
			generate = true,
			point0 = {x: (window.innerWidth / 2) - 25, y: window.innerHeight / 2},
			point1 = {x: (window.innerWidth / 2) + 25, y: window.innerHeight / 2},
		} = attributes;

		if(Point.distance(new Point(0, 0), new Point(point0.x, point0.y)) < Point.distance(new Point(0, 0), new Point(point1.x, point1.y)))
		{
			this._point0 = new Point(point0.x, point0.y);
			this._point1 = new Point(point1.x, point1.y);
		}
		else
		{
			this._point0 = new Point(point1.x, point1.y);
			this._point1 = new Point(point0.x, point0.y);
		}

		let point = Point.middle(this._point0, this._point1);
		this.x = point.x;
		this.y = point.y;

		if(generate)
			this.generate();
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		const point: Point = new Point(this.x, this.y);
		const distance1: number = Point.distance(point, this._point0);
		const distance2: number = Point.distance(point, this._point1);

		const angle1: number = Point.angle(point, this._point0);
		const angle2: number = Point.angle(point, this._point1);

		const points: Point[] = [
			new Point(0, 0),
			new Point(0, 0)
		];

		points[0].translate(angle1, distance1);
		points[1].translate(angle2, distance2);

		this.path = new Path2D();
		this.path.moveTo(points[0].x, points[0].y);
		this.path.lineTo(points[1].x, points[1].y);
		this.path.closePath();

		this.points = points;
		this.width = Math.abs(points[1].x - points[0].x);
		this.height = Math.abs(points[1].y - points[0].y);
		this.boundaries = { 
			topleft: new Point(this.x - (this.width / 2), this.y - this.height / 2), 
			bottomright: new Point(this.x + (this.width / 2), this.y + this.height / 2) 
		}
	}

	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableLineAttributes = {}): Line
	{
		const distance1: number = Point.distance(this.point, this._point0);
		const distance2: number = Point.distance(this.point, this._point1);

		const angle1: number = Point.angle(this.point, this._point0);
		const angle2: number = Point.angle(this.point, this._point1);

		const points: Point[] = [
			new Point(window.innerWidth / 2, window.innerHeight / 2),
			new Point(window.innerWidth / 2, window.innerHeight / 2),
		];

		points[0].translate(angle1, distance1);
		points[1].translate(angle2, distance2);

		const cloned: Line = new Line({
			...this.attributes,
			...{
				point0: points[0],
				point1: points[1],
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the first point of the line.
	 */
	public get point0(): Point
	{
		return this.point0;
	}
	/**
	 * Sets the first point of the line.
	 */
	public set point0(point0: Point)
	{
		this._point0 = point0;
	}

	/**
	 * Gets the second point of the line.
	 */
	public get point1(): Point
	{
		return this._point1;
	}
	/**
	 * Sets the second point of the line.
	 */
	public set point1(point1: Point)
	{
		this._point1 = point1;
	}
}
