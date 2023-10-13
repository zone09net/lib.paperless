import {Point} from '../Point.js';
import {Star} from './Star.js';
import {IDrawableBladeAttributes} from '../interfaces/IDrawable.js';



/**
 * The Blade class creates a new blade [[Drawable]] with the specified attributes. It is in fact a variant
 * of the [[Star]] class.
 *
 * The following code creates a 3 tooth blade.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const blade: Paperless.Drawables.Blade;
 *
 * blade = new Paperless.Drawables.Blade({
 * 	spike: 6,
 * 	twist: 4,
 * });
 * 
 * context.attach(document.body);
 * context.attach(blade);
 * ```
 */
export class Blade extends Star
{
	private _twist: number;
	//---

	/**
	 * Contructs an Blade drawable.
	 */
	public constructor(attributes: IDrawableBladeAttributes = {})
	{
		super({
			...attributes, 
			...{generate: false}
		});

		const {
			generate = true,
			twist = 4
		} = attributes;

		this._twist = twist;

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
	
		for(let i: number = 0; i < this.spikes; i++)
		{
			const angle: number = (i * (this._twist * Math.PI) / this.spikes);

			points.push(new Point(this.outerRadius * Math.cos(angle), this.outerRadius * Math.sin(angle)));
			points.push(new Point(this.innerRadius * Math.cos(angle), this.innerRadius * Math.sin(angle)));
		 }

		this.path = new Path2D();
		for(let i: number = 0; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y)
		this.path.closePath();

		this.points = points;
		this.width = this.outerRadius * 2;
		this.height = this.outerRadius * 2;
		this.boundaries = { 
			topleft: new Point(this.x - this.outerRadius - (this.nostroke ? 0 : this.linewidth / 2), this.y - this.outerRadius - (this.nostroke ? 0 : this.linewidth / 2)), 
			bottomright: new Point(this.x + this.outerRadius + (this.nostroke ? 0 : this.linewidth / 2), this.y + this.outerRadius + (this.nostroke ? 0 : this.linewidth / 2)) 
		}
	}


	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableBladeAttributes = {}): Blade
	{
		const cloned: Blade = new Blade({
			...this.attributes,
			...{
				outerRadius: this.outerRadius,
				innerRadius: this.innerRadius,
				spikes: this.spikes,
				twist: this._twist
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the current twist of the Blade spike.
	 */
	public get twist(): number
	{
		return this._twist;
	}
	/**
	 * Gets the current twist each of the Blade spike should have.
	 */
	public set twist(twist: number)
	{
		this._twist = twist;
	}
}

