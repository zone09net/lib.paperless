import * as Foundation from '@zone09.net/foundation';
import {Point} from './Point.js';
import {Size} from './Size.js';
import {Events} from './Events.js';
import {Drawable} from './Drawable.js';
import {Control} from './Control.js';
import {Component} from './Component.js';
import {Group} from './Group.js';
import {DrawAction} from './DrawAction.js';
import {MouseAction} from './MouseAction.js';
import {Fx} from './Fx.js';
import {Restrict} from './enums/Restrict.js';
import {IContextAttributes} from './interfaces/IContext.js';
import {IDragging} from './interfaces/IContext.js';
import {IFeatures} from './interfaces/IContext.js';
import {IStates} from './interfaces/IContext.js';



export class Context
{
	private _guid: Foundation.Guid = new Foundation.Guid();
	private _drawables: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _controls: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _components: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _groups: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _drawActions: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _mouseActions: Foundation.ExtendedMap = new Foundation.ExtendedMap();
	private _fx: Fx = new Fx();
	private _attributes: IContextAttributes;
	private _viewport: {
		canvas: {
			buffer: OffscreenCanvas,
			main: HTMLCanvasElement
		},
		context: {
			buffer: OffscreenCanvasRenderingContext2D,
			main: ImageBitmapRenderingContext
		},
		id: {
			resizing: number,
			dragging: number
		},
		points: Point[],
		states: IStates,
	};
	//--

	public constructor(attributes: IContextAttributes = {})
	{
		const {
			scale = 1,
			size = new Size(window.innerWidth, window.innerHeight),
			autosize = false,
			features = {},
			dragging = {},
		} = attributes;

		this._attributes = {
			scale: scale,
			autosize: autosize,
			features: {
				...{
					nohover: false,
					nodragging: false,
					nosnapping: true,
					nodefault: false,
				},
				...features,
			},
			dragging: {
				...{
					delay: 180,
					restrict: Restrict.none,
					grid: { ...{ x: 1, y: 1 }, ...dragging.grid },
				},
				...dragging,
			},
		};

		this._viewport = {
			canvas: {
				buffer: new OffscreenCanvas(0, 0),
				main: document.createElement('canvas')
			},

			context: {
				buffer: undefined,
				main: undefined
			},

			id: {
				resizing: undefined,
				dragging: undefined,
			},

			points: [],

			states: {
				mobile: Foundation.Mobile.isMobile(),
				mousedown: false,
				pinch: false,
				drag: false,
				focussed: undefined,
				sorted: true,
				norefresh: false,

				pointer: {
					current: new Point(-1, -1, {scale: scale}),
					last: new Point(-1, -1, {scale: scale}),
					clicked: new Point(-1, -1, {scale: scale}),
					control: undefined,
					dragdiff: new Point(-1, -1, {scale: scale})
				},

				touch: {},

				refresh: {
					delta: 0,
					elapsed: 0,
				}
			},
		};

		this._viewport.context.main = this._viewport.canvas.main.getContext('bitmaprenderer', {alpha: false});
		this._viewport.context.buffer = this._viewport.canvas.buffer.getContext('2d', {alpha: false});
		this.size = size;

		this._viewport.canvas.main.addEventListener('touchmove',Events.handleTouchMove.bind(null, this), {passive: false});
		this._viewport.canvas.main.addEventListener('touchstart', Events.handleTouchStart.bind(null, this), {passive: false});
		this._viewport.canvas.main.addEventListener('touchend', Events.handleTouchEnd.bind(null, this),	false);
		window.addEventListener('touchmove', Events.handleWindowTouchMove.bind(null, this), {passive: false});

		this._viewport.canvas.main.addEventListener('mousemove', Events.handleMouseMove.bind(null, this), {passive: false});
		this._viewport.canvas.main.addEventListener('mousedown',	Events.handleMouseDown.bind(null, this), false);
		this._viewport.canvas.main.addEventListener('mouseup', Events.handleMouseUp.bind(null, this), false);
		this._viewport.canvas.main.addEventListener('resize', Events.handleResize.bind(null, this), false);
		this._viewport.canvas.main.addEventListener('contextmenu', Events.handleRightMouseClick.bind(null, this), false);
		this._viewport.canvas.main.addEventListener('dragstart', Events.handleDragStart.bind(null, this), false);
		this._viewport.canvas.main.addEventListener('dragover', Events.handleMouseMove.bind(null, this), {passive: false});
		window.addEventListener('resize', Events.handleResize.bind(null, this), false);

		this._fx.context = this;
	}

	public link(drawable: Drawable, control: Control): void 
	{
		const d: any = this._drawables.map.get(drawable.guid);
		const c: any = this._controls.map.get(control.guid);

		c.index = d.index;
		this.states.sorted = false;
	}

	public enroll(object: Drawable | Control | Component): Drawable | Control | Component
	{
		object.context = this;

		return object;
	}

	public attach<Type>(entity: | Drawable | Control | Component | Group | DrawAction | MouseAction | HTMLElement): Type 
	{
		let guid: string;
		let entry: any;

		if(entity instanceof Drawable)
		{
			guid = this.getGuidGenerator().create('1', 'a');
			entry = this._drawables.set(guid, entity);

			this.states.sorted = false;
		}
		else if(entity instanceof Control)
		{
			guid = this.getGuidGenerator().create('1', 'b');
			entry = this._controls.set(guid, entity);

			this.states.sorted = false;
		} 
		else if(entity instanceof Component)
		{
			guid = this.getGuidGenerator().create('1', '9');
			entry = this._components.set(guid, entity);

			this.states.sorted = false;
		}
		else if(entity instanceof Group)
		{
			guid = this.getGuidGenerator().create('1', '8');
			entry = this._groups.set(guid, entity);
		}
		else if(entity instanceof DrawAction)
		{
			guid = this.getGuidGenerator().create('2', 'a');
			entry = this._drawActions.set(guid, entity);
		}
		else if(entity instanceof MouseAction)
		{
			guid = this.getGuidGenerator().create('2', 'b');
			entry = this._mouseActions.set(guid, entity);
		}
		else if(entity instanceof HTMLElement)
		{
			entity.appendChild(this._viewport.canvas.main);
			return null;
		}
		else
			throw new Error('Context.attach need either a Drawable/Control/Component/Group/DrawActions/MouseActions/HTMLElement type');

		entry.context = this;
		entry.guid = guid;
		entry.fx = this._fx;
		entry.onAttach();

		return entry;
	}

	public detach(guids: string[] | string, restrict: Restrict.norefresh | Restrict.none = Restrict.norefresh): void
	{
		let guidlist: string[];

		if(guids instanceof Array)
			guidlist = guids;
		else
			guidlist = new Array(guids);

		for(let guid of guidlist)
		{
			if(typeof guid != 'string')
				continue;

			const version: string = guid.charAt(14);
			const variant: string = guid.charAt(19);

			if(version == '1' && variant == 'a')
			{
				const entity: Drawable = this._drawables.get(guid);

				if(entity && entity.removable)
				{
					const group: Group = this.get(entity.group);

					if(group)
						group.detach(entity);

					entity.onDetach();
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._drawables.delete(guid);
				}
			}
			else if(version == '1' && variant == 'b')
			{
				const entity: Control = this._controls.get(guid);

				if(entity && entity.removable)
				{
					entity.onDetach();
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._controls.delete(guid);
				}
			}
			else if(version == '1' && variant == '8')
			{
				const entity: Group = this._groups.get(guid);

				if(entity)
				{
					entity.onDetach();
					entity.context = undefined;
					entity.guid = undefined;
					this._groups.delete(guid);
				}
			}
			else if(version == '1' && variant == '9')
			{
				const entity: Component = this._components.get(guid);

				if(entity)
				{
					entity.onDetach();
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._components.delete(guid);
				}
			}
			else if(version == '2' && variant == 'a')
			{
				const entity: DrawAction = this._drawActions.get(guid);

				if(entity)
				{
					entity.onDetach();
					entity.context = undefined;
					entity.guid = undefined;
					this._drawActions.delete(guid);
				}
			}
			else if(version == '2' && variant == 'b')
			{
				const entity: MouseAction = this._mouseActions.get(guid);

				if(entity)
				{
					entity.onDetach();
					entity.context = undefined;
					entity.guid = undefined;
					this._mouseActions.delete(guid);
				}
			}
		}

		this.states.sorted = false;

		if(restrict == Restrict.none && !this.fx.id && this.states.drag)
			this.refresh();
	}

	public get<Type extends	Drawable | Control | Component | Group	| DrawAction | MouseAction>(guid: string): Type
	{
		if(guid)
		{
			const version = guid.charAt(14);
			const variant = guid.charAt(19);

			if(version == '1' && variant == 'a')
				return this._drawables.get(guid);
			else if(version == '1' && variant == 'b')
				return this._controls.get(guid);
			else if(version == '1' && variant == '8')
				return this._groups.get(guid);
			else if(version == '1' && variant == '9')
				return this._components.get(guid);
			else if(version == '2' && variant == 'a')
				return this._drawActions.get(guid);
			else if(version == '2' && variant == 'b')
				return this._mouseActions.get(guid);
		}
	}

	public refresh(): void
	{
		if(!this._viewport.states.norefresh)
			window.requestAnimationFrame((timestamp: number) => this.draw(timestamp));
	}

	public drag(): void
	{
		if(this.states.drag)
		{
			const control: Control = this.get(this.states.pointer.control);

			if(control.restrict == Restrict.none)
			{
				control.drawable.x =	this.states.pointer.current.x - this.states.pointer.dragdiff.x;
				control.drawable.y =	this.states.pointer.current.y - this.states.pointer.dragdiff.y;

				control.drawable.x /= window.devicePixelRatio * this.scale;
				control.drawable.y /= window.devicePixelRatio * this.scale;
			}
			else if(control.restrict == Restrict.horizontal)
			{
				control.drawable.x =	this.states.pointer.current.x - this.states.pointer.dragdiff.x;
				control.drawable.x /= window.devicePixelRatio * this.scale;
			}
			else if(control.restrict == Restrict.vertical)
			{
				control.drawable.y =	this.states.pointer.current.y - this.states.pointer.dragdiff.y;
				control.drawable.y /= window.devicePixelRatio * this.scale;
			}

			if(!this.features.nosnapping && this.dragging.restrict == Restrict.ondrag)
			{
				control.drawable.x =	Math.round((this.states.pointer.current.x - this.states.pointer.dragdiff.x) /	(this.dragging.grid.x || 1)) * (this.dragging.grid.x || 1);
				control.drawable.y =	Math.round((this.states.pointer.current.y - this.states.pointer.dragdiff.y) /	(this.dragging.grid.y || 1)) * (this.dragging.grid.y || 1);
				control.drawable.x /= window.devicePixelRatio * this.scale;
				control.drawable.y /= window.devicePixelRatio * this.scale;
			}

			if(control.drawable.group)
			{
				const group: Group = this.get(control.drawable.group);

				[...group.grouped, ...group.enrolled].forEach((drawable: Drawable) => {
					drawable.x = control.drawable.x - (<any>drawable.points)['origin'].x;
					drawable.y = control.drawable.y - (<any>drawable.points)['origin'].y;
				});
			}
		}

		this._viewport.id.dragging = window.requestAnimationFrame((timestamp?: number) => {
			this.draw(timestamp);
			this.drag();
		});
	}

	public draw(timestamp?: number): void {
		this.states.refresh.delta = timestamp - this.states.refresh.elapsed;
		this.states.refresh.elapsed = timestamp;
		//console.log(this.states.refresh.delta)

		if(!this.states.sorted)
		{
			//this._drawActions.sort();
			//this._mouseActions.sort();
			this._components.sort();
			//this._groups.sort();
			this._drawables.sort();
			this._controls.reverse();
			this.states.sorted = true;
		}

		this._drawActions.forEach((drawaction: DrawAction) => {
			drawaction.onDrawBefore(this.context2D);
		});

		const stickies: Drawable[] = this._drawables.sorted.filter((drawable: Drawable) => drawable.sticky && drawable.visible);

		this._drawables.sorted.forEach((drawable: Drawable) => {
			if(this.states.drag)
			{
				const control: Control = this.get(this.states.pointer.control);

				this.context2D.save();
				control.onDrag();
				drawable.draw(this.context2D);
				this.context2D.restore();
			}
			else if(
				drawable.visible &&
				!drawable.sticky &&
				drawable.x > -drawable.size.width &&
				drawable.x < this._viewport.canvas.buffer.width + drawable.size.width &&
				drawable.y > -drawable.size.height &&
				drawable.y < this._viewport.canvas.buffer.height + drawable.size.height
			)
			{
				drawable.draw(this.context2D);
			}
		});

		for(let entry of stickies)
			entry.draw(this.context2D);

		this._drawActions.forEach((drawaction: DrawAction) => {
			drawaction.onDrawAfter(this.context2D);
		});

		const bitmap: ImageBitmap = this._viewport.canvas.buffer.transferToImageBitmap();
		this._viewport.context.main.transferFromImageBitmap(bitmap);
	}

	public setFocus(guid: string): void
	{
		const focusControl: Control = this.get(guid);

		if(focusControl instanceof Control && guid != this.states.focussed)
		{
			if(this.states.focussed != undefined)
			{
				const unfocusControl: Control = this.get(this.states.focussed);

				if(unfocusControl instanceof Control)
					unfocusControl.onLostFocus();
			}

			focusControl.onFocus();
			this.states.focussed = guid;
		}
	}

	public removeFocus(): void
	{
		if(this.states.focussed != undefined)
		{
			const unfocusControl: Control = this.get(this.states.focussed);

			if(unfocusControl instanceof Control)
				unfocusControl.onLostFocus();

			this.states.focussed = undefined;
		}
	}

	public getGuidGenerator(): Foundation.Guid
	{
		return this._guid;
	}

	public getDrawables(): Foundation.ExtendedMap
	{
		return this._drawables;
	}

	public getControls(): Foundation.ExtendedMap
	{
		return this._controls;
	}

	public getComponents(): Foundation.ExtendedMap
	{
		return this._components;
	}

	public getGroups(): Foundation.ExtendedMap
	{
		return this._groups;
	}

	public getExtendedDrawActions(): Foundation.ExtendedMap
	{
		return this._drawActions;
	}

	public getExtendedMouseActions(): Foundation.ExtendedMap
	{
		return this._mouseActions;
	}

	// move to drawable
	public static near(map: Foundation.ExtendedMap,	point: Point, radius: number,	list: Array<string>)
	{
		let near: any = [...map.filter((drawable: Drawable) =>
			drawable.x >= point.x - radius &&
			drawable.y >= point.y - radius &&
			drawable.x <= point.x + radius &&
			drawable.y <= point.y + radius &&
			drawable.visible != false &&
			!list.includes(drawable.guid))
		];

		for(let drawable of near)
			list.push(drawable.guid);

		for(let drawable of near)
			this.near(map, new Point(drawable.x, drawable.y), radius, list);
	}



	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the current DOM canvas that is being used by Paperless.
	 */
	public get canvas(): HTMLCanvasElement
	{
		return this._viewport.canvas.main;
	}

	/**
	 * Gets the OffscreenCanvasRenderingContext2D objet of the canvas. Paperless is using a buffer so this accessor always return the buffer context.
	 */
	public get context2D(): OffscreenCanvasRenderingContext2D
	{
		return this._viewport.context.buffer;
	}

	/**
	 * Gets the [[Fx]] instance that has been created on a new Context.
	 */
	public get fx(): Fx
	{
		return this._fx;
	}

	/**
	 * Gets the current [[Size]] of the Context instance.
	 */
	public get size(): Size
	{
		return new Size(this.canvas.width, this.canvas.height);
	}
	/**
	 * Sets the [[Size]] of the Context instance. When setted, both main and buffer canvas are setted with new width and height values.
	 * A call to [[refresh]] is also made to update the Context.
	 */
	public set size(size: Size)
	{
		//let ratio: number = window.devicePixelRatio;
		let ratio: number = 1;

		this.canvas.width = size.width * ratio;
		this.canvas.height = size.height * ratio;
		this._viewport.canvas.buffer.width = size.width * ratio;
		this._viewport.canvas.buffer.height = size.height * ratio;

		//this._viewport.canvas.main.style.width = (this._viewport.canvas.main.width ) * ratio + 'px';
		//this._viewport.canvas.main.style.height = (this._viewport.canvas.main.height ) * ratio + 'px';

		this.refresh();
	}

	public get scale(): number
	{
		return this._attributes.scale;
	}
	public set scale(scale: number)
	{
		this._attributes.scale = scale;
	}

	public get features(): IFeatures
	{
		return this._attributes.features;
	}
	public set features(features: IFeatures)
	{
		this._attributes.features = features;
	}

	public get dragging(): IDragging
	{
		return this._attributes.dragging;
	}
	public set dragging(dragging: IDragging)
	{
		this._attributes.dragging = dragging;
	}

	public get autosize(): boolean
	{
		return this._attributes.autosize;
	}
	public set autosize(autosize: boolean)
	{
		this._attributes.autosize = autosize;
	}

	public get states(): IStates
	{
		return this._viewport.states;
	}

	public get id(): any
	{
		return this._viewport.id;
	}

	public get points(): any
	{
		return this._viewport.points;
	}
}
