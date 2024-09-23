import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawablePolygonAttributes} from '../interfaces/IDrawable.js';



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
export class Polygon extends Drawable
{
	private _outerRadius: number;
	private _innerRadius: number;
	private _angleStart: number;
	private _angleEnd: number;
	private _sides: number;
	//---

	/**
	 * Contructs an Polygon drawable.
	 */
	public constructor(attributes: IDrawablePolygonAttributes = {})
	{
		super(attributes);

		const {
			generate = true,
			sides = 8,
			angleStart = 0,
			angleEnd = 360,
			outerRadius = 25,
			innerRadius = 0,
		} = attributes;

		this._outerRadius = outerRadius;
		this._innerRadius = innerRadius;
		this._angleStart = angleStart;
		this._angleEnd = angleEnd;
		this._sides = sides;
		this.width = outerRadius * 2;
		this.height = outerRadius * 2;

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
		let x: number;
		let y: number;

		for(let i: number = 0; i < (this._sides + 1); i++)
		{
			const angle: number = ((Math.PI / 180) * this._angleStart) + (i * ((Math.PI / 180) * (this._angleEnd - this._angleStart)) / this._sides);
		
			x = this._outerRadius * Math.cos(angle);
			y = this._outerRadius * Math.sin(angle)
			
			points.push(new Point(x, y));
		}

		if(this._innerRadius > 0)
		{
			for(let i: number = (this._sides); i >= 0; i--)
			{
				const angle: number = ((Math.PI / 180) * this._angleStart) + (i * ((Math.PI / 180) * (this._angleEnd - this._angleStart)) / this._sides);
			
				x = this._innerRadius * Math.cos(angle) ;
				y = this._innerRadius * Math.sin(angle) 
				points.push(new Point(x, y));
			}
		}

		this.path = new Path2D();
		this.path.moveTo(points[0].x, points[0].y);
		for(let i: number = 1; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y);
		this.path.closePath();

		this.points = points;
		this.width = this._outerRadius * 2;
		this.height = this._outerRadius * 2;
		this.boundaries = { 
			topleft: new Point(this.x - this._outerRadius - (this.nostroke ? 0 : this.linewidth / 2), this.y - this._outerRadius - (this.nostroke ? 0 : this.linewidth / 2)), 
			bottomright: new Point(this.x + this._outerRadius + (this.nostroke ? 0 : this.linewidth / 2), this.y + this._outerRadius + (this.nostroke ? 0 : this.linewidth / 2)) 
		}
	}

	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawablePolygonAttributes = {}): Polygon
	{
		const cloned: Polygon = new Polygon({
			...this.attributes,
			...{
				outerRadius: this._outerRadius,
				innerRadius: this._innerRadius,
				angleStart: this._angleStart,
				angleEnd: this._angleEnd,
				sides: this._sides,
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the current outer radius of the Polygon.
	 */
	public get outerRadius(): number
	{
		return this._outerRadius;
	}
	/**
	 * Sets the current outer radius of the Polygon.
	 */
	public set outerRadius(outerRadius: number)
	{
		this._outerRadius = outerRadius;
	}

	/**
	 * Gets the current inner radius of the Polygon.
	 */	
	public get innerRadius(): number
	{
		return this._innerRadius;
	}
	/**
	 * Sets the current inner radius of the Polygon. When the inner radius is greater then 0, the class Polygon will create a ring.
	 */
	public set innerRadius(innerRadius: number)
	{
		this._innerRadius = innerRadius;
	}

	/**
	 * Gets the current start angle of the Polygon.
	 */		
	public get angleStart(): number
	{
		return this._angleStart;
	}
	/**
	 * Sets the current start angle of the Polygon. Depending on the [[angleStart]] and [[angleEnd]] values, the class Polygon will create an arc.
	 */	
	public set angleStart(angleStart: number)
	{
		this._angleStart = angleStart;
	}

	/**
	 * Gets the current end angle of the Polygon.
	 */	
	public get angleEnd(): number
	{
		return this._angleEnd;
	}
	/**
	 * Sets the current end angle of the Polygon. Depending on the [[angleStart]] and [[angleEnd]] values, the class Polygon will create an arc.
	 */	
	public set angleEnd(angleEnd: number)
	{
		this._angleEnd = angleEnd;
	}
 
	/**
	 * Get the current sides number of the Polygon
	 */
	public get sides(): number
	{
		return this._sides;
	}
	/**
	 * Sets the current sides number of the Polygon.
	 */
	public set sides(sides: number)
	{
		this._sides = sides;
	}
}
