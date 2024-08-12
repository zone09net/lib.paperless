import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IDrawActionAttributes} from './interfaces/IDrawAction.js';



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
export class DrawAction
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	private _removable: boolean
	//---

	/**
	 * Contructs a DrawAction.
	 */
	public constructor(attributes: IDrawActionAttributes = {}) 
	{
		const {
			context = null,
			layer = null,
			removable = true,
			
			onAttach = null,
			onDetach = null,
			onDrawBefore = null,
			onDrawAfter = null,
		} = attributes;

		this._removable = removable;
		
		context ? context.attach(this, layer) : null;	

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onDrawBefore ? this.onDrawBefore = onDrawBefore : null;
		onDrawAfter ? this.onDrawAfter = onDrawAfter : null;
	}

	/**
	 * Callback method when the DrawAction is attached to a [[Context]].
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */
	public onAttach(self?: DrawAction): void {}

	/**
	 * Callback method when the DrawAction is detached from a [[Context]]. 
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */	
	public onDetach(self?: DrawAction): void {}
	
	/**
	 * Callback method in the draw phase of the [[Context]], just before every drawables are beeing rendered. 
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */
	public onDrawBefore(context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction): void {}

	/**
	 * Callback method in the draw phase of the [[Context]], just after every drawables are beeing rendered. 
	 *
	 * @param self				The DrawAction itself, automatically set by the Context.
	 */
	public onDrawAfter(context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction): void {}


	
	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the the current [[Context]] that the DrawAction is attached to. This will be undefined if the DrawAction has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/** 
	 * Sets the current [[Context]] to the DrawAction. This is called internaly when the DrawAction is attached to a Context.
	 * 
	 * @internal 
	 */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the the [[Fx]] instance from the current [[Context]] that the DrawAction is attached to. This will be undefined if the DrawAction has not been attached yet.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}
	/** 
	 * Sets the [[Fx]] instance of the current [[Context]] to the DrawAction. This is called internaly when the DrawAction gets attached to a Context. 
	 * 
	 * @internal 
	 */
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	/**
	 * Gets the unique GUID identifier of the DrawAction. This will be undefined if the DrawAction has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/** 
	 * Sets the unique GUID of the DrawAction. This is called internaly when the DrawAction is attached to a [[Context]]. 
	 * 
	 * @internal 
	 */
	public set guid(guid: string)
	{
		this._guid = guid;
	}

	/**
	 * Gets the removable status of the DrawAction.
	 */
	public get removable(): boolean
	{
		return this._removable;
	}
	/**
	 * Sets the removable status of the DrawAction. When set to false, the DrawAction cannot be removed with the [[Context.detach]] method.
	 */
	public set removable(removable: boolean)
	{
		this._removable = removable;
	}
}

