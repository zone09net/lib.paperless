import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IMouseActionAttributes} from './interfaces/IMouseAction.js';



export class MouseAction
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	//---
	
	public constructor(attributes: IMouseActionAttributes = {})
	{
		const {
			context = null,
			layer = null,

			onAttach = null,
			onDetach = null,
			onMouseMove = null,
			onMouseDown = null,
			onMouseUp = null,
		} = attributes;

		context ? context.attach(this, layer) : null;	

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onMouseMove ? this.onMouseMove = onMouseMove : null;
		onMouseDown ? this.onMouseDown = onMouseDown : null;
		onMouseUp ? this.onMouseUp = onMouseUp : null;
	}
	
	public onAttach(self?: MouseAction): void {}
	public onDetach(self?: MouseAction): void {}
	public onMouseMove(context: Context, self?: MouseAction): void {}
	public onMouseDown(context: Context, self?: MouseAction): void {}
	public onMouseUp(context: Context, self?: MouseAction): void {}



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
