import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableHexagonAttributes} from '../interfaces/IDrawable.js';



export class Hexagon extends Drawable
{
	private _radius: number;
	private _sides: number;
	//---

	public constructor(point: Point, radius: number, attributes: IDrawableHexagonAttributes = {})
	{
		super(point, attributes);

		const {
			sides = 6,
			generate = true,
		} = attributes;

		this._radius = radius;
		this._sides = sides;
		this.size = new Size(radius * 2, radius * 2);

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		let points: Array<Point> = [];
		let ybounding = ((Math.sqrt(3) / 2) * this._radius * 2) / 2;

		for(let i: number = 1; i < (this._sides + 1); i++)
		{
			let dAngle: number = (i * (2 * Math.PI) / this._sides);
			let point: Point = new Point(this._radius * Math.cos(dAngle), this._radius * Math.sin(dAngle));

			points.push(point);
			point = null;
		}

		this.clearPath();
		this.path.moveTo(points[0].x, points[0].y);
		for(let i: number = 1; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y);
		this.path.closePath();

		this.points = points;
		this.boundaries = { topleft: new Point(this.x - this._radius, this.y - ybounding), bottomright: new Point(this.x + this._radius, this.y + ybounding) }
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

		context2D.strokeStyle = this.strokecolor;
		context2D.fillStyle = this.fillcolor;
		context2D.lineWidth = this.linewidth;
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
	
	public get radius(): number
	{
		return this._radius;
	}
	public set radius(radius: number)
	{
		this._radius = radius;
	}

	public get sides(): number
	{
		return this._sides;
	}
	public set sides(sides: number)
	{
		this._sides = sides;
	}
}
