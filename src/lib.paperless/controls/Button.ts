import {Control} from '../Control.js';
import {IControlAttributes} from '../interfaces/IControl.js';



export class Button extends Control
{
	private _callbackLeftClick: (smuggler: any) => void;
	private _callbackRightClick: (smuggler: any) => void;
	private _smugglerLeftClick: any;
	private _smugglerRightClick: any;
	//---

	public constructor(callbackLeftClick: (smuggler: any) => void = null, callbackRightClick: (smuggler: any) => void = null, smugglerLeftClick: any = null, smugglerRightClick: any = null, attributes: IControlAttributes = {})
	{
		super(attributes);

		this._callbackLeftClick = callbackLeftClick;
		this._callbackRightClick = callbackRightClick;
		this._smugglerLeftClick = smugglerLeftClick;
		this._smugglerRightClick = smugglerRightClick;
	}

	public onLeftClick(): boolean
	{
		if(this.drawable.hover && typeof this._callbackLeftClick === 'function')
		{
			this._callbackLeftClick(this._smugglerLeftClick);
			return true;
		}

		return false;
	}

	public onRightClick(): boolean
	{
		if(this.drawable.hover && typeof this._callbackRightClick === 'function')
		{
			this._callbackRightClick(this._smugglerRightClick);
			return true;
		}

		return false;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get callbackLeftClick(): (smuggler: any) => void
	{
		return this._callbackLeftClick;
	}
	public set callbackLeftClick(callbackLeftClick: (smuggler: any) => void)
	{
		this._callbackLeftClick = callbackLeftClick;
	}

	public get callbackRightClick(): (smuggler: any) => void
	{
		return this._callbackRightClick;
	}
	public set callbackRightClick(callbackRightClick: (smuggler: any) => void)
	{
		this._callbackRightClick = callbackRightClick;
	}

	public get smugglerLeftClick(): any
	{
		return this._smugglerLeftClick;
	}
	public set smugglerLeftClick(smugglerLeftClick: any)
	{
		this._smugglerLeftClick = smugglerLeftClick;
	}

	public get smugglerRightClick(): any
	{
		return this._smugglerRightClick;
	}
	public set smugglerRightClick(smugglerRightClick: any)
	{
		this._smugglerRightClick = smugglerRightClick;
	}
}
