import * as Foundation from '@zone09.net/foundation';
import {Context} from './Context.js';
import {Fx} from './Fx.js';
import {ILayerAttributes} from './interfaces/ILayer.js';
import {Drawable} from './Drawable.js';
import {Control} from './Control.js';
import {Component} from './Component.js';
import {Group} from './Group.js';
import {DrawAction} from './DrawAction.js';
import {MouseAction} from './MouseAction.js';



export class Layer
{
	private _guid: string = undefined;
	private _context: Context = undefined;
	private _fx: Fx = undefined;
	private _index: number;
	private _drawables: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _controls: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _components: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _groups: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _drawactions: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _mouseactions: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	//---

	public constructor(attributes: ILayerAttributes = {}) 
	{
		const {
			context = null,
			index = 0,

			onAttach = null,
			onDetach = null,
		} = attributes;

		this._index = index;

		context ? context.attach(this) : null;

		onAttach ? this.onAttach = onAttach : null;
		onDetach ? this.onDetach = onDetach : null;
	}

	public static encode(layer: number): string
	{
		return String(layer).padStart(4, '0');
	}

	public static decode(guid: string): number
	{
		return Number(guid.substring(9, 13));
	}

	public onAttach(self?: Layer): void {}

	public onDetach(self?: Layer): void 
	{
		this._drawables.forEach((drawable: Drawable) => { this.context.detach(drawable.guid); });
		this._controls.forEach((control: Control) => { this.context.detach(control.guid); });
		this._components.forEach((component: Component) => { this.context.detach(component.guid); });
		this._groups.forEach((group: Group) => { this.context.detach(group.guid); });
		this._drawactions.forEach((drawaction: DrawAction) => { this.context.detach(drawaction.guid); });
		this._mouseactions.forEach((mouseaction: MouseAction) => { this.context.detach(mouseaction.guid); });
	}



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

	public get fx(): Fx
	{
		return this._fx;
	}
	public set fx(fx: Fx)
	{
		this._fx = fx;
	}

	public get guid(): string
	{
		return this._guid;
	}
	public set guid(guid: string)
	{
		this._guid = guid;
	}	

	public get index(): number
	{
		return this._index;
	}

	public get drawables(): Foundation.ExtendedMap
	{
		return this._drawables;
	}

	public get controls(): Foundation.ExtendedMap
	{
		return this._controls;
	}

	public get groups(): Foundation.ExtendedMap
	{
		return this._groups;
	}

	public get components(): Foundation.ExtendedMap
	{
		return this._components;
	}

	public get drawactions(): Foundation.ExtendedMap
	{
		return this._drawactions;
	}

	public get mouseactions(): Foundation.ExtendedMap
	{
		return this._mouseactions;
	}
}
