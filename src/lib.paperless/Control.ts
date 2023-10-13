import {Drawable} from './Drawable.js';
import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IControlAttributes} from './interfaces/IControl.js';
import {Restrict} from './enums/Restrict.js';



/**
 * A Control is what give life to a [[Drawable]]. Since a Drawable is only static by itself on a [[Context]], the only way to give
 * it some events it to [[attach]] is to a Control.
 * 
 * The most basic Control is the [[Blank]] one. As the name says, a blank Control is only there to activate the basic events to
 * a Drawable such as the dragging ability. Take a loog on this 500 triangles example:
 * 
 * ```typescript
 * import * as Paperless from './lib.paperless.js';
 * 
 * let context: Paperless.Context = new Paperless.Context();
 * 
 * context.attach(document.body);
 * 
 * for(let i: number = 0; i < 500; i++)
 * {
 * 	let drawable: Paperless.Drawable;
 * 	let control: Paperless.Control;
 * 	let color: string = '#' + Math.floor(16777215 - (Math.random() * 15000000)).toString(16);
 * 	let radius: number = Math.floor(Math.random() * 30 + 20);
 * 	let x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
 * 	let y: number = (Math.random() * (window.innerHeight - (radius * 2) )) + radius;
 * 
 * 	drawable = context.attach(new Paperless.Drawables.Hexagon(new Paperless.Point(x, y), radius, {sides: 3}));
 * 	control = context.attach(new Paperless.Controls.Blank())
 * 
 * 	control.attach(drawable);
 * 	drawable.fillcolor = color;
 * 	drawable.rotation = 30;
 * }
 * ```
 * 
 * Lets make those triangles disappear by adding a [[onInside]] event on the Control just after the drawable.rotation line. Doing
 * this will detach the triangles when the mouse pointer will touch them.
 * 
 * ```typescript
 * control.onInside = () => {
 * 	context.detach([control.guid, drawable.guid]);
 * }
 * ```
 */
export class Control
{
	private _context: Context = undefined;
	private _fx: Fx = undefined;
	private _drawable: Drawable = undefined;
	private _guid: string = undefined;
	private _enabled: boolean;
	private _movable: boolean;
	private _removable: boolean;
	private _focusable: boolean;
	private _restrict: Restrict;
	private _group: string = undefined;
	//---

	public constructor(attributes: IControlAttributes = {}) 
	{
		const {
			enabled = true,
			movable = true,
			removable = true,
			focusable = true,
			restrict = Restrict.none,
			context = null,
			drawable = null,
			
			onLeftClick = null,
			onRightClick = null,
			onDragBegin = null,
			onDrag = null,
			onDragEnd = null,
			onInside = null,
			onOutside = null,
			onFocus = null,
			onLostFocus = null,
			onAttach = null,
			onDetach = null,
			onDrawable = null,
		} = attributes;

		this._enabled = enabled;
		this._movable = movable;
		this._removable = removable;
		this._focusable = focusable;
		this._restrict = restrict;

		context ? context.attach(this) : null;
		drawable ? this.attach(drawable) : null;

		onLeftClick ? this.onLeftClick = onLeftClick : null;
		onRightClick ? this.onRightClick = onRightClick : null;
		onDragBegin ? this.onDragBegin = onDragBegin : null;
		onDrag ? this.onDrag = onDrag : null;
		onDragEnd ? this.onDragEnd = onDragEnd : null;
		onInside ? this.onInside = onInside : null;
		onOutside ? this.onOutside = onOutside : null;
		onFocus ? this.onFocus = onFocus : null;
		onLostFocus ? this.onLostFocus = onLostFocus : null;
		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onDrawable ? this.onDrawable = onDrawable : null;
	}

	public attach(drawable: Drawable): void
	{
		this.drawable = this.context.get(drawable.guid);
		this.context.link(drawable, this);

		if(this.drawable)
			this.onDrawable();
	}

	public onLeftClick(): void {}
	public onRightClick(): void {}
	public onDragBegin(): void {}
	public onDrag(): void {}
	public onDragEnd(): void {}
	public onInside(): void {}
	public onOutside(): void {}
	public onFocus(): void {}
	public onLostFocus(): void {}
	public onAttach(): void {}
	public onDetach(): void {}
	public onDrawable(): void {}



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

	public get group(): string
	{
		return this._group;
	}
	public set group(group: string)
	{
		this._group = group;
	}
	
	public get fx(): Fx
	{
		return this._fx;
	}
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	public get drawable(): Drawable
	{
		return this._drawable;
	}
	public set drawable(drawable: Drawable)
	{
		this._drawable = drawable;
	}

	public get guid(): string
	{
		return this._guid;
	}
	public set guid(guid: string)
	{
		this._guid = guid;
	}

	public get enabled(): boolean
	{
		return this._enabled;
	}
	public set enabled(enabled: boolean)
	{
		this._enabled = enabled;
	}

	public get movable(): boolean
	{
		return this._movable;
	}
	public set movable(movable: boolean)
	{
		this._movable = movable;
	}

	public get removable(): boolean
	{
		return this._removable;
	}
	public set removable(removable: boolean)
	{
		this._removable = removable;
	}

	public get focusable(): boolean
	{
		return this._focusable;
	}
	public set focusable(focusable: boolean)
	{
		this._focusable = focusable;
	}

	public get restrict(): Restrict
	{
		return this._restrict;
	}
	public set restrict(restrict: Restrict)
	{
		this._restrict = restrict;
	}
}
