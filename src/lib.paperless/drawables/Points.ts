import {Drawable} from '../Drawable.js';
import {Context} from '../Context.js';
import {IDrawableAttributes} from '../interfaces/IDrawable.js';



export class Points extends Drawable
{
	/**
	 * Contructs an Points drawable.
	 */
	public constructor(attributes: IDrawableAttributes = {})
	{
		const context: Context = attributes.context;

		super({
			...attributes,
			...{
					context: null,
					layer: null,
					generate: false
				}
		});

		this.generate();
		context ? context.attach(this, attributes.layer) : null;
	}


	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		this.path = new Path2D();
		this.path.moveTo(this.points[0].x, this.points[0].y);
		for(let i: number = 1; i < this.points.length; i++)
			this.path.lineTo(this.points[i].x, this.points[i].y);
		this.path.lineTo(this.points[0].x, this.points[0].y);
		this.path.closePath();

		//this.boundaries = { 
		//	topleft: new Point(this.x - (this.width / 2) - (this.nostroke ? 0 : this.linewidth / 2), this.y - (this.height / 2) - (this.nostroke ? 0 : this.linewidth / 2)), 
		//	bottomright: new Point(this.x + (this.width / 2) + (this.nostroke ? 0 : this.linewidth / 2), this.y + (this.height / 2) + (this.nostroke ? 0 : this.linewidth / 2)) 
		//}
	}

	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableAttributes = {}): Points
	{
		const cloned: Points = new Points({
			...this.attributes,
			...attributes
		});

		return cloned;
	}
}
