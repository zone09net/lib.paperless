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

		let points: Array<Point> = [];
		let point: Point = new Point(-this.size.width / 2, -this.size.height / 2);

		points[0] = new Point(point.x, point.y);
		points[1] = new Point(point.x + this.size.width, point.y);
		points[2] = new Point(point.x + this.size.width, point.y + this.size.height);
		points[3] = new Point(point.x, point.y + this.size.height);

		this.clearPath();
		this.path.rect(points[0].x, points[0].y, this.size.width, this.size.height);
		/*
		this.path.moveTo(points[0].x, points[0].y);
		for(let i: number = 1; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y - 1);
		*/

		this.points = points;
		this.boundaries = { topleft: new Point(this.point.x - (this.size.width / 2), this.point.y - (this.size.height / 2)), bottomright: new Point(this.point.x + (this.size.width / 2), this.point.y + (this.size.height / 2)) }
	}

	public draw(context2D: CanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.translate(this.point.x + this.offset.x, this.point.y + this.offset.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this.scale.x, this.scale.y);

		context2D.lineWidth = this.linewidth;
		context2D.strokeStyle = this.strokecolor;
		context2D.fillStyle = this.fillcolor;
		context2D.globalAlpha = this.alpha;
		if(this.shadow != 0)
		{
			context2D.shadowBlur = this.shadow;
			context2D.shadowColor = this.shadowcolor;
		}

		if(!this.nostroke)
			context2D.stroke(this.path);
		if(!this.nofill)
			context2D.fill(this.path);

		context2D.restore();
	}
}
