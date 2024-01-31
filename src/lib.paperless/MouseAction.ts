import {Context} from './Context.js';
import {Fx} from './Fx.js';



export class MouseAction
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	//---
	
	public onMouseMove(context: Context): void {}
	public onMouseDown(context: Context): void {}
	public onMouseUp(context: Context): void {}
	public onAttach(self?: MouseAction): void {}
	public onDetach(self?: MouseAction): void {}
	


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
