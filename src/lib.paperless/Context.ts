import * as Foundation from '@zone09.net/foundation';
import {Point} from './Point.js';
import {Size} from './Size.js';
import {Events} from './Events.js';
import {Drawable} from './Drawable.js';
import {Control} from './Control.js';
import {Component} from './Component.js';
import {Group} from './Group.js';
import {DrawActions} from './interfaces/DrawActions.js';
import {MouseActions} from './interfaces/MouseActions.js';
import {Fx} from './Fx.js';



interface IAttributes {
	stageScale?: number,
	stageSize?: Size,
	stageOffset?: number,
	autosize?: boolean,
	dragRate?: number,
	dragDelay?: number,
	dragOffset?: number
	dragSnapping?: number,
}

type view = {
	canvas: {
		buffer: HTMLCanvasElement,
		main: HTMLCanvasElement
	},
	context:  {
		buffer: CanvasRenderingContext2D,
		main: CanvasRenderingContext2D
	},
	/*
	main: {
		canvas: HTMLCanvasElement,
		context: CanvasRenderingContext2D,
	},
	buffer: {
		canvas: HTMLCanvasElement,
		context: CanvasRenderingContext2D,
	},
	*/
	size: Size,
	autosize: boolean,
	offset: number,
	scale: number,
	idResizing: number,
	idAnimationFrame: number,
	//animated: Array<string>,
}

type cursor = {
	current: Point,
	last: Point,
	clicked: Point,
	control: string,
	radius: number
}

type drag = {
	rate: number,
	delay: number,
	offset: number,
	snapping: number,
	diff: Point,
	timeout: number,
	interval: number,
	//excluded: Array<string>
}

type states = {
	mobile: boolean,
	mousedown: boolean,
	drag: boolean,
	focussed: string
}

export type stage = {
	view: view,
	cursor: cursor,
	drag: drag,
	states: states
}



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
	private _stage: stage;
	//---

	public constructor(attributes: IAttributes = {})
	{
		const {
			stageScale = 1,
			stageSize = new Size(window.innerWidth, window.innerHeight),
			stageOffset = 0,
			autosize = false,
			dragRate = 20,
			dragDelay = 180,
			dragOffset = 0,
			dragSnapping = 0
		} = attributes;

		this._stage = {
			view: {
				canvas: {
					buffer: document.createElement("canvas"),
					main: document.createElement("canvas")
				},
				context: {
					buffer: undefined,
					main: undefined
				},
				/*
				main: {
					canvas: document.createElement("canvas"),
					context: undefined,
				},
				buffer: {
					canvas: document.createElement("canvas"),
					context: undefined,
				},
				*/
				size: new Size(stageSize.width, stageSize.height),
				autosize: autosize,
				offset: stageOffset,
				scale: stageScale,
				idResizing: undefined,									// setInterval id for resize event (interna)
				idAnimationFrame: undefined,							// window.requestAnimationFrame id (internal) 
				//animated: [],
			},
			cursor: {
				current: new Point(-1, -1),               		// current mouse position
				last: new Point(-1, -1),                        // last mouse position
				clicked: new Point(-1, -1),                     // last clicked mouse position
				control: undefined,                             // control below mouse pointer when moving and clicking (internal)
				radius: undefined                               // radius around pointer for the controls filter (internal)
			},
			drag: {
				rate: dragRate,                                 // interval of drag redraw
				delay: dragDelay,                               // timeout on hold mouse button to drag
				offset: dragOffset,                             // offset to redraw from background when dragging
				snapping: dragSnapping,                         // snapping pixel to drop when mouseup
				diff: undefined,                                // mouse x,y difference from center of object when dragging (internal)
				timeout: undefined,                             // setTimeout id for dragging (internal)
				interval: undefined,                            // setInterval id for dragging (internal)
				//excluded: []
			},
			states: {
				mobile: false,
				mousedown: false,
				drag: false,
				focussed: undefined
			}
		}

		this._stage.view.context.main = this._stage.view.canvas.main.getContext("2d");
		this._stage.view.context.buffer = this._stage.view.canvas.buffer.getContext("2d");
		this.size = this._stage.view.size;

		this._stage.view.canvas.main.addEventListener("mousemove", Events.handleMouseMove.bind(null, this, this._stage), false);
		this._stage.view.canvas.main.addEventListener("mousedown", Events.handleMouseDown.bind(null, this, this._stage), false);
		this._stage.view.canvas.main.addEventListener("mouseup", Events.handleMouseUp.bind(null, this, this._stage), false);
		this._stage.view.canvas.main.addEventListener("resize", Events.handleResize.bind(null, this, this._stage), false);
		this._stage.view.canvas.main.addEventListener("contextmenu", Events.handleRightMouseClick.bind(null, this, this._stage), false);		// preventDefault
		this._stage.view.canvas.main.addEventListener("dragstart", Events.handleDragStart.bind(null, this, this._stage), false);				// preventDefault
		window.addEventListener("resize", Events.handleResize.bind(null, this, this._stage), false);

		this.refresh();
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

		this._drawables.sort();
		this._controls.reverse();
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

			if(!this._drawables.has(guid))
			{
				let entry: any = this._drawables.set(guid, object);

				entry.context = this;
				entry.guid = guid;
				entry.fx = this._fx;
				entry.onAttach();

				return entry;
			}
			else
				throw new Error('Context.attach, drawable guid not unique');
		}
		else if(object instanceof Control)
		{
			let guid: string = this.getGuidGenerator().create('1', 'b');

			if(!this._controls.has(guid))
			{
				let entry: any = this._controls.set(guid, object);

				entry.context = this;
				entry.guid = guid;
				entry.fx = this._fx;
				entry.onAttach();

				return entry;
			}
			else
				throw new Error('Context.attach, control guid not unique');
		}
		else if(object instanceof Component)
		{
			let guid: string = this.getGuidGenerator().create('1', '9');

			if(!this._components.has(guid))
			{
				let entry: any = this._components.set(guid, object);

				entry.context = this;
				entry.guid = guid;
				entry.fx = this._fx;
				entry.onAttach();

				return entry;
			}
			else
				throw new Error('Context.attach, component guid not unique');
		}
		else if(object instanceof Group)
		{
			let guid: string = this.getGuidGenerator().create('1', '8');

			if(!this._groups.has(guid))
			{
				let entry: any = this._groups.set(guid, object);

				entry.context = this;
				entry.guid = guid;
				entry.onAttach();

				return entry;
			}
			else
				throw new Error('Context.attach, group guid not unique');
		}
		else if(object instanceof DrawActions)
		{
			let guid: string = this.getGuidGenerator().create('2', 'a');

			if(!this._drawActions.has(guid))
			{
				let entry: any = this._drawActions.set(guid, object);

				entry.context = this;
				entry.guid = guid;
				entry.onAttach();

				return entry;
			}
			else
				throw new Error('Context.attach, drawaction guid not unique');
		}
		else if(object instanceof MouseActions)
		{
			let guid: string = this.getGuidGenerator().create('2', 'b');

			if(!this._mouseActions.has(guid))
			{
				let entry: any = this._mouseActions.set(guid, object);

				entry.context = this;
				entry.guid = guid;
				entry.onAttach();

				return entry;
			}
			else
				throw new Error('Context.attach, mouseaction guid not unique');
		}
		else if(object instanceof HTMLElement)
			object.appendChild(this._stage.view.canvas.main);
		else
			throw new Error('Context.attach need either a Drawable/Control/Component/Group/DrawActions/MouseActions/HTMLElement type');
	}

	public detach(guids: Array<string> | string): void
	{
		let guidlist: Array<string>;

		if(guids instanceof Array)
			guidlist = guids;
		else
			guidlist = new Array(guids)

		for(let guid of guidlist)
		{
			let version = guid.charAt(14);
			let variant = guid.charAt(19);

			if(version == '1' && variant == 'a')
			{
				let drawable = this._drawables.get(guid);
				if(drawable && drawable.removable)
				{
					drawable.onDetach();
					this._drawables.delete(guid);
				}
			}
			else if(version == '1' && variant == 'b')
			{
				let control = this._controls.get(guid);
				if(control && control.removable)
				{
					control.onDetach();
					this._controls.delete(guid);
				}
			}
			else if(version == '1' && variant == '8')
			{
				let group = this._groups.get(guid);
				if(group)
				{
					group.onDetach();
					this._groups.delete(guid);
				}
			}
			else if(version == '1' && variant == '9')
			{
				let component = this._components.get(guid);
				if(component)
				{
					component.onDetach();
					this._components.delete(guid);
				}
			}
			else if(version == '2' && variant == 'a')
			{
				let drawaction = this._drawActions.get(guid);
				if(drawaction)
				{
					drawaction.onDetach();
					this._drawActions.delete(guid);
				}
			}
			else if(version == '2' && variant == 'b')
			{
				let mouseaction = this._mouseActions.get(guid);
				if(mouseaction)
				{
					mouseaction.onDetach();
					this._mouseActions.delete(guid);
				}
			}
		}

		this._drawActions.sort();
		this._mouseActions.sort();
		this._components.sort();
		this._groups.sort();
		this._drawables.sort();
		this._controls.reverse();
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
		this._stage.view.idAnimationFrame = window.requestAnimationFrame(() => this.draw());
	}

	private clearBuffer(): void
	{
		this._stage.view.context.buffer.clearRect(-this._stage.view.offset, -this._stage.view.offset, this._stage.view.canvas.main.width + this._stage.view.offset, this._stage.view.canvas.main.height + this._stage.view.offset);
		this._stage.view.context.buffer.scale(this._stage.view.scale, this._stage.view.scale);
	}

	private fillMain(): void
	{
		this._stage.view.context.main.clearRect(-this._stage.view.offset, -this._stage.view.offset, this._stage.view.canvas.main.width + this._stage.view.offset, this._stage.view.canvas.main.height + this._stage.view.offset);
		this._stage.view.context.main.drawImage(this._stage.view.canvas.buffer, 0, 0);
	}

	public drag(context: Context, control: Control): void
	{
		let stickies: Array<Drawable> = [];
		let grouped: Array<Drawable> = [];

		context.clearBuffer();

		if(control.movement == undefined)
		{
			//control.drawable.point = new Point(context._stage.cursor.current.x - context._stage.drag.diff.x, context._stage.cursor.current.y - context._stage.drag.diff.y);
			control.drawable.point.x = context._stage.cursor.current.x - context._stage.drag.diff.x;
			control.drawable.point.y = context._stage.cursor.current.y - context._stage.drag.diff.y;
		}
		else if(control.movement == 'horizontal')
		{
			//control.drawable.point = new Point(context._stage.cursor.current.x - context._stage.drag.diff.x, control.drawable.point.y);
			control.drawable.point.x = context._stage.cursor.current.x - context._stage.drag.diff.x;
		}
		else if(control.movement == 'vertical')
		{
			//control.drawable.point = new Point(control.drawable.point.x, context._stage.cursor.current.y - context._stage.drag.diff.y);
			control.drawable.point.y = context._stage.cursor.current.y - context._stage.drag.diff.y;
		}
			

		if(control.drawable.group)
		{
			let group: Group = context.get(control.drawable.group);

			group.map.forEach((entry: any) => {
				//entry[1].object.point = new Point(control.drawable.point.x - entry[1].object.origin.x, control.drawable.point.y - entry[1].object.origin.y);
				entry[1].object.point.x = control.drawable.point.x - entry[1].object.origin.x;
				entry[1].object.point.y = control.drawable.point.y - entry[1].object.origin.y;
				grouped.push(entry[1].object);
			});
		}

		context._drawables.sorted.forEach((entry: any) => {
			if(entry[1].object.visible/* && !grouped.includes(entry[1].object)*/)
			{
				if(entry[1].object.sticky)
					stickies.push(entry[1].object);
				else
				{
					context._stage.view.context.buffer.save();
					
					if(entry[1].object.guid == control.drawable.guid)
						control.onDrag();

					entry[1].object.draw(context._stage.view.context.buffer);
					context._stage.view.context.buffer.restore();
				}
			}
		});

		for(let drawable of [...grouped, ...stickies])
		{
			context._stage.view.context.buffer.save();
			
			if(drawable.guid == control.drawable.guid)
				control.onDrag();

			drawable.draw(context._stage.view.context.buffer);
			context._stage.view.context.buffer.restore();
		}

		//for(let drawable of stickies)
		//	drawable.draw(context._stage.view.context.buffer);

		context.fillMain();

		/*

		context.clearBuffer();

		if(control.movement == undefined)
			control.drawable.point = new Point(context._stage.cursor.current.x - context._stage.drag.diff.x, context._stage.cursor.current.y - context._stage.drag.diff.y);
		else if(control.movement == 'horizontal')
			control.drawable.point = new Point(context._stage.cursor.current.x - context._stage.drag.diff.x, control.drawable.point.y);
		else if(control.movement == 'vertical')
			control.drawable.point = new Point(control.drawable.point.x, context._stage.cursor.current.y - context._stage.drag.diff.y);

		
		//control.drawable.generate();

		if(control.drawable.group)
		{
			let group: Group = context.get(control.drawable.group);

			group.map.forEach((entry: any) => {
				//if(entry[0] != control.drawable.guid)
				{
					entry[1].object.point = new Point(control.drawable.point.x - entry[1].object.origin.x, control.drawable.point.y - entry[1].object.origin.y);
					//entry[1].object.generate();
				}
			});
		}

		context._drawables.sorted.forEach((entry: any) => {
			if(entry[1].object.visible)
			{
				if(context._stage.drag.excluded.includes(entry[0]))
				{
					context._stage.view.context.buffer.save();
					control.onDrag();
					entry[1].object.draw(context._stage.view.context.buffer);
					context._stage.view.context.buffer.restore();
				}
				else
				{
					if(entry[1].object.visible && entry[1].object.autodraw && !entry[1].object.sticky)
						entry[1].object.draw(context._stage.view.context.buffer);
				}
			}
		});

		context._drawables.sorted.forEach((entry: any) => {
			if(entry[1].object.sticky)
				entry[1].object.draw(context._stage.view.context.buffer);
		});
			
		context.fillMain();
		*/		
	}

	public draw(): void
	{
		let drawables: Array<Drawable> = [];

		this.clearBuffer();

		this._drawActions.map.forEach((entry: any) => {
			if(entry.object.onDrawBefore)
				entry.object.onDrawBefore(this._stage.view.context.buffer);
		});

		this._drawables.sorted.forEach((entry: any) => {
			if((!this._stage.states.drag /*|| !this._stage.view.animated.includes(entry[0])*/) && entry[1].object.visible && entry[1].object.autodraw)
			{
				if(entry[1].object.point.x > -entry[1].object.size.width &&
					entry[1].object.point.x < this._stage.view.canvas.buffer.width + entry[1].object.size.width &&
					entry[1].object.point.y > -entry[1].object.size.height &&
					entry[1].object.point.y < this._stage.view.canvas.buffer.height + entry[1].object.size.height)
				{
					if(entry[1].object.sticky)
						drawables.push(entry[1].object);
					else
						entry[1].object.draw(this._stage.view.context.buffer);
				}
			}
		});

		for(let drawable of drawables)
			drawable.draw(this._stage.view.context.buffer);

		if(!this._stage.states.drag)
		{
			this._drawActions.map.forEach((entry: any) => {
				if(entry.object.onDrawAfter)
					entry.object.onDrawAfter(this._stage.view.context.buffer);
			});

			this.fillMain();
		}
	}

	public static near(map: Foundation.ExtendedMap, point: Point, radius: number, list: Array<string>)
	{
		let near: any = [...map.filter(([name, entry]: any) =>
			entry.object.point.x >= point.x - radius &&
			entry.object.point.y >= point.y - radius &&
			entry.object.point.x <= point.x + radius &&
			entry.object.point.y <= point.y + radius &&
			entry.object.visible != false &&
			!list.includes(entry.object.guid)
		)];

		for(let entry of near)
			list.push(entry[0]);

		for(let entry of near)
			this.near(map, entry[1].object.point, radius, list);
	}

	public setFocus(guid: string): void 
	{
		let focusControl: Control = this.get(guid);

		if(focusControl instanceof Control && guid != this._stage.states.focussed)
		{
			if(this._stage.states.focussed != undefined)
			{
				let unfocusControl: Control = this.get(this._stage.states.focussed);

				if(unfocusControl instanceof Control)
					unfocusControl.onLostFocus();
			}

			this._stage.states.focussed = guid;
			focusControl.onFocus();
		}
	}

	public removeFocus(): void 
	{
		if(this._stage.states.focussed != undefined)
		{
			let unfocusControl: Control = this.get(this._stage.states.focussed);

			if(unfocusControl instanceof Control)
				unfocusControl.onLostFocus();

			this._stage.states.focussed = undefined;
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

	public getStates(): {pointCurrent: Point, pointLast: Point, pointClicked: Point, pointDragMouseOffset: Point, currentControl: string, focussed: string, isMobile: boolean, isDragging: boolean}
	{
		return {
			pointCurrent: this._stage.cursor.current,
			pointLast: this._stage.cursor.last,
			pointClicked: this._stage.cursor.clicked,
			pointDragMouseOffset: this._stage.drag.diff,
			currentControl: this._stage.cursor.control,
			focussed: this._stage.states.focussed,
			isMobile: this._stage.states.mobile,
			isDragging: this._stage.states.drag,
		};
	}

	public getStage(): {size: Size, scale: number, offset: number, snapping: number}
	{
		return {
			size: this.size,
			scale: this._stage.view.scale,
			offset: this._stage.view.offset,
			snapping: this._stage.drag.snapping,
			//renderingEngine: this._stage.view.render
		};
	}



	// Accessors
	// --------------------------------------------------------------------------

	/**
	 * Gets the current DOM canvas that is being used by Paperless.
	 */
	public get canvas(): HTMLCanvasElement
	{
		return this._stage.view.canvas.main;
	}

	/**
	 * Gets the CanvasRenderingContext2D objet of the canvas. Paperless is using a buffer so this accessor always return the buffer context.
	 */
	public get context2D(): CanvasRenderingContext2D
	{
		return this._stage.view.context.buffer;
	}

	/**
	 * Gets the [[Fx]] instance of the Context.
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
		return this._stage.view.size;
	}
	/**
	 * Sets the [[Size]] of the Context instance. When setted, both main and buffer canvas are setted with new width and height values. 
	 * A call to [[refresh]] is also made to update the Context.
	 */
	public set size(size: Size)
	{
		let ratio: number = window.devicePixelRatio;

		this._stage.view.size = size;

		this._stage.view.canvas.main.width = (size.width + (this._stage.view.offset * 2)) * ratio;
		this._stage.view.canvas.main.height = (size.height + (this._stage.view.offset * 2)) * ratio;
		this._stage.view.canvas.buffer.width = (size.width + (this._stage.view.offset * 2)) * ratio;
		this._stage.view.canvas.buffer.height = (size.height + (this._stage.view.offset * 2)) * ratio;

		this._stage.view.canvas.main.style.width = this._stage.view.canvas.main.width / ratio + 'px';
		this._stage.view.canvas.main.style.height = this._stage.view.canvas.main.height / ratio + 'px';
		this._stage.view.canvas.buffer.style.width = this._stage.view.canvas.buffer.width / ratio + 'px';
		this._stage.view.canvas.buffer.style.height = this._stage.view.canvas.buffer.height / ratio + 'px';

		this._stage.view.context.buffer.translate(this._stage.view.offset, this._stage.view.offset);
		this.refresh();
	}

	/**
	 * Gets the current offset of the Context in pixels.
	 */
	public get offset(): number
	{
		return this._stage.view.offset;
	}
	/**
	 * Sets the current Context pixels offset. When calling this accessor a call to set [[size]] accessor is also made to reflect the change.
	 * 
	 * @todo						Add a callback to Drawable.onOffsetChange() 
	 * @fixme					When dragging, need to validate point because we can drag inside offset.
	 */
	public set offset(offset: number)
	{
		this._stage.view.offset = offset;
		this.size = this._stage.view.size;
	}
}

