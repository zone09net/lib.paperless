import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableCircleAttributes} from '../interfaces/IDrawable.js';



/**
 * The Circle class creates a new circle [[Drawable]] with the specified attributes.
 *
 * The following code creates a kind of rotating elipse.
 * 
 * ```typescript
 * const context: Paperless.Context = new Paperless.Context({autosize: true});
 * 
 * context.fx.add({
 * 	duration: 1000,
 * 	drawable: new Paperless.Drawables.Circle({
 * 		context: context,
 * 		innerRadius: 15,
 * 		angleStart: 90,
 * 		angleEnd: 235,
 * 	}),
 * 	effect: (fx: Paperless.Interfaces.IFx) => {
 * 		(<Paperless.Drawable>fx.drawable).rad = fx.smuggler.ease(fx.t) * 6.28 * Math.sign(fx.smuggler.angle | 1);
 * 	},
 * 	loop: true,
 * 	smuggler: { 
 * 		ease: Paperless.Fx.easeLinear, 
 * 	}
 * });
 * 
 * context.attach(document.body);
 * ```
 */
export class Circle extends Drawable
{
	private _outerRadius: number;
	private _innerRadius: number;
	private _angleStart: number;
	private _angleEnd: number;
	//---

	/**
	 * Contructs an Circle drawable.
	 */
	public constructor(attributes: IDrawableCircleAttributes = {})
	{
		super(attributes);

		const {
			generate = true,
			angleStart = 0,
			angleEnd = 360,
			outerRadius = 25,
			innerRadius = 0,
		} = attributes;

		this._outerRadius = outerRadius;
		this._innerRadius = innerRadius;
		this._angleStart = angleStart;
		this._angleEnd = angleEnd;
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
		const points: Point[] = [
			new Point(0, 0),
			new Point(0, 0)
		];
		
		points[0].translate(this._angleEnd, this._outerRadius);
		points[1].translate(this._angleStart, this._innerRadius)

		this.path = new Path2D();

		if(this._angleStart != 0 || this._angleEnd != 360 || this._innerRadius != 0)
		{
			this.path.arc(0, 0, this._innerRadius, (this._angleStart / 180) * Math.PI, (this._angleEnd / 180) * Math.PI, false);
			this.path.lineTo(points[0].x, points[0].y);
		}
		
		this.path.arc(0, 0, this._outerRadius, (this._angleEnd / 180) * Math.PI, (this._angleStart / 180) * Math.PI, true);
		
		if(this._angleStart != 0 || this._angleEnd != 360 || this._innerRadius != 0)
			this.path.lineTo(points[1].x, points[1].y);

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
	public clone(attributes: IDrawableCircleAttributes = {}): Circle
	{
		const cloned: Circle = new Circle({
			...this.attributes,
			...{
				outerRadius: this._outerRadius,
				innerRadius: this._innerRadius,
				angleStart: this._angleStart,
				angleEnd: this.angleEnd
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the current outer radius of the circle.
	 */
	public get outerRadius(): number
	{
		return this._outerRadius;
	}
	/**
	 * Sets the current outer radius of the circle.
	 */
	public set outerRadius(outerRadius: number)
	{
		this._outerRadius = outerRadius;
	}

	/**
	 * Gets the current inner radius of the circle.
	 */	
	public get innerRadius(): number
	{
		return this._innerRadius;
	}
	/**
	 * Sets the current inner radius of the circle. When the inner radius is greater then 0, the class Circle will create a ring.
	 */
	public set innerRadius(innerRadius: number)
	{
		this._innerRadius = innerRadius;
	}

	/**
	 * Gets the current start angle of the circle.
	 */		
	public get angleStart(): number
	{
		return this._angleStart;
	}
	/**
	 * Sets the current start angle of the circle. Depending on the [[angleStart]] and [[angleEnd]] values, the class Circle will create an arc.
	 */	
	public set angleStart(angleStart: number)
	{
		this._angleStart = angleStart;
	}

	/**
	 * Gets the current end angle of the circle.
	 */	
	public get angleEnd(): number
	{
		return this._angleEnd;
	}
	/**
	 * Sets the current end angle of the circle. Depending on the [[angleStart]] and [[angleEnd]] values, the class Circle will create an arc.
	 */	
	public set angleEnd(angleEnd: number)
	{
		this._angleEnd = angleEnd;
	}
}
