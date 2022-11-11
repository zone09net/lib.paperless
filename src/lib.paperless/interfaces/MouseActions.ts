import {Context} from '../Context.js';



export class MouseActions
{
	private _context: Context = null;
	private _guid: string = '';
	//---
	
	public onMouseMove(): void {}
	public onMouseDown(): void {}
	public onMouseUp(): void {}
	public onAttach(): void {}
	public onDetach(): void {}
	


	// getter|setter
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
