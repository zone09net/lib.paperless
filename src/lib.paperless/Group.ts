import * as Foundation from '@zone09.net/foundation';
import {Context} from './Context.js';
import {Drawable} from './Drawable.js';
import {Control} from './Control.js';
import {Component} from './Component.js';
import {IGroupAttributes} from './interfaces/IGroup.js';
import {Fx} from './Fx.js';



/**
 * The class offer a grouping capability for the [[Drawable]], [[Control]] or [[Component]]. Grouping Drawables will gives the possibility
 * to drag or animate them with [[Fx]] at the same time. Grouping Components is mostly for development purpose in the case grouping is needed.
 * For Controls, the feature is not yet used but it is there in case.
 * 
 * Because the unique GUID is only assigned when attached to a [[Context]], you can't [[attach]] an entity prior of that as the Group GUID will
 * be undefined.
 * 
 * ```typescript
 * import * as Paperless from './lib.paperless.js'; 
 * 
 * let context: Paperless.Context = new Paperless.Context();
 * let group: Paperless.Group = new Paperless.Group;
 * 
 * let circle1: Paperless.Drawable = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(100, 100), 30, {fillcolor: '#555555'}));
 * 
 * let circle2: Paperless.Drawable = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(100, 200), 30, {fillcolor: '#ff0000'}));
 * 
 * let control: Paperless.Control = context.attach(new Paperless.Controls.Button(() => {
 * 	context.fx.add({
 * 		duration: 100,
 * 		drawable: circle1,
 * 		effect: context.fx.move,
 * 		smuggler: { ease: Paperless.Fx.easeLinear, angle: 0, distance: 100 },
 * 	});
 * }))
 * 
 * context.attach(document.body);
 * context.attach(group);
 * control.attach(circle1);
 * group.attach(circle1);
 * group.attach(circle2);
 * ``` 
 */
export class Group
{
	private _context: Context = undefined;
	private _guid: string = undefined;
	private _fx: Fx = undefined;
	private _grouped: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _enrolled: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	//---

	/**
	 * Constructs a Group.
	 */
	public constructor(attributes: IGroupAttributes = {}) 
	{
		const {
			context = null,
		} = attributes;

		context ? context.attach(this) : null;	
	}

	public enroll(entity: Drawable | Array<Drawable>): void
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
			console.log(entity.guid)
			if(!this._enrolled.has(entity.guid))
				this._enrolled.set(entity.guid, entity);
		}
	}

	/**
	 * Attaches a an entity to this Group. Internally, the entity [[group]] will be available with this Group GUID for reference.
	 * 
	 * @todo						Add a callback to Drawable.onGroup(), Control.onGroup() and Component.onGroup()
	 */
	public attach(entity: Drawable | Control | Component | Array<Drawable | Control | Component>): void
	{
		if(entity instanceof Array)
		{
			for(let item of entity)
			{
				if(!this._grouped.has(item.guid))
				{
					let entry: any = this._grouped.set(item.guid, item);

					entry.group = this.guid;
				}
			}
		}
		else
		{
			if(!this._grouped.has(entity.guid))
			{
				let entry: any = this._grouped.set(entity.guid, entity);

				entry.group = this.guid;
			}
		}
	}

	/**
	 * Detaches an entity from this this Group. Internally, the entity [[group]] reference will be set to undefined.
	 * 
	 * @todo						Add callback to Drawable.onDegroup(), Control.onDegroup() and Component.onDegroup()
	 */
	public detach(entity: Drawable | Control | Component | Array<Drawable | Control | Component>): void
	{
		if(entity instanceof Array)
		{
			for(let item of entity)
			{
				this._grouped.delete(item.guid);
				item.group = undefined;
			}
		}
		else
		{
			this._grouped.delete(entity.guid);
			entity.group = undefined;
		}
	}

	public getDrawables(): Drawable[]
	{
		return this._grouped.filter((entity: Drawable | Control | Component | Group) => entity instanceof Drawable);
	}

	public getControls(): Control[]
	{
		return this._grouped.filter((entity: Drawable | Control | Component | Group) => entity instanceof Control);
	}

	public getComponents(): Component[]
	{
		return this._grouped.filter((entity: Drawable | Control | Component | Group) => entity instanceof Component);
	}

	/**
	 * Callback method that gets called when this Group is attached to a [[Context]]. At this point, [[context]] and [[guid]] are available.
	 */
	public onAttach(self?: Group): void {}

	/**
	 * Callback method that gets called when the this Group detached from a [[Context]]. When this Group is detached,
	 * all references of GUID in [[group]] is set to undefined to all entities that were part of it.
	 * 
	 * ```typescript
 	 * // If you decide to override onAttach, include this code in your 
	 * // new onDetach method so the references get removed from the Group intance.
	 * this.map.forEach((entry: any) => {
	 * 	entry.object.group = undefined;
	 * });
	 * 
	 * this.map.clear();
	 * ```
	 * @internal
	 */
	public onDetach(self?: Group): void 
	{
		this._grouped.map.forEach((entry: any) => {
			entry.object.group = undefined;
		});

		this._grouped.clear();
	}



	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the the current [[Context]] GUID that this Group is attached to. This will be undefined if this Group has not been attached to a Context yet.
	 */
	public get context(): Context
	{
		return this._context;
	}
	/** 
	 * Sets the current [[Context]] GUID to this Group. This is called internaly when this Group is attached to a Context.
	 * 
	 * @internal 
	 * */
	public set context(context: Context)
	{
		this._context = context;
	}

	/**
	 * Gets the unique GUID identifier from this Group. This will be undefined if this Group has not been attached to a [[Context]] yet.
	 */
	public get guid(): string
	{
		return this._guid;
	}
	/** 
	 * Sets the unique GUID of this Group. This is called internaly when this Group is attached to a [[Context]].
	 * 
	 * @internal 
	 * */
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

	/**
	 * Gives the list of entities attached to this Group. 
	 * 
	 *```typescript
	 * // Looping through group map
	 * group.map.forEach((value: any, key: number) => {
	 * 	console.log(key)
	 * 	console.log(value[0], 'guid');
	 * 	console.log(value[1].index, 'index positionning')
	 * 	console.log(value[1].object)
	 * });
	 *
	 * // Get all drawables from a group
	 * let drawables: Array<{guid: string, map: Map<string, any>}> = context.getDrawables().filter(([guid, map]: any) => 
	 * 	map.object.group = circle1.group
	 * );
	 * console.log(drawables)
	 * ```
	 */
	public get grouped(): Foundation.ExtendedMap
	{
		return this._grouped;
	}

	public get enrolled(): Foundation.ExtendedMap
	{
		return this._enrolled;
	}
}
