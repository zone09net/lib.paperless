import {Point} from '../Point.js';
import {Rectangle} from './Rectangle.js';
import {IDrawableArtworkAttributes} from '../interfaces/IDrawable.js';


/**
 * The Artwork class creates a new artwork [[Drawable]] with the specified attributes.
 * The class can take either a web source link, base64 string or a HTMLImageElement object.
 * 
 * ```typescript
 * const context: Paperless.Context;
 * const artwork: Paperless.Drawables.Artwork;
 *
 * artwork = new Paperless.Drawables.Artwork({
 * 	content: 'data:image/png;base64,iVBORw0K ... 5ErkJggg=='
 * });
 * 
 * context.attach(document.body);
 * context.attach(artwork);
 * ```
 */
export class Artwork extends Rectangle
{
	private _image: HTMLImageElement = new Image();
	private _padding: number;
	private _autosize: boolean;
	private _autoload: boolean;
	//---

	/**
	 * Contructs an Artwork drawable. On the constructor call, the artwork will not be generated, it
	 * is only when the image will be completely loaded if [[autosize]] is set to true.
	 */
	public constructor(attributes: IDrawableArtworkAttributes = {})
	{
		super({
			...attributes, 
			...{generate: false}
		});

		const {
			content = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
			autoload = true,
			padding = 0,
			autosize = true,
			nofill = true,
			nostroke = true,
		} = attributes;

		this._padding = padding;
		this._autosize = autosize;
		this._autoload = autoload;
		this.nofill = nofill;
		this.nostroke = nostroke;

		if(content instanceof HTMLImageElement)
			this._image = content;
		else if(typeof content === 'string')
			this._image.src = content;

		this._image.onload = () => {
			if(this._autosize)
			{
				this.width = this._image.width;
				this.height = this._image.height;
			}

			if(this._autoload)
			{
				this.generate();
				this.context.refresh();
			}
		};
	}

	/**
	 * Generates the [[Drawable]] for the Artwork, this is not called until the content image is successfully loaded if the
	 * [[autoload]] is set to true. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		const point: Point = new Point(-this.width / 2, -this.height / 2);
		const points: Array<Point> = [
			new Point(point.x, point.y),
			new Point(point.x + this.width, point.y),
			new Point(point.x + this.width, point.y + this.height),
			new Point(point.x, point.y + this.height)
		];

		this.path = new Path2D();
		this.path.rect(points[0].x, points[0].y, this.width, this.height);
		this.path.closePath();

		this.points = points;
		this.boundaries = { 
			topleft: new Point(this.x - (this.width / 2) - (this.nostroke ? 0 : this.linewidth / 2), this.y - (this.height / 2) - (this.nostroke ? 0 : this.linewidth / 2)), 
			bottomright: new Point(this.x + (this.width / 2) + (this.nostroke ? 0 : this.linewidth / 2), this.y + (this.height / 2) + (this.nostroke ? 0 : this.linewidth / 2)) 
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
		context2D.strokeStyle = this.strokecolor;
		context2D.fillStyle = this.fillcolor;
		context2D.globalAlpha = this.alpha;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;
		context2D.imageSmoothingEnabled = false;

		if(!this.nostroke)
			context2D.stroke(this.path);
		if(!this.nofill)
			context2D.fill(this.path);

		context2D.drawImage(this._image, 0, 0, this._image.width, this._image.height, -this.width / 2 + this._padding, -this.height / 2 + this._padding, this._image.width, this._image.height);
		context2D.restore();
	}

	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableArtworkAttributes = {}): Artwork
	{
		const cloned: Artwork = new Artwork({
			...this.attributes,
			...{
				content: this._image,
				padding: this._padding,
				autosize: this._autosize,
				autoload: this._autoload
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Sets the content image source. This can be either in the base64 format beginning with something like *data:image/png;base64,*
	 * or an image link from the web.
	 */
	public set base64(base64: string)
	{
		this._image.src = base64;
	}
	/**
	 * Gets the source of the image
	 */
	public get base64(): string
	{
		return this._image.src;
	}

	/**
	 * Sets the content image from a Javascript objet.
	 */
	public set image(image: HTMLImageElement)
	{
		this._image = image;
	}
	/**
	 * Gets the content image as a Javascript object.
	 */
	public get image(): HTMLImageElement
	{
		return this._image;
	}

	/**
	 * Gets the padding surrounding the image.
	 */
	get padding(): number
	{
		return this._padding;
	}
	/**
	 * Sets the padding surrounding the image.
	 */
	set padding(padding: number)
	{
		this._padding = padding;
	}

	/**
	 * Gets the value true or false of the autosize.
	 */
	get autosize(): boolean
	{
		return this._autosize;
	}
	/**
	 * Sets the value of the autosize. When an image has finished loading, the current width and height of the Artwork
	 * will be set with the image size if this value is set to true.
	 */
	set autosize(autosize: boolean)
	{
		this._autosize = autosize;
	}

	/**
	 * Gets the value true or false of the autoload.
	 */
	get autoload(): boolean
	{
		return this._autoload;
	}
	/**
	 * Sets the value of the autoload. When the image has finished loading, the [[generate]] method will be called
	 * to set the Artwork properties if this value is set to true.
	 */
	set autoload(autoload: boolean)
	{
		this._autoload = autoload;
	}
}
