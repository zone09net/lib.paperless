import {Context} from '../Context.js';
import {Control} from '../Control.js';
import {Drawable} from '../Drawable.js';
import {IControlButtonAttributes} from '../interfaces/IControl.js';



/**
 * When you need to execute some functions on a click event, it is where the Button class comes in play. As a [[Control]] can only be
 * moved when your click on it, the Button can have a callback function for both the left ans right click.
 *
 */
export class Button extends Control
{
	private _callbackLeftClick: (smuggler: any) => void;
	private _callbackRightClick: (smuggler: any) => void;
	private _smugglerLeftClick: any;
	private _smugglerRightClick: any;
	//---

	/**
	 * Contructs a Button.
	 */
	public constructor(attributes: IControlButtonAttributes = {})
	{
		super({
			...attributes, 
			...{
				context: null,
				layer: null,
				drawable: null
			}
		});

		const {
			callbackLeftClick = () => {},
			callbackRightClick = () => {},
			smugglerLeftClick = null,
			smugglerRightClick = null,
		} = attributes;

		this._callbackLeftClick = callbackLeftClick;
		this._callbackRightClick = callbackRightClick;
		this._smugglerLeftClick = smugglerLeftClick;
		this._smugglerRightClick = smugglerRightClick;

		attributes.context ? attributes.context.attach(this, attributes.layer) : null;
		attributes.drawable ? this.attach(attributes.drawable) : null;
	}

	/**
	 * Callback method when the Button is clicked with the left mouse event. To work, the Button need a 
	 * [[Drawable]] attached to it and the [[callbackLeftClick]] accessor need to be set.
	 *
	 * @param self				The Button itself, automatically set by the Context.
	 */
	public onLeftClick(self?: Button): boolean
	{
		if(this.drawable.hover && typeof this._callbackLeftClick === 'function')
		{
			this._callbackLeftClick(this._smugglerLeftClick);
			return true;
		}

		return false;
	}

	/**
	 * Callback method when the Button is clicked with the right mouse event. To work, the Button need a 
	 * [[Drawable]] attached to it and the [[callbackRightClick]] accessor need to be set.
	 *
	 * @param self				The Button itself, automatically set by the Context.
	 */
	public onRightClick(self?: Button): boolean
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

