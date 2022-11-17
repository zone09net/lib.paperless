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
		let points: Array<Point> = [];

		points[0] = new Point(0, -this.size.height / 2);
		points[1] = new Point(0, this.size.height / 2);
		points[2] = new Point(-this.size.width / 2, 0);
		points[3] = new Point(this.size.width / 2, 0);

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
		context2D.translate(this.point.x + this.offset.x, this.point.y + this.offset.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this.scale.x, this.scale.y);

		context2D.lineWidth = this.linewidth;
		context2D.strokeStyle = this.strokecolor;
		if(this.shadow != 0)
		{
			context2D.shadowBlur = this.shadow;
			context2D.shadowColor = this.shadowcolor;
		}

		if(!this.nostroke)
			context2D.stroke(this.path);

		context2D.restore();
	}
}
