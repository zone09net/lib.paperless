import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableCircleAttributes} from '../IDrawable.js';



export class Circle extends Drawable
{
	private _outerRadius: number;
	private _innerRadius: number;
	private _angleStart: number;
	private _angleEnd: number;
	//---

	public constructor(point: Point, outerRadius: number, innerRadius: number = 0, attributes: IDrawableCircleAttributes = {})
	{
		super(point, attributes);

		const {
			angleStart = 0,
			angleEnd = 360,
			generate = true,
		} = attributes;

		this._outerRadius = outerRadius;
		this._innerRadius = innerRadius;
		this._angleStart = angleStart;
		this._angleEnd = angleEnd;
		this.size = new Size(outerRadius * 2, outerRadius * 2);

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		let point1: Point = new Point(0, 0);
		let point2: Point = new Point(0, 0);
		
		point1.translate(this._angleEnd, this._outerRadius);
		point2.translate(this._angleStart, this._innerRadius)

		this.clearPath();

		if(this._angleStart != 0 || this._angleEnd != 360 || this._innerRadius != 0)
		{
			this.path.arc(0, 0, this._innerRadius, (this._angleStart / 180) * Math.PI, (this._angleEnd / 180) * Math.PI, false);
			this.path.lineTo(point1.x, point1.y);
		}
		
		this.path.arc(0, 0, this._outerRadius, (this._angleEnd / 180) * Math.PI, (this._angleStart / 180) * Math.PI, true);
		
		if(this._angleStart != 0 || this._angleEnd != 360 || this._innerRadius != 0)
			this.path.lineTo(point2.x, point2.y);

		this.boundaries = { topleft: new Point(this.point.x - this._outerRadius, this.point.y - this._outerRadius), bottomright: new Point(this.point.x + this._outerRadius, this.point.y + this._outerRadius) }
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
	
	public get outerRadius(): number
	{
		return this._outerRadius;
	}
	public set outerRadius(outerRadius: number)
	{
		this._outerRadius = outerRadius;
	}

	public get innerRadius(): number
	{
		return this._innerRadius;
	}
	public set innerRadius(innerRadius: number)
	{
		this._innerRadius = innerRadius;
	}

	public get angleStart(): number
	{
		return this._angleStart;
	}
	public set angleStart(angleStart: number)
	{
		this._angleStart = angleStart;
	}

	public get angleEnd(): number
	{
		return this._angleEnd;
	}
	public set angleEnd(angleEnd: number)
	{
		this._angleEnd = angleEnd;
	}
}
