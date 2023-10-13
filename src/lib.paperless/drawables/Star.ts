import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableStarAttributes} from '../interfaces/IDrawable.js';



/**
 * The Star class creates a new star [[Drawable]] with the specified attributes.
 *
 * The following code creates a 10 spiked star.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const star: Paperless.Drawables.Circle;
 *
 * star = new Paperless.Drawables.Circle({
 * 	innerRadius: 10,
 * 	spikes: 10,
 * 	nostroke: true
 * });
 * 
 * context.attach(document.body);
 * context.attach(star);
 * ```
 */
export class Star extends Drawable
{
	private _spikes: number;
	private _innerRadius: number;
	private _outerRadius: number;
	//---

	/**
	 * Contructs an Star drawable.
	 */
	public constructor(attributes: IDrawableStarAttributes = {})
	{
		super(attributes);

		const {
			generate = true,
			outerRadius = 25,
			innerRadius = 10,
			spikes = 6
		} = attributes;

		this._spikes = spikes;
		this._innerRadius = innerRadius;
		this._outerRadius = outerRadius
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
		const step: number = Math.PI / this._spikes
		let angle: number = Math.PI / 2 * 3;

		for(let i: number = 0; i < this._spikes; i++)
		{
			//const angle: number = (i * (8 * Math.PI) / this._spikes);

			points.push(new Point(this._outerRadius * Math.cos(angle), this._outerRadius * Math.sin(angle)));
			angle += step;
	 
			points.push(new Point(this._innerRadius * Math.cos(angle), this._innerRadius * Math.sin(angle)));
			angle += step;
		 }

		this.path = new Path2D();
		for(let i: number = 0; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y)
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
	public clone(attributes: IDrawableStarAttributes = {}): Star
	{
		const cloned: Star = new Star({
			...this.attributes,
			...{
				outerRadius: this._outerRadius,
				innerRadius: this._innerRadius,
				spikes: this._spikes,
			},
			...attributes
		});

		return cloned;
	}

	

	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the current outer radius.
	 */
	public get outerRadius(): number
	{
		return this._outerRadius;
	}
	/**
	 * Sets the current outer radius.
	 */
	public set outerRadius(outerRadius: number)
	{
		this._outerRadius = outerRadius;
	}

	/**
	 * Gets the current inner radius.
	 */	
	public get innerRadius(): number
	{
		return this._innerRadius;
	}
	/**
	 * Sets the current inner radius.
	 */
	public set innerRadius(innerRadius: number)
	{
		this._innerRadius = innerRadius;
	}
	
	/**
	 * Gets the current number of spike.
	 */
	public get spikes(): number
	{
		return this._spikes;
	}
	/**
	 * Sets the current number of spike.
	 */
	public set spikes(spikes: number)
	{
		this._spikes = spikes;
	}
}

