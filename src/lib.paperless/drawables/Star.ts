import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableAttributes} from '../interfaces/IDrawable.js';



export class Star extends Drawable
{
	private _spikes: number;
	private _innerRadius: number;
	private _outerRadius: number;
	//---

	public constructor(point: Point, spikes: number, outerRadius: number, innerRadius: number, attributes: IDrawableAttributes = {})
	{
		super(point, attributes);

		const {
			generate = true,
		} = attributes;

		this._spikes = spikes;
		this._innerRadius = innerRadius;
		this._outerRadius = outerRadius
		this.size = new Size(outerRadius * 2, outerRadius * 2);

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		let points: Array<Point> = [];
		let angle: number = Math.PI / 2 * 3;
		let step = Math.PI / this._spikes

		for(let i: number = 0; i < this._spikes; i++)
		{
			points.push(new Point(this._outerRadius * Math.cos(angle), this._outerRadius * Math.sin(angle)));
			angle += step;
	 
			points.push(new Point(this._innerRadius * Math.cos(angle), this._innerRadius * Math.sin(angle)));
			angle += step;
		 }

		this.clearPath();
		for(let i: number = 0; i < points.length; i++)
			this.path.lineTo(points[i].x, points[i].y);
		this.path.lineTo(points[0].x, points[0].y)
		this.path.closePath();

		this.points = points;
		this.boundaries = { topleft: new Point(this.x - this._outerRadius, this.y - this._outerRadius), bottomright: new Point(this.x + this._outerRadius, this.y + this._outerRadius) }
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



	// Accessors
	// --------------------------------------------------------------------------
	
	public get innerRadius(): number
	{
		return this._innerRadius;
	}
	public set innerRadius(innerRadius: number)
	{
		this._innerRadius = innerRadius;
	}

	public get outerRadius(): number
	{
		return this._outerRadius;
	}
	public set outerRadius(outerRadius: number)
	{
		this._outerRadius = outerRadius;
	}

	public get spikes(): number
	{
		return this._spikes;
	}
	public set spikes(spikes: number)
	{
		this._spikes = spikes;
	}
}

