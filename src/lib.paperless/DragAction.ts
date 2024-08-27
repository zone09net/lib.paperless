import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IDragActionAttributes} from './interfaces/IDragAction.js';



/**
 * The DrawAction class gives the chance to inject some code before or after the draw phase of the [[Context]]. By
 * attaching the object to the Context, the event will automatically be polled to run the code.
 *
 * The code below will render 10000 random letters, counting the time needed to draw them. The result will be
 * displayed in the console. Each time the mouse is clicked, it trigger a draw phase from the context.
 *
 * ```typescript
 * const alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 * const colors: string[] = ['#815556', '#436665', '#9a6c27', '#769050', '#c8af55'];
 * const context: Paperless.Context = new Paperless.Context({autosize: true,});
 * 
 *
 * class TimeElapsed extends Paperless.DrawAction 
 * {
 * 	private t1: number;
 * 	private t2: number; 
 * 
 * 	public onDrawBefore(context2D: OffscreenCanvasRenderingContext2D): void
 * 	{
 * 		this.t1 = new Date().getTime();
 * 	}
 * 
 * 	public onDrawAfter(context2D: OffscreenCanvasRenderingContext2D): void
 * 	{
 * 		this.t2 = new Date().getTime();
 * 		console.log(this.t2 - this.t1, 'ms');
 * 	}
 * }
 * 
 * for(let i: number = 0; i < 10000; i++)
 * {
 * 	const radius: number = Math.floor(Math.random() * 30 + 20);
 * 	const x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
 * 	const y: number = (Math.random() * (window.innerHeight - (radius * 2) )) + radius;
 * 
 * 	new Paperless.Drawables.Label({
 * 		context: context,
 * 		point: {x: x, y: y},
 * 		autosize: true, 
 * 		content: alphabet[Math.floor(Math.random() * alphabet.length)], 
 * 		font: '14px bold system-ui', 
 * 		fillcolor: colors[Math.floor(Math.random() * 5)], 
 * 	});
 * }
 * 
 * new TimeElapsed({
 * 	context: context
 * });
 * 
 * context.attach(document.body);
 * ```
 */
export class DragAction
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	private _removable: boolean
	//---

	/**
	 * Contructs a DragAction.
	 */
	public constructor(attributes: IDragActionAttributes = {}) 
	{
		const {
			context = null,
			layer = null,
			removable = true,
			
			onAttach = null,
			onDetach = null,
			onDragBegin = null,
			onDrag = null,
			onDragEnd = null,
		} = attributes;

		this._removable = removable;
		
		context ? context.attach(this, layer) : null;	

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onDragBegin ? this.onDragBegin = onDragBegin : null;
		onDrag ? this.onDrag = onDrag : null;
		onDragEnd ? this.onDragEnd = onDragEnd : null;
	}

	/**
	 * Callback method when the DragAction is attached to a [[Context]].
	 *
	 * @param self				The DragAction itself, automatically set by the Context.
	 */
	public onAttach(self?: DragAction): void {}

	/**
	 * Callback method when the DragAction is detached from a [[Context]]. 
	 *
	 * @param self				The DragAction itself, automatically set by the Context.
	 */	
	public onDetach(self?: DragAction): void {}
	
	/**
	 * Callback method when entering the global drag phase.
	 *
	 * @param self				The DragAction itself, automatically set by the Context.
	 */	
	 onDragBegin?: (self?: DragAction) => void;

	 /**
	  * Callback method when in the global drag phase.
	  *
	  * @param self				The Control itself, automatically set by the Context.
	  */
	 onDrag?: (self?: DragAction) => void;
 
	 /**
	  * Callback method when the global drag phase as stopped.
	  *
	  * @param self				The DragAction itself, automatically set by the Context.
	  */
	 onDragEnd?: (self?: DragAction) => void;


	
	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the the current [[Context]] that the DragAction is attached to. This will be undefined if the DragAction has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/** 
	 * Sets the current [[Context]] to the DragAction. This is called internaly when the DragAction is attached to a Context.
	 * 
	 * @internal 
	 */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the the [[Fx]] instance from the current [[Context]] that the DragAction is attached to. This will be undefined if the DragAction has not been attached yet.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}
	/** 
	 * Sets the [[Fx]] instance of the current [[Context]] to the DragAction. This is called internaly when the DragAction gets attached to a Context. 
	 * 
	 * @internal 
	 */
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	/**
	 * Gets the unique GUID identifier of the DragAction. This will be undefined if the DragAction has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/** 
	 * Sets the unique GUID of the DragAction. This is called internaly when the DragAction is attached to a [[Context]]. 
	 * 
	 * @internal 
	 */
	public set guid(guid: string)
	{
		this._guid = guid;
	}

	/**
	 * Gets the removable status of the DragAction.
	 */
	public get removable(): boolean
	{
		return this._removable;
	}
	/**
	 * Sets the removable status of the DragAction. When set to false, the DragAction cannot be removed with the [[Context.detach]] method.
	 */
	public set removable(removable: boolean)
	{
		this._removable = removable;
	}
}

