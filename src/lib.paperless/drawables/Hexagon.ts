import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableHexagonAttributes} from '../interfaces/IDrawable.js';



/**
 * The Hexagon class creates a new hexagon [[Drawable]] with the specified attributes.
 * When creating the object, the class is not limited to the 6 sides an hexagon could have, thus
 * anyone could create a circle with enough sides.
 * 
 * The following code creates none filled hexagon.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const hexagon: Paperless.Drawables.Hexagon;
 *
 * hexagon = new Paperless.Drawables.Hexagon({
 * 	nofill: true,
 * });
 * 
 * context.attach(document.body);
 * context.attach(hexagon);
 * ```
 */
export class Hexagon extends Drawable
{
	private _radius: number;
	private _sides: number;
	//---

	/**
	 * Contructs an Hexagon drawable.
	 */
	public constructor(attributes: IDrawableHexagonAttributes = {})
	{
		super(attributes);

		const {
			generate = true,
			sides = 6,
			radius = 25
		} = attributes;

		this._radius = radius;
		this._sides = sides;
		this.width = radius * 2;
		this.height = radius * 2;

		if(generate)
			this.generate();
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		const points: Point[] = [];

		for(let i: number = 1; i < (this._sides + 1); i++)
		{
			const angle: number = (i * (2 * Math.PI) / this._sides);
			points.push(new Point(this._radius * Math.cos(angle), this._radius * Math.sin(angle)));
		}

		this.path = new Path2D();
		this.path.moveTo(points[0].x, points[0].y);
		for(let i: number = 1; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y);
		this.path.closePath();

		this.points = points;
		this.width = this._radius * 2;
		this.height = this._radius * 2;
		this.boundaries = { 
			topleft: new Point(this.x - this._radius - (this.nostroke ? 0 : this.linewidth / 2), this.y - this._radius - (this.nostroke ? 0 : this.linewidth / 2)), 
			bottomright: new Point(this.x + this._radius + (this.nostroke ? 0 : this.linewidth / 2), this.y + this._radius + (this.nostroke ? 0 : this.linewidth / 2)) 
		}
	}

	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableHexagonAttributes = {}): Hexagon
	{
		const cloned: Hexagon = new Hexagon({
			...this.attributes,
			...{
				radius: this._radius,
				sides: this._sides,
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the current radius of the Hexagon.
	 */
	public get radius(): number
	{
		return this._radius;
	}
	/**
	 * Sets the current radius of the Hexagon. 
	 */
	public set radius(radius: number)
	{
		this._radius = radius;
	}

	/**
	 * Get the current sides number of the Hexagon
	 */
	public get sides(): number
	{
		return this._sides;
	}
	/**
	 * Sets the current sides number of the Hexagon.
	 */
	public set sides(sides: number)
	{
		this._sides = sides;
	}
}
