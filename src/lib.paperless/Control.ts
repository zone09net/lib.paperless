import {Drawable} from './Drawable.js';
import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IControlAttributes} from './interfaces/IControl.js';
import {Restrict} from './enums/Restrict.js';



/**
 * A Control is what gives life to a [[Drawable]], it give the oportinity to have some events on specific action done by the user
 * and the [[Context]]. 
 * 
 * This example will generate 500 circles that will desapear when the mouse cursor touch them.
 *
 * ```typescript
 * import * as Paperless from './lib.paperless.js';
 * 
 * const colors: string[] = ['#815556', '#436665', '#9a6c27', '#769050', '#c8af55'];
 * const context: Paperless.Context = new Paperless.Context({
 * 	autosize: true, 
 * 	features: { 
 * 		nolinehover: true 
 * 	}
 * });
 * 
 * for(let i: number = 0; i < 500; i++)
 * {
 * 	const radius: number = Math.floor(Math.random() * 30 + 20);
 * 	const x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
 * 	const y: number = (Math.random() * (window.innerHeight - (radius * 2) )) + radius;
 * 
 * 	new Paperless.Control({
 * 		context: context,
 * 		drawable: new Paperless.Drawables.Circle({
 * 			context: context,
 * 			point: {x: x, y: y}, 
 * 			outerRadius: radius,
 * 			fillcolor: colors[Math.floor(Math.random() * 5)],
 * 			nostroke: true
 * 		}),
 * 		onInside: (self?: Paperless.Control) => {
 * 			context.detach([self.drawable.guid, self.guid]);
 * 		}
 * 	});
 * }
 * 
 * context.attach(document.body);
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

	/**
	 * Contructs a Control.
	 */
	public constructor(attributes: IControlAttributes = {}) 
	{
		const {
			enabled = true,
			movable = true,
			removable = true,
			focusable = true,
			restrict = Restrict.none,
			context = null,
			layer = null,
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

		context ? context.attach(this, layer) : null;
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

	/**
	 * Attaches a [[Drawable]] to the Control. By doing this, The Drawable will be interactive in the [[Context]].
	 * The Drawable and the Control need to be already attached to a Context for this to work.
	 *
	 * ```typescript
	 * // both of these codes will have the same effect
	 *
	 * const control: Paperless.Control = new Paperless.Control();
	 * const drawable: Paperless.Drawables.Rectangle = new Paperless.Drawables.Rectangle();
	 * context.attach(Rectangle);
	 * context.attach(control);
	 * control.attach(drawable);
	 *
	 * //---
	 *
	 * new Paperless.Control({
	 * 	context: context,
	 * 	drawable: new Paperless.Drawables.Rectangle({
	 * 		context: context
	 * 	}),
	 * });
	 * ```
	 * @param drawable				Drawable to be attached to the Control.
	 */
	public attach(drawable: Drawable): void
	{
		this.drawable = this.context.get(drawable.guid);
		this.context.link(drawable, this);

		if(this.drawable)
			this.onDrawable(this);
	}

	/**
	 * Callback method when the Control is clicked with the left mouse event.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onLeftClick(self?: Control): void {}

	/**
	 * Callback method when the Control is clicked with the right mouse event.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onRightClick(self?: Control): void {}

	/**
	 * Callback method when the Control is clicked and beeing dragged. Will be called just before moving the attached [[Drawable]].
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onDragBegin(self?: Control): void {}

	/**
	 * Callback method when the Control is beeing dragged. Will be called at every redraw phase.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onDrag(self?: Control): void {}

	/**
	 * Callback method when the dragging of the Control is stopped. Will be called just after moving the attached [[Drawable]].
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onDragEnd(self?: Control): void {}

	/**
	 * Callback method when the mouse cursor is touching the attached [[Drawable]] of the Control.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onInside(self?: Control): void {}

	/**
	 * Callback method when the mouse cursor is exiting the attached [[Drawable]] of the Control.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onOutside(self?: Control): void {}

	/**
	 * Callback method when the Control gain focus with the [[Context.setFocus]] method.
	 *
	 * @param self				The Control itself, automatically set by the Context.
	 */
	public onFocus(self?: Control): void {}


	/**
	 * Callback method when the Control lose focus either with the [[Context.removeFocus]] method or when another
	 * Control is beeing focussed.
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	public onLostFocus(self?: Control): void {}

	/**
	 * Callback method when the Control is attached to a [[Context]].
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	public onAttach(self?: Control): void {}

	/**
	 * Callback method when the Control is detached from a [[Context]]. 
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	public onDetach(self?: Control): void {}

	/**
	 * Callback method when a [[Drawable]] has just been attached on the Control. 
	 *
	 * @param self				The control itself, automatically set by the Context.
	 */
	public onDrawable(self?: Control): void {}



	// Accessors
	// --------------------------------------------------------------------------
	
	/**
	 * Gets the the current [[Context]] that the Control is attached to. This will be undefined if the Control has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/** 
	 * Sets the current [[Context]] to the Control. This is called internaly when the Control is attached to a Context.
	 * 
	 * @internal 
	 */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the the current [[Group]] GUID that the Control is attached to.
	 */
	public get group(): string
	{
		return this._group;
	}
	/** 
	 * Sets the current [[Group]] GUID of the Control. This is called internaly when the Control is attached to a Group. 
	 * 
	 * @internal 
	 */
	public set group(group: string)
	{
		this._group = group;
	}
	
	/**
	 * Gets the the [[Fx]] instance from the current [[Context]] that the Control is attached to. This will be undefined if the Control has not been attached yet.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}
	/** 
	 * Sets the [[Fx]] instance of the current [[Context]] to the Control. This is called internaly when the Control gets attached to a Context. 
	 * 
	 * @internal 
	 */
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	/**
	 * Gets the unique GUID identifier of the Control. This will be undefined if the Control has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/** 
	 * Sets the unique GUID of the Control. This is called internaly when the Control is attached to a [[Context]]. 
	 * 
	 * @internal 
	 */
	public set guid(guid: string)
	{
		this._guid = guid;
	}	

	/**
	 * Gets the current attached [[Drawable]] on the Control.
	 */
	public get drawable(): Drawable
	{
		return this._drawable;
	}

	/**
	 * Gets the enabled status of the Control.
	 */
	public get enabled(): boolean
	{
		return this._enabled;
	}
	/**
	 * Sets the enabled status of the Control. When set to false, the Control cannot be clicked or moved with the mouse events.
	 */
	public set enabled(enabled: boolean)
	{
		this._enabled = enabled;
	}

	/**
	 * Gets the movable status of the Control.
	 */
	public get movable(): boolean
	{
		return this._movable;
	}
	/**
	 * Sets the movable status of the Control. When set to false, the Control cannot be moved with the mouse events.
	 */
	public set movable(movable: boolean)
	{
		this._movable = movable;
	}

	/**
	 * Gets the removable status of the Control.
	 */
	public get removable(): boolean
	{
		return this._removable;
	}
	/**
	 * Sets the removable status of the Control. When set to false, the Control cannot be removed with the [[Context.detach]] method.
	 */
	public set removable(removable: boolean)
	{
		this._removable = removable;
	}

	/**
	 * Gets the focusable status of the Control.
	 */
	public get focusable(): boolean
	{
		return this._focusable;
	}
	/**
	 * Sets the focusable status of the Control. When set to false, the Control cannot be focussed with the [[Context.setFocus]] method.
	 */
	public set focusable(focusable: boolean)
	{
		this._focusable = focusable;
	}

	/**
	 * Gets the restrict status of the Control.
	 */
	public get restrict(): Restrict.none | Restrict.horizontal | Restrict.vertical
	{
		return this._restrict;
	}
	/**
	 * Sets the restrict status of the Control, meaning the movement restriction on this one.
	 */
	public set restrict(restrict: Restrict.none | Restrict.horizontal | Restrict.vertical)
	{
		this._restrict = restrict;
	}
}

