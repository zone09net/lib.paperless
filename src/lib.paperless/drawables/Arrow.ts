import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableArrowAttributes} from '../interfaces/IDrawable.js';



/**
 * The Arrow class creates a new arrow [[Drawable]] with the specified attributes.
 * 
 * The following code creates a red arrow facing top with a 20x20 base.
 * 
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const arrow: Paperless.Drawables.Arrow;
 *
 * context = new Paperless.Context();
 * arrow = new Paperless.Drawables.Arrow({
 * 	fillcolor: '#ff0000',
 * 	nostroke: true,
 * 	angle: Paperless.Enums.Direction.top,
 * 	basewidth: 20,
 * 	baseheight: 20
 * });
 * 
 * context.attach(document.body);
 * context.attach(arrow);
 * ```
 */
export class Arrow extends Drawable
{
	private _baseWidth: number;
	private _baseHeight: number;
	//---

	/**
	 * Contructs an Arrow drawable.
	 */
	public constructor(attributes: IDrawableArrowAttributes = {})
	{
		super(attributes);

		const {
			generate = true,
			baseHeight = 25,
			baseWidth = 15
		} = attributes;

		this._baseHeight = baseHeight;
		this._baseWidth = baseWidth;

		if(generate)
			this.generate();
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		const diff: number = (this.height - this._baseHeight) / 2;
		const point: Point = new Point(-this.width / 2, -this.height / 2);
		const points: Point[] = [
			new Point(point.x + this._baseWidth, point.y + diff),
			new Point(point.x, point.y + diff),
			new Point(point.x, point.y + this.height - diff),
			new Point(point.x + this._baseWidth, point.y + this.height - diff),
			new Point(point.x + this._baseWidth, point.y + this.height),
			new Point(point.x + this.width, point.y + (this.height / 2)),
			new Point(point.x + this._baseWidth, point.y),
		];

		this.path = new Path2D();
		this.path.moveTo(points[0].x, points[0].y);
		this.path.lineTo(points[1].x, points[1].y);
		for(let i: number = 1; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y)
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
	public clone(attributes: IDrawableArrowAttributes = {}): Arrow
	{
		const cloned: Arrow = new Arrow({
			...this.attributes,
			...{
				baseHeight: this._baseHeight,
				baseWidth: this._baseWidth,
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the width of the arrow's base.
	 */
	public get baseWidth(): number
	{
		return this._baseWidth;
	}
	/**
	 * Set the width of the arrow's base.
	 */
	public set baseWidth(baseWidth: number)
	{
		this._baseWidth = baseWidth;
	}

	/**
	 * Gets the height of the arrow's base.
	 */
	public get baseHeight(): number
	{
		return this._baseHeight;
	}
	/**
	 * Gets the width of the arrow's base.
	 */
	public set baseHeight(baseHeight: number)
	{
		this._baseHeight = baseHeight;
	}
}
