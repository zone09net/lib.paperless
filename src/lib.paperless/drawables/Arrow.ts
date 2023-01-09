import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableAttributes} from '../interfaces/IDrawable.js';



export class Arrow extends Drawable
{
	public constructor(point: Point, size: Size, attributes: IDrawableAttributes = {})
	{
		super(point, attributes);

		const {
			generate = true,
		} = attributes;

		this.size = size;

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		let basewidth: number = 25;
		let baseheight: number = 20;
		let diff: number = (this.size.height - baseheight) / 2;

		let point: Point = new Point(-this.size.width / 2, -this.size.height / 2);
		let points: Array<Point> = [
			new Point(point.x + basewidth, point.y + diff),
			new Point(point.x, point.y + diff),
			new Point(point.x, point.y + this.size.height - diff),
			new Point(point.x + basewidth, point.y + this.size.height - diff),
			new Point(point.x + basewidth, point.y + this.size.height),
			new Point(point.x + this.size.width, point.y + (this.size.height / 2)),
			new Point(point.x + basewidth, point.y),
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
}
