import * as Foundation from '@zone09.net/foundation';
import {Point} from './Point.js';
import {Size} from './Size.js';
import {Events} from './Events.js';
import {Drawable} from './Drawable.js';
import {Control} from './Control.js';
import {Component} from './Component.js';
import {Group} from './Group.js';
import {DrawActions} from './DrawActions.js';
import {MouseActions} from './MouseActions.js';
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
	
		context:  {
			buffer: OffscreenCanvasRenderingContext2D,
			main: ImageBitmapRenderingContext
		},
	
		smuggler: any,
		states: IStates,
	};
	//---

	public constructor(attributes: IContextAttributes = {})
	{
		const {
			fillcolor = '#000000',
			strokecolor = '#a0a0a0',
			font = '16px system-ui',
			linewidth = 2,
			shadow = 0,
			shadowcolor = '#ffffff',
			alpha = 1,
			scale = 1,
			size = new Size(window.innerWidth, window.innerHeight),
			autosize = false,
			features = {},
			dragging = {},
		} = attributes;

		this._attributes = {
			strokecolor: strokecolor,
			fillcolor: fillcolor,
			font: font,
			linewidth: linewidth,
			shadow: shadow,
			shadowcolor: shadowcolor,
			alpha: alpha,
			scale: scale,
			autosize: autosize,
			features: {
				...{ nohover: false, nodragging: false, nosnapping: true, nodefault: false },
				...features
			},
			dragging: {
				...{ delay: 180, restrict: Restrict.none, grid: {...{x: 1, y: 1}, ...dragging.grid}},
				...dragging
			}
		};

		this._viewport = {
			canvas: {
				buffer: new OffscreenCanvas(0, 0), 
				main: document.createElement("canvas")
			},

			context: {
				buffer: undefined,
				main: undefined
			},

			smuggler: {
				id: {
					resizing: undefined,
					dragging: undefined,
				},
				dragdiff: undefined,
			},

			states: {
				mobile: Foundation.Mobile.isMobile(),
				mousedown: false,
				pinch: false,
				drag: false,
				focussed: undefined,
				sorted: true,

				pointer: {
					current: new Point(-1, -1, {scale: scale}),
					last: new Point(-1, -1, {scale: scale}), 
					clicked: new Point(-1, -1, {scale: scale}),
					control: undefined, 
				},

				touch: {
				}
			},
		};

		this._viewport.context.main = this._viewport.canvas.main.getContext("bitmaprenderer", {alpha: false});
		this._viewport.context.buffer = this._viewport.canvas.buffer.getContext("2d", {alpha: false});
		this.size = size;


		this._viewport.canvas.main.addEventListener("touchmove", Events.handleTouchMove.bind(null, this),  {passive: false});
		this._viewport.canvas.main.addEventListener("touchstart", Events.handleTouchStart.bind(null, this),  {passive: false});
		this._viewport.canvas.main.addEventListener("touchend", Events.handleTouchEnd.bind(null, this), false);
		window.addEventListener("touchmove", Events.handleWindowTouchMove.bind(null, this), {passive: false});

		this._viewport.canvas.main.addEventListener("mousemove", Events.handleMouseMove.bind(null, this), {passive: false});
		this._viewport.canvas.main.addEventListener("mousedown", Events.handleMouseDown.bind(null, this, this._viewport.smuggler), false);
		this._viewport.canvas.main.addEventListener("mouseup", Events.handleMouseUp.bind(null, this, this._viewport.smuggler), false);
		this._viewport.canvas.main.addEventListener("resize", Events.handleResize.bind(null, this, this._viewport.smuggler), false);
		this._viewport.canvas.main.addEventListener("contextmenu", Events.handleRightMouseClick.bind(null, this), false);		// preventDefault
		this._viewport.canvas.main.addEventListener("dragstart", Events.handleDragStart.bind(null, this), false);				// preventDefault
		window.addEventListener("resize", Events.handleResize.bind(null, this, this._viewport.smuggler), false);
	}

	public link(source: string, destination: string): void
	{
		let s: any = this._drawables.map.get(source);
		let d: any = this._drawables.map.get(destination);
		if(!s)
			s = this._controls.map.get(source);
		if(!d)
			d = this._controls.map.get(destination);

		d.index = s.index;

		this.states.sorted = false;
	}

	public register(object: Drawable | Control | Component):  Drawable | Control | Component
	{
		object.context = this;

		return object;
	}

	public attach<Type>(object: Drawable | Control | Component | Group | DrawActions | MouseActions | HTMLElement): Type
	{
		if(object instanceof Drawable)
		{
			let guid: string = this.getGuidGenerator().create('1', 'a');
			let entry: any = this._drawables.set(guid, object);

			entry.context = this;
			entry.guid = guid;
			entry.fx = this._fx;
			entry.onAttach();
			this.states.sorted = false;
			
			return entry;
		}
		else if(object instanceof Control)
		{
			let guid: string = this.getGuidGenerator().create('1', 'b');
			let entry: any = this._controls.set(guid, object);

			entry.context = this;
			entry.guid = guid;
			entry.fx = this._fx;
			entry.onAttach();
			this.states.sorted = false;

			return entry;
		}
		else if(object instanceof Component)
		{
			let guid: string = this.getGuidGenerator().create('1', '9');
			let entry: any = this._components.set(guid, object);

			entry.context = this;
			entry.guid = guid;
			entry.fx = this._fx;
			entry.onAttach();

			return entry;
		}
		else if(object instanceof Group)
		{
			let guid: string = this.getGuidGenerator().create('1', '8');
			let entry: any = this._groups.set(guid, object);

			entry.context = this;
			entry.guid = guid;
			entry.onAttach();

			return entry;
		}
		else if(object instanceof DrawActions)
		{
			let guid: string = this.getGuidGenerator().create('2', 'a');
			let entry: any = this._drawActions.set(guid, object);

			entry.context = this;
			entry.guid = guid;
			entry.onAttach();

			return entry;
		}
		else if(object instanceof MouseActions)
		{
			let guid: string = this.getGuidGenerator().create('2', 'b');
			let entry: any = this._mouseActions.set(guid, object);

			entry.context = this;
			entry.guid = guid;
			entry.onAttach();

			return entry;
		}
		else if(object instanceof HTMLElement)
			object.appendChild(this._viewport.canvas.main);
		else
			throw new Error('Context.attach need either a Drawable/Control/Component/Group/DrawActions/MouseActions/HTMLElement type');
	}

	public detach(guids: Array<string> | string, restrict: Restrict.norefresh | Restrict.none = Restrict.norefresh): void
	{
		let guidlist: Array<string>;

		if(guids instanceof Array)
			guidlist = guids;
		else
			guidlist = new Array(guids)

		for(let guid of guidlist)
		{
			if(typeof guid != 'string')
				continue;

			let version = guid.charAt(14);
			let variant = guid.charAt(19);

			if(version == '1' && variant == 'a')
			{
				let drawable = this._drawables.get(guid);
				if(drawable && drawable.removable)
				{
					drawable.onDetach();
					drawable.context = undefined;
					drawable.guid = undefined;
					drawable.fx = undefined;
					this._drawables.delete(guid);
				}
			}
			else if(version == '1' && variant == 'b')
			{
				let control = this._controls.get(guid);
				if(control && control.removable)
				{
					control.onDetach();
					control.context = undefined;
					control.guid = undefined;
					control.fx = undefined;
					this._controls.delete(guid);
				}
			}
			else if(version == '1' && variant == '8')
			{
				let group = this._groups.get(guid);
				if(group)
				{
					group.onDetach();
					group.context = undefined;
					group.guid = undefined;
					this._groups.delete(guid);
				}
			}
			else if(version == '1' && variant == '9')
			{
				let component = this._components.get(guid);
				if(component)
				{
					component.onDetach();
					component.context = undefined;
					component.guid = undefined;
					component.fx = undefined;
					this._components.delete(guid);
				}
			}
			else if(version == '2' && variant == 'a')
			{
				let drawaction = this._drawActions.get(guid);
				if(drawaction)
				{
					drawaction.onDetach();
					drawaction.context = undefined;
					drawaction.guid = undefined;
					this._drawActions.delete(guid);
				}
			}
			else if(version == '2' && variant == 'b')
			{
				let mouseaction = this._mouseActions.get(guid);
				if(mouseaction)
				{
					mouseaction.onDetach();
					mouseaction.context = undefined;
					mouseaction.guid = undefined;
					this._mouseActions.delete(guid);
				}
			}
		}

		this.states.sorted = false;

		if(restrict == Restrict.none)
			this.refresh();
	}

	public get<Type extends Drawable | Control | Component | Group>(guid: string): Type
	{
		if(guid)
		{
			let version = guid.charAt(14);
			let variant = guid.charAt(19);

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
		window.requestAnimationFrame(() => this.draw());
	}

	/*
	private clearBuffer(): void
	{
		if(!this._attributes.features.nodefault)
		{
			this.context2D.font = this._attributes.font;
			this.context2D.strokeStyle = this._attributes.strokecolor;
			this.context2D.shadowBlur = this._attributes.shadow;
			this.context2D.shadowColor = this._attributes.shadowcolor;
			this.context2D.globalAlpha = this._attributes.alpha;
			this.context2D.lineWidth = this._attributes.linewidth;
		}
		this.context2D.imageSmoothingEnabled = false;
		this.context2D.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context2D.scale(this._attributes.scale, this._attributes.scale);
	}

	private fillMain(): void
	{
		let bitmap = this._viewport.canvas.buffer.transferToImageBitmap();
		this._viewport.context.main.transferFromImageBitmap(bitmap);
	}
	*/

	public drag(control: Control): void
	{
		if(this.states.drag)
		{
			if(control.restrict == Restrict.none)
			{
				control.drawable.matrix.e = this.states.pointer.current.x - this._viewport.smuggler.dragdiff.x;
				control.drawable.matrix.f = this.states.pointer.current.y - this._viewport.smuggler.dragdiff.y;

				control.drawable.matrix.e /= (window.devicePixelRatio * this.scale);
				control.drawable.matrix.f /= (window.devicePixelRatio * this.scale);
			}
			else if(control.restrict == Restrict.horizontal)
				control.drawable.matrix.e = this.states.pointer.current.x - this._viewport.smuggler.dragdiff.x;
			else if(control.restrict == Restrict.vertical)
				control.drawable.matrix.f = this.states.pointer.current.y - this._viewport.smuggler.dragdiff.y;

			if(!this.features.nosnapping && this.dragging.restrict == Restrict.ondrag)
			{
				control.drawable.matrix.e = Math.round((this.states.pointer.current.x - this._viewport.smuggler.dragdiff.x) / (this.dragging.grid.x || 1)) * (this.dragging.grid.x || 1);
				control.drawable.matrix.f = Math.round((this.states.pointer.current.y - this._viewport.smuggler.dragdiff.y) / (this.dragging.grid.y || 1)) * (this.dragging.grid.y || 1);
			}

			if(control.drawable.group)
			{
				let group: Group = this.get(control.drawable.group);

				[...group.map, ...group.enrolled].forEach((entry: any) => {
					entry[1].object.matrix.e = control.drawable.matrix.e - entry[1].object.points['origin'].x;
					entry[1].object.matrix.f = control.drawable.matrix.f - entry[1].object.points['origin'].y;
				});
			}

			this.draw(control);
			window.requestAnimationFrame(() => this.drag(control));
		}
	}

	public draw(control?: Control): void
	{
		if(!this.states.sorted)
		{
			//this._drawActions.sort();
			//this._mouseActions.sort();
			//this._components.sort();
			//this._groups.sort();
			this._drawables.sort();
			this._controls.reverse();
			this.states.sorted = true;
		}

		if(!this._attributes.features.nodefault)
		{
			this.context2D.font = this._attributes.font;
			this.context2D.strokeStyle = this._attributes.strokecolor;
			this.context2D.shadowBlur = this._attributes.shadow;
			this.context2D.shadowColor = this._attributes.shadowcolor;
			this.context2D.globalAlpha = this._attributes.alpha;
			this.context2D.lineWidth = this._attributes.linewidth;
		}
		this.context2D.imageSmoothingEnabled = false;

		//this.clearBuffer();

		this._drawActions.map.forEach((entry: any) => {
			if(entry.object.onDrawBefore)
				entry.object.onDrawBefore(this.context2D);
		});

		let length: number = this._drawables.sorted.length;
		let stickies: Array<{guid: string, map: Map<string, any>}> = this._drawables.sorted.filter(([guid, map]: any) =>
			map.object.sticky && map.object.visible
		);

		for(let i: number = 0; i < length; i++)
		{
			let drawable: Drawable = (<any>this._drawables.sorted[i])[1].object;

			if(control && this.states.drag && drawable.guid == control.drawable.guid)
			{
				this.context2D.save();
				control.onDrag();
				drawable.draw(this.context2D);
				this.context2D.restore();
			}

			else if(drawable.visible && !drawable.sticky &&
				drawable.matrix.e > -drawable.size.width && 
				drawable.matrix.e < this._viewport.canvas.buffer.width + drawable.size.width &&
				drawable.matrix.f > -drawable.size.height &&
				drawable.matrix.f < this._viewport.canvas.buffer.height + drawable.size.height)
			{
				drawable.draw(this.context2D);	
			}
		}

		for(let entry of stickies)
			(<any>entry)[1].object.draw(this.context2D);

		this._drawActions.map.forEach((entry: any) => {
			if(entry.object.onDrawAfter)
				entry.object.onDrawAfter(this.context2D);
		});

		let bitmap: ImageBitmap = this._viewport.canvas.buffer.transferToImageBitmap();
		this._viewport.context.main.transferFromImageBitmap(bitmap);
	}
	
	public setFocus(guid: string): void 
	{
		let focusControl: Control = this.get(guid);

		if(focusControl instanceof Control && guid != this.states.focussed)
		{
			if(this.states.focussed != undefined)
			{
				let unfocusControl: Control = this.get(this.states.focussed);

				if(unfocusControl instanceof Control)
					unfocusControl.onLostFocus();
			}

			this.states.focussed = guid;
			focusControl.onFocus();
		}
	}

	public removeFocus(): void 
	{
		if(this.states.focussed != undefined)
		{
			let unfocusControl: Control = this.get(this.states.focussed);

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

	public static near(map: Foundation.ExtendedMap, point: Point, radius: number, list: Array<string>)
	{
		let near: any = [...map.filter(([name, entry]: any) =>
			entry.object.x >= point.x - radius &&
			entry.object.y >= point.y - radius &&
			entry.object.x <= point.x + radius &&
			entry.object.y <= point.y + radius &&
			entry.object.visible != false &&
			!list.includes(entry.object.guid)
		)];

		for(let entry of near)
			list.push(entry[0]);

		for(let entry of near)
			this.near(map, new Point(entry[1].object.x, entry[1].object.y), radius, list);
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

	public get fillcolor(): string
	{
		return this._attributes.fillcolor;
	}
	public set fillcolor(fillcolor: string)
	{
		this._attributes.fillcolor = fillcolor;
	}

	public get strokecolor(): string
	{
		return this._attributes.strokecolor;
	}
	public set strokecolor(strokecolor: string)
	{
		this._attributes.strokecolor = strokecolor;
	}

	public get linewidth(): number
	{
		return this._attributes.linewidth;
	}
	public set linewidth(linewidth: number)
	{
		this._attributes.linewidth = linewidth;
	}

	public get alpha(): number
	{
		return this._attributes.alpha;
	}
	public set alpha(alpha: number)
	{
		this._attributes.alpha = alpha;
	}

	public get shadow(): number
	{
		return this._attributes.shadow;
	}
	public set shadow(shadow: number)
	{
		this._attributes.shadow = shadow;
	}

	public get shadowcolor(): string
	{
		return this._attributes.shadowcolor;
	}
	public set shadowcolor(shadowcolor: string)
	{
		this._attributes.shadowcolor = shadowcolor;
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

	public get smuggler(): any
	{
		return this._viewport.smuggler;
	}
}

