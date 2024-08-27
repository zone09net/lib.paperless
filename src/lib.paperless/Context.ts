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
import {DragAction} from './DragAction.js';
import {Layer} from './Layer.js';
import {Fx} from './Fx.js';
import {Restrict} from './enums/Restrict.js';
import {IContextAttributes} from './interfaces/IContext.js';
import {IDragging} from './interfaces/IContext.js';
import {IFeatures} from './interfaces/IContext.js';
import {IStates} from './interfaces/IContext.js';



export class Context
{
	private _fx: Fx = new Fx();
	private _guid: Foundation.Guid = new Foundation.Guid();
	private _layers: Layer[] = [];
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
		layer: number,
		points: Point[],
		states: IStates,
	};
	//--

	public constructor(attributes: IContextAttributes = {})
	{
		const {
			scale = 1,
			layer = 0,
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
					nolinehover: true,
					nosnapping: true,
				},
				...features,
			},
			dragging: {
				...{
					delay: 180,
					restrict: Restrict.none,
					grid: { 
						...{x: 1, y: 1}, 
						...dragging.grid 
					},
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

			layer: layer,

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

				timestamp: {
					delta: 0,
					elapsed: 0,
				}
			},
		};

		new Layer({
			context: this,
			index: layer
		});

		this._viewport.context.main = this._viewport.canvas.main.getContext('bitmaprenderer', {alpha: true});
		this._viewport.context.buffer = this._viewport.canvas.buffer.getContext('2d', {alpha: true});
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
		window.addEventListener('visibilitychange', Events.handleVisibilityChange.bind(null, this), false);

		this._fx.context = this;
	}

	public link(drawable: Drawable, control: Control): void 
	{
		const layerDrawable: number = Layer.decode(drawable.guid);
		const layerControl: number = Layer.decode(control.guid);

		if(layerDrawable != layerControl)
			throw new Error('Context.link() - both drawable and control need to be in the same layer');

		const d: any = this._layers[layerDrawable].drawables.map.get(drawable.guid);
		const c: any = this._layers[layerDrawable].controls.map.get(control.guid);

		c.index = d.index;
		this.states.sorted = false;
	}

	{
		entity.context = this;

		return entity;
	}

	public attach<Type>(entity: Drawable | Control | Component | Group | DrawAction | MouseAction | DragAction | Layer | HTMLElement, layerOverride?: number): Type 
	{
		let guid: string;
		let entry: any;
		let layer: number;

		if(layerOverride != undefined || layerOverride != null)
		{
			if(!this._layers[layerOverride])
			{
				new Layer({
					context: this,
					index: layerOverride
				});

				console.log('Layer ' + layerOverride + ' was created as it was missing');
			}

			layer = layerOverride;
		}
		else
			layer = this._viewport.layer;

		const layerString: string = Layer.encode(layer);

		if(entity instanceof Drawable)
		{
			guid = this.getGuidGenerator().create('00000000-' + layerString + '-0000-draw-000000xxxxxx');
			entry = this._layers[layer].drawables.set(guid, entity);

			this.states.sorted = false;
		}
		else if(entity instanceof Control)
		{
			guid = this.getGuidGenerator().create('00000000-' + layerString + '-0000-ctrl-000000xxxxxx');
			entry = this._layers[layer].controls.set(guid, entity);

			this.states.sorted = false;
		} 
		else if(entity instanceof Component)
		{
			guid = this.getGuidGenerator().create('00000000-' + layerString + '-0000-comp-000000xxxxxx');
			entry = this._layers[layer].components.set(guid, entity);

			this.states.sorted = false;
		}
		else if(entity instanceof Group)
		{
			guid = this.getGuidGenerator().create('00000000-' + layerString + '-0000-grup-000000xxxxxx');
			entry = this._layers[layer].groups.set(guid, entity);
		}
		else if(entity instanceof DrawAction)
		{
			guid = this.getGuidGenerator().create('00000000-' + layerString + '-0000-dact-000000xxxxxx');
			entry = this._layers[layer].drawactions.set(guid, entity);
		}
		else if(entity instanceof MouseAction)
		{
			guid = this.getGuidGenerator().create('00000000-' + layerString + '-0000-mact-000000xxxxxx');
			entry = this._layers[layer].mouseactions.set(guid, entity);
		}
		else if(entity instanceof DragAction)
		{
			guid = this.getGuidGenerator().create('00000000-' + layerString + '-0000-drag-000000xxxxxx');
			entry = this._layers[layer].dragactions.set(guid, entity);
		}
		else if(entity instanceof Layer)
		{
			guid = this.getGuidGenerator().create('00000000-' + String(entity.index).padStart(4, '0') + '-0000-layr-000000xxxxxx');
			this._layers[entity.index] = entity;
			entry = this._layers[entity.index];
		}
		else if(entity instanceof HTMLElement)
		{
			entity.appendChild(this._viewport.canvas.main);
			return null;
		}
		else
			throw new Error('Context.attach() wrong type');

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

			const layer: number = Layer.decode(guid);
			const type: string = guid.substring(19, 23);

			if(type == 'draw')
			{
				const entity: Drawable = this._layers[layer].drawables.get(guid);

				if(entity && entity.removable)
				{
					const group: Group = this.get(entity.group);

					if(group)
						group.detach(entity);

					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._layers[layer].drawables.delete(guid);
				}
			}
			else if(type == 'ctrl')
			{
				const entity: Control = this._layers[layer].controls.get(guid);

				if(entity && entity.removable)
				{
					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._layers[layer].controls.delete(guid);
				}
			}
			else if(type == 'grup')
			{
				const entity: Group = this._layers[layer].groups.get(guid);

				if(entity)
				{
					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					this._layers[layer].groups.delete(guid);
				}
			}
			else if(type == 'comp')
			{
				const entity: Component = this._layers[layer].components.get(guid);

				if(entity && entity.removable)
				{
					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._layers[layer].components.delete(guid);
				}
			}
			else if(type == 'dact')
			{
				const entity: DrawAction = this._layers[layer].drawactions.get(guid);

				if(entity && entity.removable)
				{
					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._layers[layer].drawactions.delete(guid);
				}
			}
			else if(type == 'mact')
			{
				const entity: MouseAction = this._layers[layer].mouseactions.get(guid);

				if(entity && entity.removable)
				{
					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._layers[layer].mouseactions.delete(guid);
				}
			}
			else if(type == 'drag')
			{
				const entity: DragAction = this._layers[layer].dragactions.get(guid);

				if(entity && entity.removable)
				{
					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					entity.fx = undefined;
					this._layers[layer].dragactions.delete(guid);
				}
			}
			else if(type == 'layr')
			{
				const entity: Layer = this._layers[layer];

				if(entity)
				{
					entity.onDetach(entity);
					entity.context = undefined;
					entity.guid = undefined;
					this._layers[layer] = undefined;
				}
			}
		}

		this.states.sorted = false;

		if(restrict == Restrict.none && !this.fx.id && !this.states.drag)
			this.refresh();
	}

	public get<Type extends Drawable | Control | Component | Group | DrawAction | MouseAction | MouseAction | Layer>(guid: string): Type
	{
		if(guid)
		{
			const layer: number = Layer.decode(guid);
			const type: string = guid.substring(19, 23);

			if(type == 'draw')
				return this._layers[layer].drawables.get(guid);
			else if(type == 'ctrl')
				return this._layers[layer].controls.get(guid);
			else if(type == 'grup')
				return this._layers[layer].groups.get(guid);
			else if(type == 'comp')
				return this._layers[layer].components.get(guid);
			else if(type == 'dact')
				return this._layers[layer].drawactions.get(guid);
			else if(type == 'mact')
				return this._layers[layer].mouseactions.get(guid);
			else if(type == 'drag')
				return this._layers[layer].dragactions.get(guid);
			else if(type == 'layr')
				return <any>this._layers[layer];
		}
	}

	public refresh(): void
	{
		if(!this._viewport.states.norefresh)
			window.requestAnimationFrame((timestamp: number) => this.draw(timestamp));
	}

	public loop(callback: () => void): void
	{
		const _this: Context = this;

		function infinite(timestamp: number)
		{
			callback();

			if(!_this._viewport.states.norefresh)
				_this.draw(timestamp);

			window.requestAnimationFrame((timestamp: number) => infinite(timestamp));
		}

		window.requestAnimationFrame((timestamp: number) => infinite(timestamp));
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

	public draw(timestamp?: number): void 
	{
		const layers: Layer[] = this.getLayers();
		const control: Control = this.get(this.states.pointer.control);

		this.states.timestamp.delta = timestamp - this.states.timestamp.elapsed;
		this.states.timestamp.elapsed = timestamp;

		if(!this.states.sorted)
		{
			layers.forEach((layer: Layer) => {
				layer.drawables.sort();
				layer.controls.reverse();
			});

			this.states.sorted = true;
		}

		layers.forEach((layer: Layer) => {
			if(layer.visible)
			{
				let context2D = this.context2D;

				if(layer.freezed && !layer.bitmap)
				{
				//	console.log(1, 'freezed', this.getLayers()[2].freezed, 'populated', this.getLayers()[2].populated);
					context2D = layer.context2D;
				}

				if(!layer.bitmap)
				{
					//console.log(2, 'freezed', this.getLayers()[2].freezed, 'populated', this.getLayers()[2].populated);
					layer.drawactions.forEach((drawaction: DrawAction) => {
						drawaction.onDrawBefore(context2D, drawaction);
					});

					const stickies: Drawable[] = layer.drawables.sorted.filter((drawable: Drawable) => drawable.sticky && drawable.visible);
					const nostickies: Drawable[] = layer.drawables.sorted.filter((drawable: Drawable) => !drawable.sticky && drawable.visible);

					if(this.states.drag)
					{
						for(let drawable of [...nostickies, ...stickies])
						{
							if(drawable.guid == control.drawable.guid)
							{
								context2D.save();

								this.getLayers().forEach((layer: Layer) => {
									layer.dragactions.forEach((dragaction: DragAction) => {
										dragaction.onDrag(dragaction);
									});
								});
								
								control.onDrag(control);
								drawable.draw(context2D);
								context2D.restore();
							}
							else
								drawable.draw(context2D);
						}
					}
					else
					{
						for(let drawable of [...nostickies, ...stickies])
							drawable.draw(context2D);
					}

					layer.drawactions.forEach((drawaction: DrawAction) => {
						drawaction.onDrawAfter(context2D, drawaction);
					});

					if(layer.freezed)
					{
						//console.log(3, 'freezed', this.getLayers()[2].freezed);
						layer.save();
						this.context2D.drawImage(layer.bitmap, 0, 0);
					}
				}
				else
				{
					//console.log(4, 'freezed', this.getLayers()[2].freezed, 'populated', this.getLayers()[2].populated);
					this.context2D.drawImage(layer.bitmap, 0, 0);
				}
			}
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
					unfocusControl.onLostFocus(unfocusControl);
			}

			focusControl.onFocus(focusControl);
			this.states.focussed = guid;
		}
	}

	public removeFocus(): void
	{
		if(this.states.focussed != undefined)
		{
			const unfocusControl: Control = this.get(this.states.focussed);

			if(unfocusControl instanceof Control)
				unfocusControl.onLostFocus(unfocusControl);

			this.states.focussed = undefined;
		}
	}

	public getGuidGenerator(): Foundation.Guid
	{
		return this._guid;
	}

	public getDrawables(layer?: number): Foundation.ExtendedMap
	{
		return layer >= 0 ? this._layers[layer].drawables : this._layers[this._viewport.layer].drawables;
	}

	public getAllDrawables(): Foundation.ExtendedMap
	{
		let all: Foundation.ExtendedMap = new Foundation.ExtendedMap();
		
		this.getLayers().forEach((layer: Layer) => {
			layer.drawables.forEach((drawable: Drawable) => {
				all.set(drawable.guid, drawable);
			});
		});

		return all;
	}

	public getControls(layer?: number): Foundation.ExtendedMap
	{
		return layer >= 0 ? this._layers[layer].controls : this._layers[this._viewport.layer].controls;
	}

	public getAllControls(): Foundation.ExtendedMap
	{
		let all: Foundation.ExtendedMap = new Foundation.ExtendedMap();
				
		this.getLayers().forEach((layer: Layer) => {
			layer.controls.forEach((control: Control) => {
				all.set(control.guid, control);
			});
		});

		return all;
	}

	public getComponents(layer?: number): Foundation.ExtendedMap
	{
		return layer >= 0 ? this._layers[layer].components : this._layers[this._viewport.layer].components;
	}

	public getAllComponents(): Foundation.ExtendedMap
	{
		let all: Foundation.ExtendedMap = new Foundation.ExtendedMap();
				
		this.getLayers().forEach((layer: Layer) => {
			layer.components.forEach((component: Component) => {
				all.set(component.guid, component);
			});	
		});

		return all;
	}

	public getGroups(layer?: number): Foundation.ExtendedMap
	{
		return layer >= 0 ? this._layers[layer].groups : this._layers[this._viewport.layer].groups;
	}

	public getAllGroups(): Foundation.ExtendedMap
	{
		let all: Foundation.ExtendedMap = new Foundation.ExtendedMap();
				
		this.getLayers().forEach((layer: Layer) => {
			layer.groups.forEach((group: Group) => {
				all.set(group.guid, group);
			});	
		});

		return all;
	}

	public getDrawActions(layer?: number): Foundation.ExtendedMap
	{
		return layer >= 0 ? this._layers[layer].drawactions : this._layers[this._viewport.layer].drawactions;
	}

	public getAllDrawActions(): Foundation.ExtendedMap
	{
		let all: Foundation.ExtendedMap = new Foundation.ExtendedMap();
				
		this.getLayers().forEach((layer: Layer) => {
			layer.drawactions.forEach((drawaction: DrawAction) => {
				all.set(drawaction.guid, drawaction);
			});	
		});

		return all;
	}

	public getMouseActions(layer?: number): Foundation.ExtendedMap
	{
		return layer >= 0 ? this._layers[layer].mouseactions : this._layers[this._viewport.layer].mouseactions;
	}

	public getAllMouseActions(): Foundation.ExtendedMap
	{
		let all: Foundation.ExtendedMap = new Foundation.ExtendedMap();
				
		this.getLayers().forEach((layer: Layer) => {
			layer.mouseactions.forEach((mouseaction: MouseAction) => {
				all.set(mouseaction.guid, mouseaction);
			});	
		});

		return all;
	}

	public getDragActions(layer?: number): Foundation.ExtendedMap
	{
		return layer >= 0 ? this._layers[layer].dragactions : this._layers[this._viewport.layer].dragactions;
	}

	public getAllDragActions(): Foundation.ExtendedMap
	{
		let all: Foundation.ExtendedMap = new Foundation.ExtendedMap();
				
		this.getLayers().forEach((layer: Layer) => {
			layer.dragactions.forEach((dragaction: MouseAction) => {
				all.set(dragaction.guid, dragaction);
			});	
		});

		return all;
	}

	public getLayers(): Layer[]
	{
		return this._layers.filter((l: Layer) => 
			l != undefined && 
			l != null
		);
	}

	public getLayer(layer: number): Layer
	{
		return this._layers.filter((l: Layer) => 
			l != undefined && 
			l != null &&
			(layer >= 0 ? Layer.decode(l.guid) == layer : true)
		)[0];
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
	 * Gets the width of the Context.
	 */
	public get width(): number
	{
		return this.canvas.width;
	}

	/**
	 * Gets the height of the Context.
	 */
	public get height(): number
	{
		return this.canvas.height;
	}

	/**
	 * Gets the current [[Size]] of the Context instance.
	 */
	public get size(): Size
	{
		return new Size(this.canvas.width, this.canvas.height);
	}
	/**
	 * Sets the [[Size]] of the Context instance. When setted, both main and buffer canvas are given the same new width and height values.
	 * A call to [[refresh]] is also made to update the Context.
	 */
	public set size(size: Size)
	{
		//let ratio: number = window.devicePixelRatio;
		let ratio: number = 1;

		this._viewport.canvas.main.width = size.width * ratio;
		this._viewport.canvas.main.height = size.height * ratio;
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

	public get layer(): number
	{
		return this._viewport.layer;
	}
	public set layer(layer: number)
	{
		this._viewport.layer = layer;

		if(!this._layers[layer])
		{
			new Layer({
				context: this,
				index: layer
			});

			console.log('layer ' + layer + ' was created as it was missing');
		}
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

