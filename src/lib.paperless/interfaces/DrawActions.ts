import {Context} from '../Context.js';



export class DrawActions
{
	private _context: Context = null;
	private _guid: string = '';
	//---

	public onDrawBefore(context2D: CanvasRenderingContext2D): void {}
	public onDrawAfter(context2D: CanvasRenderingContext2D): void {}
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
}
