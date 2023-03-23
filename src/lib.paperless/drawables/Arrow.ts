import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableArrowAttributes} from '../interfaces/IDrawable.js';



/**
 * The Arrow class creates a new arrow [[Drawable]] with the specified attributes.
 * 
 * The following code creates a red arrow facing top with a 10x10 base.
 * 
 * 
 * ```typescript
 * let arrow: Paperless.Drawables.Arrow;
 *
 * arrow = context.attach(new Paperless.Drawables.Arrow(new Paperless.Point(100, 100), new Paperless.Size(50, 30), {
 * 	fillcolor: '#ff0000',
 * 	nostroke: true,
 * 	angle: Paperless.Enums.Direction.top,
 * 	basewidth: 10,
 * 	baseheight: 10
 * }));
 * ```
 */
export class Arrow extends Drawable
{
	private _basewidth: number;
	private _baseheight: number;
	//---

	public constructor(point: Point, size: Size, attributes: IDrawableArrowAttributes = {})
	{
		super(point, attributes);

		const {
			generate = true,
			baseheight = 15,
			basewidth = 15
		} = attributes;

		this.size = size;
		this._baseheight = baseheight;
		this._basewidth = basewidth;

		if(generate)
			this.generate();
	}

  /**
   * @param {Event} [e] Event object fired on wheel event
   */
	public generate(): void
	{
		const diff: number = (this.size.height - this._baseheight) / 2;
		const point: Point = new Point(-this.size.width / 2, -this.size.height / 2);
		const points: Array<Point> = [
			new Point(point.x + this._basewidth, point.y + diff),
			new Point(point.x, point.y + diff),
			new Point(point.x, point.y + this.size.height - diff),
			new Point(point.x + this._basewidth, point.y + this.size.height - diff),
			new Point(point.x + this._basewidth, point.y + this.size.height),
			new Point(point.x + this.size.width, point.y + (this.size.height / 2)),
			new Point(point.x + this._basewidth, point.y),
		];

		this.clearPath();
		this.path.moveTo(points[0].x, points[0].y);
		this.path.lineTo(points[1].x, points[1].y);
		for(let i: number = 1; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y)
		this.path.closePath();

		this.points = points;
		this.boundaries = { topleft: new Point(this.x - (this.size.width / 2), this.y - (this.size.height / 2)), bottomright: new Point(this.x + (this.size.width / 2), this.y + (this.size.height / 2)) }
	}

	/**
	 * 
	 * @param context2D 
	 */
	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

		context2D.lineWidth = this.linewidth;
		context2D.strokeStyle = this.strokecolor;
		context2D.fillStyle = this.fillcolor;
		context2D.globalAlpha = this.alpha;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;

		if(!this.nostroke)
			context2D.stroke(this.path);
		if(!this.nofill)
			context2D.fill(this.path);

		context2D.restore();
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get basewidth(): number
	{
		return this._basewidth;
	}
	public set basewidth(basewidth: number)
	{
		this._basewidth = basewidth;
	}

	public get baseheight(): number
	{
		return this._baseheight;
	}
	public set baseheight(baseheight: number)
	{
		this._baseheight = baseheight;
	}
}
