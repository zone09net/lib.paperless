import * as Foundation from '@zone09.net/foundation';
import {Point} from './Point.js';
import {Size} from './Size.js';
import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {Group} from './Group.js';
import {Matrix} from './Matrix.js';
import {Layer} from './Layer.js';
import {IDrawableAttributes} from './interfaces/IDrawable.js';
import {Control} from './Control.js';
import {Restrict} from './enums/Restrict.js';
import * as Drawables from './drawables/Drawables.js';



/**
 * Drawable is the base class for every object drawed on the Papeless [[Context]]. Drawable are static
 */
export class Drawable extends Matrix
{
	/** @ignore */
	//[key: string]: any

	private _context: Context = undefined;
	private _fx: Fx = undefined;
	private _guid: string = undefined;
	private _group: string = undefined;
	private _nofill: boolean;
	private _nostroke: boolean;
	private _shadow: number;
	private _shadowcolor: string;
	private _fillcolor: string;
	private _strokecolor: string;
	private _linewidth: number;
	private _alpha: number;
	private _angle: number;
	private _visible: boolean;
	private _sticky: boolean;
	private _removable: boolean;
	private _hoverable: boolean;
	private _offset1: { x?: number; y?: number };
	private _offset2: { x?: number; y?: number };
	private _size: { width?: number; height?: number };

	private _hover: boolean = false;
	private _points: Point[] = [];
	private _path: Path2D;
	private _boundaries: { topleft: Point; bottomright: Point };
	//---

	public constructor(attributes: IDrawableAttributes = {})
	{
		super();

		const {
			nofill = false,
			nostroke = false,
			shadow = 0,
			shadowcolor = '#ffffff',
			fillcolor = '#a0a0a0',
			strokecolor = '#a0a0a0',
			linewidth = 1,
			alpha = 1,
			angle = 0,
			visible = true,
			sticky = false,
			removable = true,
			hoverable = true,
			point = {x: window.innerWidth / 2, y: window.innerHeight / 2},
			points = [],
			scale = {x: 1, y: 1},
			offset1 = {x: 0, y: 0},
			offset2 = {x: 0, y: 0},
			size = {width: 50, height: 50},
			matrix = null,
			context = null,
			layer = null,
			path = new Path2D(),

			onAttach = null,
			onDetach = null,
			onResize = null,
		} = attributes;

		this._nofill = nofill;
		this._nostroke = nostroke;
		this._shadow = shadow;
		this._shadowcolor = shadowcolor;
		this._fillcolor = fillcolor;
		this._strokecolor = strokecolor;
		this._linewidth = linewidth;
		this._alpha = alpha;
		this._angle = angle;
		this._visible = visible;
		this._sticky = sticky;
		this._removable = removable;
		this._hoverable = hoverable;
		this._offset1 = offset1;
		this._offset2 = offset2;
		this._size = size;
		this._path = path;
		this._points = points;

		context ? context.attach(this, layer) : null;

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onResize ? this.onResize = onResize : null;

		if(matrix)
			this.matrix = matrix;
		else
		{
			const rad: number = (Math.PI / 180) * angle;
			const sin: number = Math.sin(rad);
			const cos: number = Math.cos(rad);

			this.matrix = new DOMMatrix([cos * scale.x, sin * scale.x, -sin * scale.y, cos * scale.y, point.x,	point.y]);
		}
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void {}

	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(
			this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, 
			this.matrix.e + this.offset1.x + this.offset2.x,	
			this.matrix.f + this.offset1.y + this.offset2.y
		);

		context2D.globalAlpha = this.alpha;
		context2D.imageSmoothingEnabled = false;

		context2D.strokeStyle = this.strokecolor;
		context2D.lineWidth = this.linewidth;

		if(!this._nostroke)
			context2D.stroke(this.path);

		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;
		context2D.fillStyle = this.fillcolor;

		if(!this._nofill)
			context2D.fill(this.path);

		context2D.restore();
	}

	public isHover(point: Point): boolean
	{
		if(!this.context)
			return false;

		const context2D = this.context.context2D;
		const x: number = point.x / this.context.scale / window.devicePixelRatio;
		const y: number = point.y / this.context.scale / window.devicePixelRatio;
		let hover: boolean;

		context2D.save();
		context2D.setTransform(
			this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, 
			this.matrix.e + this.offset1.x + this.offset2.x, 
			this.matrix.f + this.offset1.y + this.offset2.y
		);

		if(!this.context.features.nolinehover)
		{
			context2D.lineWidth = this.linewidth;
			hover = context2D.isPointInPath(this.path, x, y) || context2D.isPointInStroke(this.path, x, y);
		}
		else
			hover = context2D.isPointInPath(this.path, x, y);

		context2D.restore();

		return hover;
	}

	public toFront(restrict: Restrict.none | Restrict.norefresh = Restrict.none): void
	{
		const layer: number = Layer.decode(this.guid);
		const drawables: any = this.context.getDrawables(layer);
		const controls: any = this.context.getControls(layer);
		const group: Group = this.context.get(this.group);
		let grouped: Drawable[] = [];
		
		if(group)
			grouped = [...group.grouped, ...group.enrolled].filter((drawable: Drawable) => drawable.guid != this.guid);

		[...grouped, ...[this]].forEach((drawable: Drawable) => {
			const drawableMap: any = drawables.map.get(drawable.guid);

			if(drawableMap)
			{
				const drawableIndex: number = drawableMap.index;
				const controlIndex: any = controls.filter((control: Control, index: number) => index == drawableIndex);
				const newIndex: number = drawables.index();

				drawables.index(drawable.guid, newIndex);

				if(controlIndex.length == 1)
					this.context.link(drawable, controlIndex[0]);
			}
		});

		if(restrict == Restrict.none)
		{
			drawables.sort();
			controls.reverse();
			this.context.states.sorted = true;
		}
	}

	public near(radius: number): Drawable[]
	{
		return this.context.getDrawables().filter((drawable: Drawable) =>
			drawable.x >= this.x - radius &&
			drawable.y >= this.y - radius &&
			drawable.x <= this.x + radius &&
			drawable.y <= this.y + radius &&
			drawable.visible != false 
			//drawable.guid != this.guid
		);
	}

	/*
	public static chain(map: Foundation.ExtendedMap, point: Point, radius: number, list: Array<string>)
	{
		let near: any = [...map.filter((drawable: Drawable) =>
			drawable.x >= point.x - radius &&
			drawable.y >= point.y - radius &&
			drawable.x <= point.x + radius &&
			drawable.y <= point.y + radius &&
			drawable.visible != false &&
			!list.includes(drawable.guid))
		];

		for(let drawable of near)
			list.push(drawable.guid);

		for(let drawable of near)
			this.near(map, new Point(drawable.x, drawable.y), radius, list);
	}
	*/

	public static isCircleInsideCircle(small: Drawables.Circle | Drawables.Smiley, big: Drawables.Circle | Drawables.Smiley): boolean
	{
		const distance: number = Point.distance(big.point, small.point);

		return big.outerRadius > (distance + small.outerRadius);
	}
	
	 
	public onAttach(self?: Drawable): void {}
	public onDetach(self?: Drawable): void {}
	public onResize(self?: Drawable): void {}



	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the the current [[Context]] that this Drawable is attached to. This will be undefined if this Drawable has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/**
	 * Sets the current [[Context]] to this Drawable. This is called internaly when this Drawable is attached to a Context.
	 *
	 * @internal
	 */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the the [[Fx]] instance from the current [[Context]] that this Drawable is attached to. This will be undefined if this Drawable has not been attached yet.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}
	/**
	 * Sets the [[Fx]] instance of the current [[Context]] to this Drawable. This is called internaly when this Drawable gets attached to a Context.
	 *
	 * @internal
	 */
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	/**
	 * Gets the unique GUID identifier of this Drawable. This will be undefined if this Drawable has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/**
	 * Sets the unique GUID of this Drawable. This is called internaly when this Drawable is attached to a [[Context]].
	 *
	 * @internal
	 */
	public set guid(guid: string)
	{
		this._guid = guid;
	}

	public get group(): string
	{
		return this._group;
	}
	public set group(group: string)
	{
		this._group = group;
	}

	public get point(): Point {
		return new Point(this.x, this.y);
	}

	public get points(): Point[] {
		return this._points;
	}
	public set points(points: Point[])
	{
		this._points = points;
	}

	public get offset1(): { x?: number; y?: number }
	{
		return this._offset1;
	}
	public set offset1(offset1: { x?: number; y?: number })
	{
		this._offset1 = offset1;
	}

	public get offset2(): { x?: number; y?: number }
	{
		return this._offset2;
	}
	public set offset2(offset2: { x?: number; y?: number })
	{
		this._offset2 = offset2;
	}

	public get width(): number
	{
		return this._size.width;
	}
	public set width(width: number
						 ) {
		this._size.width = width;
	}

	public get height(): number
	{
		return this._size.height;
	}
	public set height(height: number)
	{
		this._size.height = height;
	}

	public get size(): Size
	{
		return new Size(this._size.width, this._size.height);
	}

	public get boundaries(): { topleft: Point; bottomright: Point }
	{
		return this._boundaries;
	}
	public set boundaries(boundaries: { topleft: Point; bottomright: Point })
	{
		this._boundaries = boundaries;
	}

	public get path(): Path2D
	{
		return this._path;
	}
	public set path(path: Path2D)
	{
		this._path = path;
	}

	// attributes

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

	public get attributes(): IDrawableAttributes
	{
		return {
			nofill: this.nofill,
			nostroke: this.nostroke,
			shadow: this.shadow,
			shadowcolor: this.shadowcolor,
			fillcolor: this.fillcolor,
			strokecolor: this.strokecolor,
			linewidth: this.linewidth,
			alpha: this.alpha,
			scale: this.scale,
			angle: this.angle,
			visible: this.visible,
			sticky: this.sticky,
			removable: this.removable,
			hoverable: this.hoverable,
			offset1: this.offset1,
			offset2: this.offset2,
			size: { width: this.width, height: this.height },
		};
	}
}
