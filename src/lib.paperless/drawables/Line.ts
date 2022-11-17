import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableAttributes} from '../IDrawable.js';



export class Line extends Drawable
{
	private _point1: Point;
	private _point2: Point;
	//---

	public constructor(point1: Point, point2: Point, attributes: IDrawableAttributes = {})
	{
		super(Point.middle(point1, point2), attributes);

		const {
			generate = true,
		} = attributes;

		if(Point.distance(new Point(0, 0), point1) < Point.distance(new Point(0, 0), point2))
		{
			this._point1 = new Point(point1.x, point1.y);
			this._point2 = new Point(point2.x, point2.y);
		}
		else
		{
			this._point1 = new Point(point2.x, point2.y);
			this._point2 = new Point(point1.x, point1.y);
		}

		this.size = new Size(0, 0);

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		let points: Array<Point> = [];

		let distance1: number = Point.distance(this.point, this._point1);
		let distance2: number = Point.distance(this.point, this._point2);

		let angle1: number = Point.angle(this.point, this._point1);
		let angle2: number = Point.angle(this.point, this._point2);

		let point1: Point = new Point(0, 0);
		let point2: Point = new Point(0, 0);

		point1.translate(angle1, distance1);
		point2.translate(angle2, distance2);

		points[0] = point1;
		points[1] = point2;

		this.clearPath();
		this.path.moveTo(points[0].x, points[0].y);
		this.path.lineTo(points[1].x, points[1].y);

		this.points = points;
		this.boundaries = { topleft: new Point(points[0].x, points[0].y), bottomright: new Point(points[1].x, points[1].y) };

		this.size = new Size(points[1].x - points[0].x, points[1].y - points[0].y);
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.translate(this.point.x + this.offset.x, this.point.y + this.offset.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this.scale.x, this.scale.y);

		context2D.lineWidth = this.linewidth;
		context2D.strokeStyle = this.strokecolor;
		context2D.globalAlpha = this.alpha;

		if(this.shadow != 0)
		{
			context2D.shadowBlur = this.shadow;
			context2D.shadowColor = this.shadowcolor;
		}

		if(!this.nostroke)
			context2D.stroke(this.path);

		context2D.restore();
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get point1(): Point
	{
		return this._point1;
	}
	public set point1(point1: Point)
	{
		this._point1 = point1;
	}

	public get point2(): Point
	{
		return this._point2;
	}
	public set point2(point2: Point)
	{
		this._point2 = point2;
	}
}
