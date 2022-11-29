import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Rectangle} from './Rectangle.js';
import {IDrawableArtworkAttributes} from '../IDrawable.js';



export class Artwork extends Rectangle
{
	private _image: HTMLImageElement = new Image();
	private _padding: number;
	private _autosize: boolean;
	//---

	public constructor(point: Point, size: Size, attributes: IDrawableArtworkAttributes = {})
	{
		super(point, size, {...attributes, ...{generate: false}});

		const {
			content = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
			padding = 0,
			autosize = false,
			nofill = true,
			nostroke = true,
		} = attributes;

		this._padding = padding;
		this._autosize = autosize;
		this.nofill = nofill;
		this.nostroke = nostroke;

		if(content instanceof HTMLImageElement)
			this._image = content;
		else if(typeof content === 'string')
			this._image.src = content;

		this._image.onload = () => {
			if(this._autosize)
			{
				this.size.width = this._image.width;
				this.size.height = this._image.height;
			}

			this.generate();
			this.context.refresh();
		};
	}

	public generate(): void
	{
		let point: Point = new Point(-this.size.width / 2, -this.size.height / 2);
		let points: Array<Point> = [
			new Point(point.x, point.y),
			new Point(point.x + this.size.width, point.y),
			new Point(point.x + this.size.width, point.y + this.size.height),
			new Point(point.x, point.y + this.size.height)
		];

		this.clearPath();
		this.path.rect(points[0].x, points[0].y, this.size.width, this.size.height);

		this.points = points;
		this.boundaries = { topleft: new Point(this.point.x - (this.size.width / 2), this.point.y - (this.size.height / 2)), bottomright: new Point(this.point.x + (this.size.width / 2), this.point.y + (this.size.height / 2)) }
	}
	
	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		if(this.points.length > 0)
		{
			context2D.save();
			context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

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

			context2D.drawImage(this._image, 0, 0, this._image.width, this._image.height, this.points[0].x + this._padding, this.points[0].y + this._padding, this._image.width, this._image.height);
			context2D.restore();
		}
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public set base64(base64: string)
	{
		this._image.src = base64;
	}
	public get base64(): string
	{
		return this._image.src;
	}

	public set image(image: HTMLImageElement)
	{
		this._image = image;
	}
	public get image(): HTMLImageElement
	{
		return this._image;
	}

	get padding(): number
	{
		return this._padding;
	}
	set padding(padding: number)
	{
		this._padding = padding;
	}
}
