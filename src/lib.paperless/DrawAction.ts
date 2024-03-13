import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IDrawActionAttributes} from './interfaces/IDrawAction.js';



export class DrawAction
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	//---

	public constructor(attributes: IDrawActionAttributes = {}) 
	{
		const {
			context = null,
			layer = null,

			onAttach = null,
			onDetach = null,
			onDrawBefore = null,
			onDrawAfter = null,
		} = attributes;

		context ? context.attach(this, layer) : null;	

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onDrawBefore ? this.onDrawBefore = onDrawBefore : null;
		onDrawAfter ? this.onDrawAfter = onDrawAfter : null;
	}

	public onAttach(self?: DrawAction): void {}
	public onDetach(self?: DrawAction): void {}
	public onDrawBefore(context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction): void {}
	public onDrawAfter(context2D: OffscreenCanvasRenderingContext2D, self?: DrawAction): void {}


	
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

	public get guid(): string
	{
		return this._guid;
	}
	public set guid(guid: string)
	{
		this._guid = guid;
	}

	public get fx(): Fx
	{
		return this._fx;
	}
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}
}

