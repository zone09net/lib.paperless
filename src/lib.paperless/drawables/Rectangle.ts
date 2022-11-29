import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableAttributes} from '../IDrawable.js';



export class Rectangle extends Drawable
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
		/*
		function defineRoundedRect(x,y,width,height,radius) {
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
		}
		*/
		
		let point: Point = new Point(-this.size.width / 2, -this.size.height / 2);
		let points: Array<Point> = [
			new Point(point.x, point.y),
			new Point(point.x + this.size.width, point.y),
			new Point(point.x + this.size.width, point.y + this.size.height),
			new Point(point.x, point.y + this.size.height),
		];

		this.clearPath();
		this.path.rect(points[0].x, points[0].y, this.size.width, this.size.height);

		this.points = points;
		this.boundaries = { topleft: new Point(this.point.x - (this.size.width / 2), this.point.y - (this.size.height / 2)), bottomright: new Point(this.point.x + (this.size.width / 2), this.point.y + (this.size.height / 2)) }
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
