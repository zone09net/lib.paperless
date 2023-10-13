import {Context} from './Context.js';
import {Fx} from './Fx.js';



export class DrawAction
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	//---

	public onDrawBefore(context2D: OffscreenCanvasRenderingContext2D): void {}
	public onDrawAfter(context2D: OffscreenCanvasRenderingContext2D): void {}
	public onAttach(): void {}
	public onDetach(): void {}



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
