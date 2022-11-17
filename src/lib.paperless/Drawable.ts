import {Point} from './Point.js';
import {Size} from './Size.js';
import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {Group} from './Group.js';
import {IDrawableAttributes} from './IDrawable.js';



/**
 * Drawable is the base class for every object drawed on the Papeless [[Context]]. Drawable are static 
 */
export class Drawable
{
	/** @ignore */
	//[key: string]: any;
	
	private _shadow: number;
	private _shadowcolor: string;
	private _fillcolor: string;
	private _strokecolor: string;
	private _linewidth: number;
	private _alpha: number;
	private _visible: boolean;
	private _scale: {x: number, y: number};
	private _rotation: number;
	private _nofill: boolean;
	private _nostroke: boolean;
	private _size: Size = null;
	private _hover: boolean = false;
	private _point: Point;
	private _points: Array<Point> = [];
	private _path = new Path2D();
	private _context: Context = null;
	private _fx: Fx = null;
	private _guid: string = '';
	private _group: string = undefined;
	private _autodraw: boolean;
	private _boundaries: {topleft: Point, bottomright: Point};
	private _sticky: boolean;
	private _removable: boolean;
	private _hoverable: boolean;
	private _offset: {x?: number, y?: number};
	//---

	public constructor(point: Point, attributes: IDrawableAttributes = {})
	{
		this._point = point;

		const {
			nofill = false,
			nostroke = false,
			shadow = 0,
			shadowcolor = '#ffffff',
			fillcolor = '#a0a0a0',
			strokecolor = '#a0a0a0',
			linewidth = 1,
			alpha = 1,
			visible = true,
			scale = {x: 1, y: 1},
			rotation = 0,
			autodraw = true,
			sticky = false,
			removable = true,
			hoverable = false,
			offset = {x: 0, y: 0}
		} = attributes;

		this._nofill = nofill;
		this._nostroke = nostroke;
		this._shadow = shadow;
		this._shadowcolor = shadowcolor;
		this._fillcolor = fillcolor;
		this._strokecolor = strokecolor;
		this._linewidth = linewidth;
		this._alpha = alpha;
		this._visible = visible;
		this._scale = scale;
		this._rotation = rotation;
		this._autodraw = autodraw;
		this._sticky = sticky;
		this._removable = removable;
		this._hoverable = hoverable;
		this._offset = offset;
	}

	public generate(): void {}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void {}

	public isHover(point: Point): boolean
	{
		let result: boolean = false;
		let context2D = this.context.context2D;

		context2D.save();
		context2D.translate(this.point.x + this.offset.x, this.point.y + this.offset.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this._scale.x, this._scale.y);
		context2D.lineWidth = this.linewidth;

		if(context2D.isPointInPath(this.path, point.x, point.y) || context2D.isPointInStroke(this.path, point.x, point.y))
			result = true;
		else
			result = false;

		context2D.restore();

		return result;
	}

	public toFront(): void
	{
		let grouped: Array<Drawable> = [];

		if(!this.group)
			grouped.push(this);
		else
		{
			let group: Group = this.context.get(this.group);

			group.map.forEach((entry: any) => {
				grouped.push(entry[1].object);
			});
		}

		for(let drawable of grouped)
		{
			let drawables: any = this.context.getDrawables();
			let controls: any = this.context.getControls();
			let drawableIndex: number = drawables.map.get(drawable.guid).index;
			let controlIndex: any = controls.filter(([guid, map]: any) => map.index == drawableIndex);
			let newIndex: number = drawables.index();
	
			drawables.index(drawable.guid, newIndex);
	
			if(controlIndex.length == 1)
				this.context.link(drawable.guid, controlIndex[0][0]);
	
			drawables.sort();
			controls.reverse();
		}
	}

	public clearPath(): void
	{
		this._path = new Path2D();
	}

	public onAttach(): void {}
	public onDetach(): void {}
	public onResize(): void {}
	


	// Accessors
	// --------------------------------------------------------------------------
	
	public get context(): Context
	{
		return this._context;
	}
	public set context(context: Context)
	{
		this._context = context;
	}

	public get fx(): Fx
	{
		return this._fx;
	}
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	public get group(): string
	{
		return this._group;
	}
	public set group(group: string)
	{
		this._group = group;
	}

	public get size(): Size
	{
		return this._size;
	}
	public set size(size: Size)
	{
		this._size = size;
	}

	public get point(): Point
	{
		return this._point;
	}
	public set point(point: Point)
	{
		this._point = point;
	}

	public get points(): Array<Point>
	{
		return this._points;
	}
	public set points(points: Array<Point>)
	{
		this._points = points;
	}

	public get boundaries(): {topleft: Point, bottomright: Point}
	{
		return this._boundaries;
	}
	public set boundaries(boundaries: {topleft: Point, bottomright: Point})
	{
		this._boundaries = boundaries;
	}

	public get shadow(): number
	{
		return this._shadow;
	}
	public set shadow(shadow: number)
	{
		this._shadow = shadow;
	}
	public get shadowcolor(): string
	{
		return this._shadowcolor;
	}
	public set shadowcolor(shadowcolor: string)
	{
		this._shadowcolor = shadowcolor;
	}

	public get fillcolor(): string
	{
		return this._fillcolor;
	}
	public set fillcolor(fillcolor: string)
	{
		this._fillcolor = fillcolor;
	}

	public get strokecolor(): string
	{
		return this._strokecolor;
	}
	public set strokecolor(strokecolor: string)
	{
		this._strokecolor = strokecolor;
	}

	public get linewidth(): number
	{
		return this._linewidth;
	}
	public set linewidth(linewidth: number)
	{
		this._linewidth = linewidth;
	}

	public get rotation(): number
	{
		return this._rotation;
	}
	public set rotation(rotation: number)
	{
		this._rotation = rotation;
	}

	public get alpha(): number
	{
		return this._alpha;
	}
	public set alpha(alpha: number)
	{
		this._alpha = alpha;
	}

	public get visible(): boolean
	{
		return this._visible;
	}
	public set visible(visible: boolean)
	{
		this._visible = visible;
	}

	public get autodraw(): boolean
	{
		return this._autodraw;
	}
	public set autodraw(autodraw: boolean)
	{
		this._autodraw = autodraw;
	}

	public get scale(): {x: number, y: number}
	{
		return this._scale;
	}
	public set scale(scale: {x: number, y: number})
	{
		this._scale = scale;
	}

	public get nofill(): boolean
	{
		return this._nofill;
	}
	public set nofill(nofill: boolean)
	{
		this._nofill = nofill;
	}

	public get nostroke(): boolean
	{
		return this._nostroke;
	}
	public set nostroke(nostroke: boolean)
	{
		this._nostroke = nostroke;
	}

	public get path(): Path2D
	{
		return this._path;
	}
	public set path(path: Path2D)
	{
		this._path = path;
	}

	public get guid(): string
	{
		return this._guid;
	}
	public set guid(guid: string)
	{
		this._guid = guid;
	}

	public get hover(): boolean
	{
		return this._hover;
	}
	public set hover(hover: boolean)
	{
		this._hover = hover;
	}

	public get sticky(): boolean
	{
		return this._sticky;
	}
	public set sticky(sticky: boolean)
	{
		this._sticky = sticky;
	}

	public get removable(): boolean
	{
		return this._removable;
	}
	public set removable(removable: boolean)
	{
		this._removable = removable;
	}

	public get hoverable(): boolean
	{
		return this._hoverable;
	}
	public set hoverable(hoverable: boolean)
	{
		this._hoverable = hoverable;
	}

	public get offset(): {x?: number, y?: number}
	{
		return this._offset;
	}
	public set offset(offset: {x?: number, y?: number})
	{
		this._offset = offset;
	}
}
