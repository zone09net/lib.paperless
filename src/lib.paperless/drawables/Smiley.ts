import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableAttributes} from '../interfaces/IDrawable.js';



export class Smiley extends Drawable
{
	private _radius: number;
	private _mouth: Path2D;
	private _eyes: Path2D;
	//---

	public constructor(point: Point, radius: number, attributes: IDrawableAttributes = {})
	{
		super(point, attributes);

		const {
			generate = true,
		} = attributes;

		this.size = new Size(radius * 2, radius * 2);

		this._radius = radius
		this._mouth = new Path2D();
		this._eyes = new Path2D();

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		this.clearPath();
		this._mouth = new Path2D();
		this._eyes = new Path2D();

		this.path.arc(0, 0, this._radius, 0, Math.PI * 4, false); 
		this._mouth.arc(0, this._radius / 10, this._radius / 1.5, 0, Math.PI, false); 
		
		this._eyes.moveTo(-20, -5);
		this._eyes.arc(-(this._radius / 3), -(this._radius / 2.5), this._radius / 5, 0, Math.PI * 4, false); 
		this._eyes.moveTo(this._radius / 3, -(this._radius / 2.5));
		this._eyes.arc(this._radius / 3, -(this._radius / 2.5), this._radius / 5, 0, Math.PI * 4, false); 

		this.boundaries = { topleft: new Point(this.x - this._radius, this.y - this._radius), bottomright: new Point(this.x + this.radius, this.y + this._radius) }
	}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e + this.offset.x, this.matrix.f + this.offset.y);

		context2D.lineWidth = this.linewidth;
		context2D.globalAlpha = this.alpha;
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;

		if(!this.nofill)
		{
			context2D.fillStyle = '#e2c046';
			context2D.fill(this.path);
			context2D.fillStyle = '#a42f32';
			context2D.fill(this._mouth);
			context2D.fillStyle = '#000000';
			context2D.fill(this._eyes);
		}
		if(!this.nostroke)
		{
			context2D.strokeStyle = '#000000';
			context2D.stroke(this.path);
		}

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
}

