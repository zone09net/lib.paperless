import * as Paperless from '../../lib.paperless.js';



export class Smiley extends Paperless.Drawable
{
	private _radius: number;
	private _mouth: Path2D;
	private _eyes: Path2D;
	//---

	public constructor(point: Paperless.Point, radius: number)
	{
		super(point);

		this.size = new Paperless.Size(radius * 2, radius * 2);

		this._radius = radius
		this._mouth = new Path2D();
		this._eyes = new Path2D();

		this.generate();
	}

	public generate(): void
	{
		this.clearPath();
		this._mouth = new Path2D();;
		this._eyes = new Path2D();

		this.path.arc(0, 0, this._radius, 0, Math.PI * 4, false); 
		this._mouth.arc(0, this._radius / 10, this._radius / 1.5, 0, Math.PI, false); 
		
		this._eyes.moveTo(-20, -5);
		this._eyes.arc(-(this._radius / 3), -(this._radius / 2.5), this._radius / 5, 0, Math.PI * 4, false); 
		this._eyes.moveTo(this._radius / 3, -(this._radius / 2.5));
		this._eyes.arc(this._radius / 3, -(this._radius / 2.5), this._radius / 5, 0, Math.PI * 4, false); 

		this.boundaries = { topleft: new Paperless.Point(this.point.x - this._radius, this.point.y - this._radius), bottomright: new Paperless.Point(this.point.x + this.radius, this.point.y + this._radius) }
	}

	public draw(context2D: CanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.translate(this.point.x, this.point.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this.scale.x, this.scale.y);

		context2D.lineWidth = this.linewidth;
		context2D.globalAlpha = this.alpha;

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

