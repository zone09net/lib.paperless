import {Point} from './Point.js';
import {Size} from './Size.js';
import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {IComponentAttributes} from './interfaces/IComponent.js';



/**
 * Unlike the [[Drawable]] and the [[Control]] that are use for the display and the interaction, the Component is a mix of a little of everything. It
 * is used to create complex elements like an editor, a screen popup or even a graphical chart to build a complete application.
 */
export class Component 
{
	private _point: Point;
	private _size: Size;
	private _guid: string = '';
	private _context: Context = null;
	private _fx: Fx = null;
	private _sticky: boolean;
	private _group: string = undefined;

	/**
	 * Contructs a Component.
	 */
	public constructor(point: Point, size: Size, attributes: IComponentAttributes = {}) 
	{
		this._point = point;
		this._size = size;

		const {
			sticky = false,
		} = attributes;

		this._sticky = sticky;
	}

	/**
	 * Callback method that gets called when this Component is attached to a [[Context]].
	 */
	public onAttach(): void {}

	/**
	 * Callback method that gets called when this Component is detached from a [[Context]]. Since a Component used [[Drawable]] and
	 * [[Control]], the developer needs to make sure to detach every entities created on the life time of that Component.
	 */
	public onDetach(): void {}

	/**
	 * Callback method that gets called when this Component (position + size) touches the outside limits of the [[Context]] size. This is called 
	 * by an internal [[Context]] event when the window get resized.
	 * 
	 * @fixme						onResize is never called by the Context resize event. 
	 */
	public onResize(): void {}



	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the the current [[Context]] that this Component is attached to. This will be undefined if this Component has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/** 
	 * Sets the current [[Context]] to this Component. This is called internaly when this Component is attached to a Context.
	 * 
	 * @internal 
	 */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the the current [[Group]] GUID that this Component is attached to.
	 */
	public get group(): string
	{
		return this._group;
	}
	/** 
	 * Sets the current [[Group]] GUID of this Component. This is called internaly when this Component is attached to a Group. 
	 * 
	 * @internal 
	 */
	public set group(group: string)
	{
		this._group = group;
	}
	
	/**
	 * Gets the the [[Fx]] instance from the current [[Context]] that this Component is attached to. This will be undefined if this Component has not been attached yet.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}
	/** 
	 * Sets the [[Fx]] instance of the current [[Context]] to this Component. This is called internaly when this Component gets attached to a Context. 
	 * 
	 * @internal 
	 */
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	/**
	 * Gets the unique GUID identifier of this Component. This will be undefined if this Component has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/** 
	 * Sets the unique GUID of this Component. This is called internaly when this Component is attached to a [[Context]]. 
	 * 
	 * @internal 
	 */
	public set guid(guid: string)
	{
		this._guid = guid;
	}	

	/**
	 * Gets the width and height of this Component. 
	 */
	public get size(): Size
	{
		return this._size;
	}
	/**
	 * Sets the width and height of this Component. When setting size, it is the duty of the user to resize the childs entities
	 * that this Component may have.
	 */
	public set size(size: Size)
	{
		this._size = size;
	}

	/**
	 * Gets the x and y position in [[Context]] of this Component.
	 */
	public get point(): Point
	{
		return this._point;
	}
	/**
	 * Sets the x and y coordinate in the [[Context]] of this Component. When setting point, it is the duty of the user to translate the position
	 * of the entities that this Component may have.
	 */
	public set point(point: Point)
	{
		this._point = point;
	}

	/**
	 * Gets the current status of the sticky, default is false.
	 */
	public get sticky(): boolean
	{
		return this._sticky;
	}
	/**
	 * Sets the the sticky status of this component, means that all drawables of the component should render on top of the others non sticky.
	 * As a Component is a regroupment of [[Drawable]] and [[Control]], it is the responsibility of the developer to make sure that the sticky 
	 * value is spawned in the child entities.
	 */
	public set sticky(sticky: boolean)
	{
		this._sticky = sticky;
	}
}