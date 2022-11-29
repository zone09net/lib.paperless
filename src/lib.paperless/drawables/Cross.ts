import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableAttributes} from '../IDrawable.js';



export class Cross extends Drawable
{
	public constructor(point: Point, size: Size, attributes: IDrawableAttributes = {})
	{
		super(point, attributes);

		const {
			generate = true,
		} = attributes;

		this.size = size || new Size(10, 10);

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		let points: Array<Point> = [
			new Point(0, -this.size.height / 2),
			new Point(0, this.size.height / 2),
			new Point(-this.size.width / 2, 0),
			new Point(this.size.width / 2, 0)
		];

		this.clearPath();
		this.path.moveTo(points[0].x, points[0].y);
		this.path.lineTo(points[1].x, points[1].y);
		this.path.moveTo(points[2].x, points[2].y);
		this.path.lineTo(points[3].x, points[3].y);

		this.points = points;
		this.boundaries = { topleft: new Point(this.point.x - (this.size.width / 2), this.point.y - (this.size.height / 2)), bottomright: new Point(this.point.x + (this.size.width / 2), this.point.y + (this.size.height / 2)) }
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

		context2D.lineWidth = this.linewidth;
		context2D.strokeStyle = this.strokecolor;
		context2D.globalAlpha = this.alpha;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;

		if(!this.nostroke)
			context2D.stroke(this.path);

		context2D.restore();
	}
}
