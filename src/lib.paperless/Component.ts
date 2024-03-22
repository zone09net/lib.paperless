import * as Foundation from '@zone09.net/foundation';
import {Point} from './Point.js';
import {Size} from './Size.js';
import {Context} from './Context.js';
import {Drawable} from './Drawable.js';
import {Control} from './Control.js';
import {Fx} from './Fx.js';
import {IComponentAttributes} from './interfaces/IComponent.js';



/**
 * Unlike the [[Drawable]] and the [[Control]] that are use for the display and the interaction, the Component is a mix of a little of everything. 
 * As we want to separete our drawables and controls in reusable objets, we can use the components to group those to create complex elements like 
 * an editor, a screen popup or even a graphical chart.
 *
 * Here's an example of 4 smileys in each of the browser corner.
 *
 * ```typescript
 * import * as Paperless from './lib.paperless.js';
 *
 * class Smileys extends Paperless.Component 
 * {
 * 	public onAttach(): void
 * 	{
 * 		const points: Paperless.Point[] = [
 * 			new Paperless.Point(50, 50),
 * 			new Paperless.Point(this.context.width - 50, 50),
 * 			new Paperless.Point(this.context.width - 50, this.context.height - 50),
 * 			new Paperless.Point(50, this.context.height - 50),
 * 		];
 * 
 * 		for(let i = 0; i < 4; i++)
 * 		{
 * 			this.enroll(
 * 				new Paperless.Drawables.Smiley({
 * 					context: this.context,
 * 					point: points[i],
 * 					outerRadius: 15,
 * 				})
 * 			);
 * 		}
 * 	}
 *
 * 	public onDetach(): void
 * 	{
 * 		this.getDrawables().forEach((drawable: Paperless.Drawable) => {
 * 			this.context.detach(drawable.guid);
 * 		});
 * 	}
 * 
 * 	public onResize(): void
 * 	{
 * 		const points: Paperless.Point[] = [
 * 			new Paperless.Point(50, 50),
 * 			new Paperless.Point(this.context.width - 50, 50),
 * 			new Paperless.Point(this.context.width - 50, this.context.height - 50),
 * 			new Paperless.Point(50, this.context.height - 50),
 * 		];
 * 		let i: number = 0;
 * 
 * 		this.getDrawables().forEach((drawable: Paperless.Drawable) => {
 * 			drawable.x = points[i].x;
 * 			drawable.y = points[i].y;
 * 			i++;
 * 		});
 * 	}
 * }
 * 
 * const context: Paperless.Context = new Paperless.Context({autosize: true});
 *
 * new Smileys({
 * 	context: context
 * });
 * ```
 */
export class Component 
{
	private _point: Point;
	private _size: Size;
	private _guid: string = undefined;
	private _context: Context = undefined;
	private _fx: Fx = undefined;
	private _sticky: boolean;
	private _group: string = undefined;
	private _removable: boolean;
	private _enrolled: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	//---

	/**
	 * Contructs a Component.
	 */
	public constructor(attributes: IComponentAttributes = {}) 
	{
		const {
			sticky = false,
			point = {x: window.innerWidth / 2, y: window.innerHeight / 2},
			size = {width: 50, height: 50},
			context = null,
			layer = null,
			removable = true,

			onAttach = null,
			onDetach = null,
			onResize = null,
		} = attributes;

		this._point = new Point(point.x, point.y);
		this._size = new Size(size.width, size.height);
		this._sticky = sticky;
		this._removable = removable;

		context ? context.attach(this, layer) : null;	

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
		onResize ? this.onResize = onResize : null;
	}

	/**
	 * Enrolls an entity in the Component, meaning that a reference will be kept internaly. This is usefull
	 * to interact with the entities inside the component.
	 *
	 * @param entity				Drawable(s) and/or Control(s)
	 */
	public enroll(entity: Drawable | Drawable[] | Control | Control[]): void
	{
		if(entity instanceof Array)
		{
			for(let item of entity)
			{
				if(!this._enrolled.has(item.guid))
					this._enrolled.set(item.guid, item);
			}
		}
		else
		{
			if(!this._enrolled.has(entity.guid))
				this._enrolled.set(entity.guid, entity);
		}
	}

	/**
	 * Sets the sticky value of all drawables that has been enrolled in the Component to [[Component.sticky]] value.
	 */
	public setStickyDrawables(): void
	{
		this.getDrawables().forEach((drawable: Drawable) => {
			drawable.sticky = this.sticky;
		});	
	}

	/**
	 * Gets the enrolled drawables from the Component
	 *
	 * @returns							Array of [[Drawable]]
	 */
	public getDrawables(): Drawable[]
	{
		return this._enrolled.filter((entity: Drawable | Control) => entity instanceof Drawable);
	}

	/**
	 * Gets the enrolled controls from the Component
	 *
	 * @returns							Array of [[Control]]
	 */
	public getControls(): Control[]
	{
		return this._enrolled.filter((entity: Drawable | Control) => entity instanceof Control);
	}

	/**
	 * Callback method when the Component is attached to a [[Context]].
	 *
	 * @param self				The component itself, automatically set by the Context.
	 */
	public onAttach(self?: Component): void {}

	/**
	 * Callback method when the Component is detached from a [[Context]]. Since a Component use [[Drawable]] and
	 * [[Control]], the developer needs to make sure to detach every entities created on the life time of the Component.
	 *
	 * @param self				The component itself, automatically set by the Context.
	 */
	public onDetach(self?: Component): void {}

	/**
	 * Callback method when the browser window get resized. Only called when the feature [[Context.autosize]] is set to true.
	 *
	 * @param self				The component itself, automatically set by the Context.
	 */
	public onResize(self?: Component): void {}



	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the the current [[Context]] that the Component is attached to. This will be undefined if the Component has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/** 
	 * Sets the current [[Context]] to the Component. This is called internaly when the Component is attached to a Context.
	 * 
	 * @internal 
	 */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the the current [[Group]] GUID that the Component is attached to.
	 */
	public get group(): string
	{
		return this._group;
	}
	/** 
	 * Sets the current [[Group]] GUID of the Component. This is called internaly when the Component is attached to a Group. 
	 * 
	 * @internal 
	 */
	public set group(group: string)
	{
		this._group = group;
	}
	
	/**
	 * Gets the the [[Fx]] instance from the current [[Context]] that the Component is attached to. This will be undefined if the Component has not been attached yet.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}
	/** 
	 * Sets the [[Fx]] instance of the current [[Context]] to the Component. This is called internaly when the Component gets attached to a Context. 
	 * 
	 * @internal 
	 */
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	/**
	 * Gets the unique GUID identifier of the Component. This will be undefined if the Component has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/** 
	 * Sets the unique GUID of the Component. This is called internaly when the Component is attached to a [[Context]]. 
	 * 
	 * @internal 
	 */
	public set guid(guid: string)
	{
		this._guid = guid;
	}	

	/** 
	 * Gets the width of the Component.
	 */
	public get width(): number
	{
		return this._size.width;
	}
	/** 
	 * Sets the width of the Component. This is only a reference for the user as nothing is calculated from this. 
	 */
	public set width(width: number)
	{
		this._size.width = width;
	}

	/** 
	 * Gets the height of the Component. 
	 */
	public get height(): number
	{
		return this._size.height;
	}
	/** 
	 * Sets the height of the Component. This is only a reference for the user as nothing is calculated from this.
	 */
	public set height(height: number)
	{
		this._size.height = height;
	}

	/** 
	 * Gets the width and height of the Component in a new [[Size]] object. 
	 */
	public get size(): Size
	{
		return this._size;
	}

	/** 
	 * Gets the x coordinate of the Component.  
	 */
	public get x(): number
	{
		return this._point.x;
	}
	/** 
	 * Sets the x coordinate of the Component. This is only a reference for the user as nothing is calculated from this. 
	 */
	public set x(x: number)
	{
		this._point.x = x;
	}

	/** 
	 * Gets the y coordinate of the Component.  
	 */
	public get y(): number
	{
		return this._point.y;
	}
	/** 
	 * Sets the y coordinate of the Component. This is only a reference for the user as nothing is calculated from this. 
	 */
	public set y(y: number)
	{
		this._point.y = y;
	}

	/** 
	 * Gets the x and y coordinate of the Component in a new [[Point]] object. 
	 */
	public get point(): Point
	{
		return this._point;
	}

	/**
	 * Gets the removable status of the Control.
	 */
	public get removable(): boolean
	{
		return this._removable;
	}
	/**
	 * Sets the removable status of the Control. When set to false, the Control cannot be removed with the [[Context.detach]] method.
	 */
	public set removable(removable: boolean)
	{
		this._removable = removable;
	}
	
	/**
	 * Gets the current status of the sticky.
	 */
	public get sticky(): boolean
	{
		return this._sticky;
	}
	/**
	 * Sets the the sticky status of the Component, means that all drawables of the component should render on top of the others non sticky.
	 * As a Component is a regroupment of [[Drawable]] and [[Control]], it is the responsibility of the developer to make sure that the sticky 
	 * value is spawned in the child entities. This can be done with the [[Component.setStickyDrawables]] method.
	 */
	public set sticky(sticky: boolean)
	{
		this._sticky = sticky;
	}
}
