import * as decomp from '@extlib/poly-decomp';
import * as Interfaces from './interfaces/Interfaces.js';
import * as Enums from './enums/Enums.js';
import * as Drawables from './drawables/Drawables.js';
import {default as MatterJS} from '@extlib/matter';
import {Context} from './Context.js';
import {Control} from './Control.js';
import {Drawable} from './Drawable.js';
import {DrawAction} from './DrawAction.js';
import {DragAction} from './DragAction.js';
import {Point} from './Point.js';



export class Matter
{
	private _context: Context;
	private _entities: any[] = [];
	private _mouse: any;
	private _engine: any;
	private _runner: any;
	private _render: any;
	private _mouseConstraint: any;
	private _attributes: Interfaces.IMatter;
	//---

	public constructor(attributes: Interfaces.IMatter = {}) 
	{
		const {
			context = null,
			engine = {},
			render = {},
			runner = {},
			mouseConstraint = {},
			norender = false,
		} = attributes;

		this._context = context;
		this._attributes = {
			engine: engine,
			render: render,
			runner: runner,
			mouseConstraint: mouseConstraint,
			norender: norender
		};

		this.initMatter();
		this.initPaperless();
	}

	private initMatter(): void
	{
		this._engine = MatterJS.Engine.create({
			...{
				enableSleeping: true,
				positionIterations: 6,
				velocityIterations: 4,
				constraintIterations: 2,
				//gravity: {scale: 0, x: 0, y: 0}
			},
			...this._attributes.engine
		});

		this._mouse = MatterJS.Mouse.create(this._attributes.norender ? this._context.canvas : document.body);

		this._render = MatterJS.Render.create({
			...{
				element: document.body,
				engine: this._engine,
				mouse: this._mouse,
				options: {
					width: window.innerWidth,
					height: window.innerHeight,
					background: 'transparent',
					wireframes: false
				}
			},
			...this._attributes.render
		});

		this._runner = MatterJS.Runner.create({
			...{
				delta: 1000 / (60 * 10),
				maxFrameTime: 1000 / 50
			},
			...this._attributes.runner
		});

		this._mouseConstraint = MatterJS.Common.extend({
			...{
				type: 'mouseConstraint',
				mouse: this._mouse,
				element: null,
				body: null,
				constraint: MatterJS.Constraint.create({ 
					label: 'Mouse Constraint',
					pointA: this._mouse.position,
					pointB: { x: 0, y: 0 },
					length: 0.01, 
					stiffness: 0,
					angularStiffness: 0,
					render: {
						visible: false
					}
				}),
				collisionFilter: {
					category: 0x0001,
					mask: 0xFFFFFFFF,
					group: 0
				},
			},
			...this._attributes.mouseConstraint
		});

		if(!this._attributes.norender)
		{
			MatterJS.Events.on(this._engine, 'beforeUpdate', () => {
				const allBodies: any = MatterJS.Composite.allBodies(this._engine.world);

				MatterJS.MouseConstraint.update(this._mouseConstraint, allBodies);
				MatterJS.MouseConstraint._triggerEvents(this._mouseConstraint);
			});
		}
		
		if(this._attributes.norender)
		{
			this._mouseConstraint.mouse.element.removeEventListener("wheel", this._mouseConstraint.mouse.mousewheel);
			this._mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", this._mouseConstraint.mouse.mousewheel);
			this._mouseConstraint.mouse.element.removeEventListener("startdrag", this._mouseConstraint.mouse.startdrag);
			this._mouseConstraint.mouse.element.removeEventListener("enddrag", this._mouseConstraint.mouse.enddrag);
			this._mouseConstraint.mouse.element.removeEventListener("mousedown", this._mouseConstraint.mouse.mousedown);
			this._mouseConstraint.mouse.element.removeEventListener("mouseup", this._mouseConstraint.mouse.mouseup);
			this._mouseConstraint.mouse.element.removeEventListener("mousemove", this._mouseConstraint.mouse.mousemove);
			this._mouseConstraint.mouse.element.removeEventListener('touchmove', this._mouseConstraint.mouse.mousemove);
			this._mouseConstraint.mouse.element.removeEventListener('touchstart', this._mouseConstraint.mouse.mousedown);
			this._mouseConstraint.mouse.element.removeEventListener('touchend', this._mouseConstraint.mouse.mouseup);
		}
		this._mouseConstraint.mouse.element.addEventListener('mousemove', (event: HTMLElementEventMap['mousemove']) => { 
			const control: Control = this._context.get(this._context.states.pointer.control);

			if(this._context.states.drag)
			{
				if(control.restrict == Enums.Restrict.none)
				{
					this._mouse.position.x = this._context.states.pointer.current.x;
					this._mouse.position.y = this._context.states.pointer.current.y;
				}
				else if(control.restrict == Enums.Restrict.horizontal)
				{
					this._mouse.position.x = this._context.states.pointer.current.x;
				}
				else if(control.restrict == Enums.Restrict.vertical)
				{
					this._mouse.position.y = this._context.states.pointer.current.y;
				}
			}
			else
			{
				this._mouse.position.x = this._context.states.pointer.current.x;
				this._mouse.position.y = this._context.states.pointer.current.y;
			}
		});
		
		MatterJS.World.add(this._engine.world, this._mouseConstraint);
		
		MatterJS.Common.setDecomp(decomp);
		MatterJS.Runner.run(this._runner, this._engine);

		if(!this._attributes.norender)
			MatterJS.Render.run(this._render);
	}

	private initPaperless(): void
	{
		let position: Point;
		
		new DrawAction({
			context: this._context,
			onDrawBefore: () => {
				const awake: Interfaces.IMatterEntity[] = this._entities.filter((entity: any) => !entity.body.isSleeping);
				const limit: number = 25;

				awake.forEach((entity) => {
					entity.drawable.x = entity.body.position.x;
					entity.drawable.y = entity.body.position.y;
					entity.drawable.rad = entity.body.angle;
		
					if(entity.body.velocity.x > limit || entity.body.velocity.y > limit)
					{
						MatterJS.Body.setVelocity(entity.body, {
							x: Math.min(limit, Math.max(-limit, entity.body.velocity.x)),
							y: Math.min(limit, Math.max(-limit, entity.body.velocity.y)),
						});
					}
				});
			}
		});
		
		new DragAction({
			context: this._context,
			onDragBegin: () => {
				const control: Control = this._context.get(this._context.states.pointer.control);
				const bodies: any = MatterJS.Composite.allBodies(this._engine.world);
				const mouse: any = this._mouseConstraint.mouse;
				const constraint: any = this._mouseConstraint.constraint;
				let body: any = this._mouseConstraint.body;
		
				position = control.drawable.point;

				if(!constraint.bodyB) 
				{
					for(let i = 0; i < bodies.length; i++) 
					{
						body = bodies[i];
		
						if(MatterJS.Bounds.contains(body.bounds, mouse.position) && MatterJS.Detector.canCollide(body.collisionFilter, this._mouseConstraint.collisionFilter)) 
						{
							for(let j: number = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) 
							{
								const part = body.parts[j];
		
								if(MatterJS.Vertices.contains(part.vertices, mouse.position)) 
								{
									constraint.pointA = mouse.position;
									constraint.bodyB = this._mouseConstraint.body = body;
									constraint.pointB = {x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y};
									constraint.angleB = body.angle;
									constraint.bodyB.inertiaOld = constraint.bodyB.inertia;
		
									MatterJS.Body.setInertia(constraint.bodyB, Infinity);
									MatterJS.Sleeping.set(body, false);
		
									break;
								}
							}
						}
					}
				} 
				else 
				{
					MatterJS.Sleeping.set(constraint.bodyB, false);
					constraint.pointA = mouse.position;
				}
			},
			onDrag: () => {
				if(this._mouseConstraint.constraint.bodyB)
				{
					let adjust: {x: number, y: number} = {x: 0, y: 0};

					if(this._mouseConstraint.constraint.bodyB.bounds.min.x <= 0)
						adjust.x = -(this._mouseConstraint.constraint.bodyB.bounds.min.x - 1);
					else if(this._mouseConstraint.constraint.bodyB.bounds.max.x >= this._context.width)
						adjust.x = -(this._mouseConstraint.constraint.bodyB.bounds.max.x - this._context.width + 1);
			
					if(this._mouseConstraint.constraint.bodyB.bounds.min.y <= 0)
						adjust.y = -(this._mouseConstraint.constraint.bodyB.bounds.min.y - 1);
					else if(this._mouseConstraint.constraint.bodyB.bounds.max.y >= this._context.height)
						adjust.y = -(this._mouseConstraint.constraint.bodyB.bounds.max.y - this._context.height + 1);
			
					if(adjust.x != 0 || adjust.y != 0)
						MatterJS.Body.setPosition(this._mouseConstraint.constraint.bodyB, {x: this._mouseConstraint.constraint.bodyB.position.x + adjust.x, y: this._mouseConstraint.constraint.bodyB.position.y + adjust.y});
				}
			},
			onDragEnd: () => {
				if(this._mouseConstraint.constraint.bodyB)
					MatterJS.Body.setInertia(this._mouseConstraint.constraint.bodyB, this._mouseConstraint.constraint.bodyB.inertiaOld);
				else
				{
					const control: Control = this._context.get(this._context.states.pointer.control);

					control.drawable.x = position.x;
					control.drawable.y = position.y;
					console.log('Matter body not in sync with the Drawable');
				}

				this._mouseConstraint.constraint.bodyB = this._mouseConstraint.body = null;
				this._mouseConstraint.constraint.pointB = null;
			}	
		});
	}

	public Rectangle(body: Interfaces.IMatterBodyRectangle, drawable: Interfaces.IDrawableAttributes = {}): Interfaces.IMatterEntity
	{
		const b: any = MatterJS.Bodies.rectangle(body.point.x, body.point.y, body.size.width, body.size.height, {
			...body.options,
			...{
				render: {
					visible: this._attributes.norender ? false : true
				}
			}
		});
		const d: Drawables.Rectangle = new Drawables.Rectangle({
			...drawable,
			...{
				//context: this._context,
				point: {x: body.point.x, y: body.point.y},
				size: {width: body.size.width, height: body.size.height},
			}
		});

		MatterJS.World.add(this._engine.world, b);
	
		this._entities.push({
			drawable: d,
			body: b,
		});
	
		return {drawable: d,	body: b}
	}

	public Smiley(body: Interfaces.IMatterBodySmiley, drawable: Interfaces.IDrawableAttributes = {}): Interfaces.IMatterEntity
	{
		const b: any = MatterJS.Bodies.circle(body.point.x, body.point.y, body.radius, {
			...body.options,
			...{
				render: {
					visible: this._attributes.norender ? false : true
				}
			}
		}, body.sides);
		const d: Drawables.Smiley = new Drawables.Smiley({
			...drawable,
			...{
				context: this._context,
				point: {x: body.point.x, y: body.point.y},
				outerRadius: body.radius,
			}
		});
	
		MatterJS.World.add(this._engine.world, b);
	
		this._entities.push({
			drawable: d,
			body: b
		});
	
		return {drawable: d,	body: b}
	}
	public Hexagon(body: Interfaces.IMatterBodyHexagon, drawable: Interfaces.IDrawableAttributes = {}): Interfaces.IMatterEntity
	{
		const polygon: Interfaces.IMatterEntity = this.Polygon(
			{
				...body,
				...{
					sides: 6,
				}
			},
			drawable
		);

		return polygon;
	}

	public Arrow(body: Interfaces.IMatterBodyArrow, drawable: Interfaces.IDrawableAttributes = {}): Interfaces.IMatterEntity
	{
		const d: Drawables.Arrow = new Drawables.Arrow({
			...drawable,
			...{
				context: this._context,
				point: {x: body.point.x, y: body.point.y},
				size: {width: body.size.width, height: body.size.height},
				baseWidth: body.baseWidth,
				baseHeight: body.baseHeight,
			}
		});

		const b: any = MatterJS.Bodies.fromVertices(body.point.x, body.point.y, d.points);
		const center: {x: number, y: number} = MatterJS.Vertices.centre(d.points);

		MatterJS.Body.setCentre(b, {x: body.point.x - center.x, y: body.point.y - center.y});
		MatterJS.Body.setPosition(b, {x: body.point.x , y: body.point.y});
		MatterJS.World.add(this._engine.world, b);
	
		this._entities.push({
			drawable: d,
			body: b,
		});

		return {drawable: d,	body: b}
	}

	public Circle(body: Interfaces.IMatterBodyCircle, drawable: Interfaces.IDrawableAttributes = {}): Interfaces.IMatterEntity
	{
		const outerRadius: number = body.outerRadius || 25;
		const sides: number = body.sides || 25;
		
		let newsides = Math.ceil(Math.max(10, Math.min(sides, outerRadius)));

		if (newsides % 2 === 1)
			newsides += 1;

		const polygon: Interfaces.IMatterEntity = this.Polygon(
			{
				...body,
				...{
					sides: sides,
				}
			},
			drawable
		);

		return polygon;
	}

	public Polygon(body: Interfaces.IMatterBodyPolygon, drawable: Interfaces.IDrawableAttributes = {}): Interfaces.IMatterEntity
	{
		const outerRadius: number = body.outerRadius || 25;
		const innerRadius: number = body.innerRadius || 0;
		const angleStart: number = body.angleStart || 0;
		const angleEnd: number = body.angleEnd || 360;
		let sides: number = body.sides || 8;
		let vertices: {x: number, y: number}[] = [];
		let x: number;
		let y: number;

		for(let i: number = 0; i < (sides + 1); i++)
		{
			const angle: number = ((Math.PI / 180) * angleStart) + (i * ((Math.PI / 180) * (angleEnd - angleStart)) / sides);
		
			x = outerRadius * Math.cos(angle);
			y = outerRadius * Math.sin(angle)
			
			vertices.push({x: x, y: y});
		}

		if(innerRadius > 0)
		{
			for(let i: number = (sides); i >= 0; i--)
			{
				const angle: number = ((Math.PI / 180) * angleStart) + (i * ((Math.PI / 180) * (angleEnd - angleStart)) / sides);
			
				x = innerRadius * Math.cos(angle) ;
				y = innerRadius * Math.sin(angle) 
				vertices.push({x: x, y: y});
			}
		}
		
		const b: any = MatterJS.Bodies.fromVertices(body.point.x, body.point.y, vertices, {
			...body.options,
			...{
				render: {
					visible: this._attributes.norender ? false : true
				}
			} 
		}, undefined, undefined, undefined, innerRadius > 0 ? false : undefined);
		
		if(innerRadius > 0)
		{
			const center: {x: number, y: number} = MatterJS.Vertices.centre(vertices);
			MatterJS.Body.setCentre(b, {x: body.point.x - center.x, y: body.point.y - center.y});
		}

		const d: Drawables.Polygon = new Drawables.Polygon({
			...drawable,
			...{
				context: this._context,
				point: {x: body.point.x, y: body.point.y},
				outerRadius: outerRadius,
				innerRadius: innerRadius,
				angleStart: angleStart,
				angleEnd: angleEnd,
				sides: sides
			}
		});

		MatterJS.Body.setPosition(b, {x: body.point.x , y: body.point.y});
		MatterJS.World.add(this._engine.world, b);

		this._entities.push({
			drawable: d,
			body: b,
		});
	
		return {drawable: d,	body: b}
	}

	public Points(body: Interfaces.IMatterBodyVertices, drawable: Interfaces.IDrawableAttributes = {}): Interfaces.IMatterEntity
	{
		const points: Point[] = body.points || [];

		const b: any = MatterJS.Bodies.fromVertices(body.point.x, body.point.y, points, {
			...body.options,
			...{
				render: {
					visible: this._attributes.norender ? false : true
				}
			} 
		}, undefined, undefined, undefined, false);
		
		let d: Drawable;

		d = new (drawable.path ? Drawable : Drawables.Points)({
			...drawable,
			...{
				context: this._context,
				point: {x: body.point.x, y: body.point.y},
				points: points
			}
		});

		const center: {x: number, y: number} = MatterJS.Vertices.centre(points);
		MatterJS.Body.setCentre(b, {x: body.point.x - center.x, y: body.point.y - center.y});
		//MatterJS.Body.setCentre(b, {x: body.point.x, y: body.point.y });

		MatterJS.Body.setPosition(b, {x: body.point.x , y: body.point.y});
		MatterJS.World.add(this._engine.world, b);

		this._entities.push({
			drawable: d,
			body: b,
		});
	
		return {drawable: d,	body: b}
	}


	// Accessors
	// --------------------------------------------------------------------------

	public get MatterJS(): typeof MatterJS
	{
		return MatterJS;
	}

	public get context(): Context
	{
		return this._context;
	}

	public get engine(): any
	{
		return this._engine;
	}

	public get runner(): any
	{
		return this._runner;
	}

	public get mouse(): any
	{
		return this._mouse;
	}

	public get mouseConstraint(): any
	{
		return this._mouseConstraint;
	}
}
