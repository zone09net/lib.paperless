import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IMouseActionAttributes} from './interfaces/IMouseAction.js';



/**
 * The class MouseAction gives the chance to add your own code on the mouse events when occuring in the [[Context]]. Once attached,
 * the object will be polled automatically.
 *
 * Here's an example with a mouse sqare trails. You can increase the count of squares by modifying the value in the if clause.
 *
 * ```typescript
 * const colors: string[] = ['#815556', '#436665', '#9a6c27', '#769050', '#c8af55'];
 * const context: Paperless.Context = new Paperless.Context({autosize: true,});
 * 
 * class MouseTrail extends Paperless.MouseAction 
 * {
 * 	private _count: number = 0;
 * 
 * 	public onMouseMove(): void
 * 	{
 * 		new Paperless.Drawables.Rectangle({
 * 			context: this.context,
 * 			point: {
 * 				x: this.context.states.pointer.current.x, 
 * 				y: this.context.states.pointer.current.y
 * 			},
 * 			size: {width: 10, height: 10},
 * 			fillcolor: colors[Math.floor(Math.random() * 5)], 
 * 			nostroke: true
 * 		});
 * 
 * 		this._count++;
 * 
 * 		if(this._count >= 50)
 * 		{
 * 			this.context.detach(this.context.getDrawables().map.entries().next().value[0]);
 * 			this._count--;
 * 		}
 * 
 * 		// need to manually refresh the context as we don't have any controls to trigger events
 * 		this.context.refresh();
 * 	}
 * }
 * 
 * new MouseTrail({
 * 	context: context
 * });
 * 
 * context.attach(document.body);
 * ```
 */
export class MouseAction
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	private _removable: boolean
	//---
	
	/**
	 * Contructs a MouseAction.
	 */
	public constructor(attributes: IMouseActionAttributes = {})
	{
		const {
			context = null,
			layer = null,
			removable = true,

			onAttach = null,
			onDetach = null,
			onMouseMove = null,
			onMouseDown = null,
			onMouseUp = null,
		} = attributes;

		this._removable = removable;
		
		context ? context.attach(this, layer) : null;	

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onMouseMove ? this.onMouseMove = onMouseMove : null;
		onMouseDown ? this.onMouseDown = onMouseDown : null;
		onMouseUp ? this.onMouseUp = onMouseUp : null;
	}
	
	/**
	 * Callback method when the MouseAction is attached to a [[Context]].
	 *
	* @param self				The MouseAction itself, automatically set by the Context.
	 */
	public onAttach(self?: MouseAction): void {}

	/**
	 * Callback method when the MouseAction is detached from a [[Context]]. 
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */	
	public onDetach(self?: MouseAction): void {}

	/**
	 * Callback method when the mouse move event is set on the [[Context]]. On every event, the last and current variables of 
	 * [[IStates.pointer]] are updated, see [[Context.states]].
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */	
	public onMouseMove(self?: MouseAction): void {}

	/**
	 * Callback method when the mouse click event is set on the [[Context]]. On the event, the clicked variable of 
	 * [[IStates.pointer]] and [[IStates.mousedown]] are updated, see [[Context.states]].
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */	
	public onMouseDown(self?: MouseAction): void {}

	/**
	 * Callback method when the mouse release event is set on the [[Context]]. On the event, the control variable of 
	 * [[IStates.pointer]] and [[IStates.mousedown]] are updated, see [[Context.states]].
	 *
	 * @param self				The MouseAction itself, automatically set by the Context.
	 */
	public onMouseUp(self?: MouseAction): void {}



	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the the current [[Context]] that the MouseAction is attached to. This will be undefined if the MouseAction has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/** 
	 * Sets the current [[Context]] to the MouseAction. This is called internaly when the MouseAction is attached to a Context.
	 * 
	 * @internal 
	 */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the the [[Fx]] instance from the current [[Context]] that the MouseAction is attached to. This will be undefined if the MouseAction has not been attached yet.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}
	/** 
	 * Sets the [[Fx]] instance of the current [[Context]] to the MouseAction. This is called internaly when the MouseAction gets attached to a Context. 
	 * 
	 * @internal 
	 */
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	/**
	 * Gets the unique GUID identifier of the MouseAction. This will be undefined if the MouseAction has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/** 
	 * Sets the unique GUID of the MouseAction. This is called internaly when the MouseAction is attached to a [[Context]]. 
	 * 
	 * @internal 
	 */
	public set guid(guid: string)
	{
		this._guid = guid;
	}

	/**
	 * Gets the removable status of the MouseAction.
	 */
	public get removable(): boolean
	{
		return this._removable;
	}
	/**
	 * Sets the removable status of the MouseAction. When set to false, the MouseAction cannot be removed with the [[Context.detach]] method.
	 */
	public set removable(removable: boolean)
	{
		this._removable = removable;
	}
}
