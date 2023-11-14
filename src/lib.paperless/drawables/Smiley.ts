import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableSmileyAttributes} from '../interfaces/IDrawable.js';



/**
 * The Smiley class creates a new smiley [[Drawable]] with the specified attributes.
 *
 * The following code creates a kind of elipse.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const smiley: Paperless.Drawables.Smiley;
 *
 * smiley = new Paperless.Drawables.Smiley({
 * 	fillcolor: '#e2c046',
 * 	filleyes: '#000000',
 * 	fillmouth: '#000000'
 * });
 * 
 * context.attach(document.body);
 * context.attach(smiley);
 * ```
 */
export class Smiley extends Drawable
{
	private _outerRadius: number;
	private _mouth: Path2D;
	private _eyes: Path2D;
	private _fillmouth: string;
	private _filleyes: string;
	//---

	/**
	 * Contructs an Smiley drawable.
	 */
	public constructor(attributes: IDrawableSmileyAttributes = {})
	{
		super({
			...attributes,
			...{nostroke: true}
		});

		const {
			generate = true,
			outerRadius = 25,
			fillmouth  = '#000000',
			filleyes = '#000000',
		} = attributes;

		this.width = outerRadius * 2;
		this.height = outerRadius * 2;

		this._outerRadius = outerRadius
		this._mouth = new Path2D();
		this._eyes = new Path2D();
		this._fillmouth = fillmouth;
		this._filleyes = filleyes;

		if(generate)
			this.generate();
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		this.path = new Path2D();
		this._mouth = new Path2D();
		this._eyes = new Path2D();

		this.path.arc(0, 0, this._outerRadius, 0, Math.PI * 4, false); 
		this._mouth.arc(0, this._outerRadius / 10, this._outerRadius / 1.5, 0, Math.PI, false); 
		
		this._eyes.moveTo(-20, -5);
		this._eyes.arc(-(this._outerRadius / 3), -(this._outerRadius / 2.5), this._outerRadius / 5, 0, Math.PI * 4, false); 
		this._eyes.moveTo(this._outerRadius / 3, -(this._outerRadius / 2.5));
		this._eyes.arc(this._outerRadius / 3, -(this._outerRadius / 2.5), this._outerRadius / 5, 0, Math.PI * 4, false); 

		this.path.closePath();
		this._mouth.closePath();
		this._eyes.closePath();

		this.width = this._outerRadius * 2;
		this.height = this._outerRadius * 2;
		this.boundaries = { 
			topleft: new Point(this.x - this._outerRadius, this.y - this._outerRadius), 
			bottomright: new Point(this.x + this._outerRadius, this.y + this._outerRadius) 
		}
	}

	/**
	 * Draws the [[Drawable]] on the [[Context]] canvas. This method is usualy called by the [[Context]] refresh so the current
	 * canvas context is given. If the user need to call the draw method manualy, he will have to provide the canvas context
	 * with the [[Context]] context2D accessor.
	 * 
	 * @param 	context2D			Current canvas context to use. 
	 */
	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(
			this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, 
			this.matrix.e + this.offset1.x + this.offset2.x, 
			this.matrix.f + this.offset1.y + this.offset2.y
		);

		context2D.lineWidth = this.linewidth;
		context2D.globalAlpha = this.alpha;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;

		if(!this.nofill)
		{
			context2D.fillStyle = this.fillcolor;
			context2D.fill(this.path);
			context2D.fillStyle = this._fillmouth;
			context2D.fill(this._mouth);
			context2D.fillStyle = this._filleyes;
			context2D.fill(this._eyes);
		}

		context2D.restore();
	}

	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableSmileyAttributes = {}): Smiley
	{
		const cloned: Smiley = new Smiley({
			...this.attributes,
			...{
				radius: this._outerRadius,
				fillmouth: this._fillmouth,
				filleyes: this._filleyes,
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the current radius of the Smiley.
	 */
	public get outerRadius(): number
	{
		return this._outerRadius;
	}
	/**
	 * Sets the current radius of the Smiley. 
	 */
	public set outerRadius(outerRadius: number)
	{
		this._outerRadius = outerRadius;
	}

	/**
	 * Gets the current fill color of the Smiley mouth.
	 */
	public get fillmouth(): string
	{
		return this._fillmouth;
	}
	/**
	 * Sets the current fill color of the Smiley mouth.
	 */
	public set fillmouth(fillmouth: string)
	{
		this._fillmouth = fillmouth;
	}

	/**
	 * Gets the current fill color of the Smiley eyes.
	 */
	public get filleyes(): string
	{
		return this._filleyes;
	}
	/**
	 * Sets the current fill color of the Smiley eyes.
	 */
	public set filleyes(filleyes: string)
	{
		this._filleyes = filleyes;
	}
}

