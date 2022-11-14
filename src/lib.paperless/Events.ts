import {Point} from './Point.js';
import {Control} from './Control.js';
import {Group} from './Group.js';
import {Drawable} from './Drawable.js';
import {Context} from './Context.js';
import {Size} from './Size.js';

// types
//import {guid} from './Context.js';
import {stage} from './Context.js';



export class Events
{
	public static handleMouseMove(context: Context, stage: stage, event: HTMLElementEventMap['mousemove']): void
	{
		event.preventDefault();

		let isHovers: Array<{object: Control, refresh: boolean, sticky: boolean}> = [];
		let notHovers: Array<{object: Control, refresh: boolean}> = []
		let refresh: boolean = false;
		let cursor: Point = new Point(event.clientX * window.devicePixelRatio, event.clientY * window.devicePixelRatio, { scale: stage.view.scale });

		stage.cursor.last = stage.cursor.current;
		stage.cursor.current = cursor.toRealPosition(<HTMLElement>event.currentTarget);

		context.getExtendedMouseActions().map.forEach((entry: any) => {
			entry.object.onMouseMove(context);
		});
		
		// managing drawable hover
		if(!stage.states.drag)
		{
			let filtered: Array<{guid: string, map: Map<string, any>}> = context.getControls().filter(([guid, map]: any) =>
				(stage.cursor.radius ? (
					map.object.drawable.point.x + map.object.drawable.offset.x >= stage.cursor.current.x - stage.cursor.radius &&
					map.object.drawable.point.y + map.object.drawable.offset.y >= stage.cursor.current.y - stage.cursor.radius &&
					map.object.drawable.point.x + map.object.drawable.offset.x <= stage.cursor.current.x + stage.cursor.radius &&
					map.object.drawable.point.y + map.object.drawable.offset.y <= stage.cursor.current.y + stage.cursor.radius ) : true) &&
				map.object.drawable ? map.object.drawable.visible == true : true
			);

			filtered.forEach((map: any) => {
				let control: Control = map[1].object;

				if(control.drawable)
				{
					if(control.drawable.isHover(stage.cursor.current))
					{
						if(!control.drawable.hover && control.drawable.hoverable)
							refresh = true;

						isHovers.push({ object: control, refresh: !control.drawable.hover ? true : false, sticky: control.drawable.sticky});
						control.drawable.hover = true;
					}
					else
					{
						if(control.drawable.hover && control.drawable.hoverable)
							refresh = true;

						notHovers.push({ object: control, refresh: control.drawable.hover ? true : false });
						control.drawable.hover = false;
					}
				}
			});

			for(let entry of notHovers)
			{
				if(entry.refresh)
					entry.object.onOutside();
			}

			if(isHovers.length > 0)
			{
				let sticky: Array<{object: Control, refresh: boolean, sticky: boolean}> = isHovers.filter(drawable => drawable.sticky == true);
				let nosticky: Array<{object: Control, refresh: boolean, sticky: boolean}> = isHovers.filter(drawable => drawable.sticky == false);

				if(sticky.length > 0)
				{
					stage.cursor.control = sticky[0].object.guid;
					sticky[0].object.onInside();
				}
				else
				{
					stage.cursor.control = nosticky[0].object.guid;
					nosticky[0].object.onInside();
				}
			}
			else
				stage.cursor.control = undefined;
		}

		if(refresh)
			context.refresh();
	}

	public static handleMouseDown(context: Context, stage: stage, event: HTMLElementEventMap['mousedown']): void
	{
		event.preventDefault();

		stage.cursor.clicked = new Point(stage.cursor.current.x - stage.view.offset, stage.cursor.current.y - stage.view.offset);
		stage.states.mousedown = true;

		context.getExtendedMouseActions().map.forEach((entry: any) => {
			entry.object.onMouseDown(context);
		});

		if(event.button == 0 && stage.cursor.control && !stage.states.drag)
		{
			let control: Control = context.get(stage.cursor.control);

			if(control)
			{
				let drawable: Drawable = control.drawable;
				let group: Group = context.get(drawable.group);

				if(control.movable && control.enabled)
				{
					stage.drag.timeout = setTimeout(() => {
						window.cancelAnimationFrame(stage.view.idAnimationFrame);

						if(drawable.isHover(stage.cursor.current))
						{
							stage.states.drag = true;

							//stage.view.animated.push(drawable.guid);
							
							if(group)
							{
								group.map.forEach((entry: any) => {
									//if(entry[0] != drawable.guid)
									{
										entry[1].object.origin = new Point(drawable.point.x - entry[1].object.point.x, drawable.point.y - entry[1].object.point.y);

										//stage.view.animated.push(entry[0]);
										//stage.drag.excluded.push(entry[0]);
									}
								});
							}
							//else
								//stage.drag.excluded.push(drawable.guid);


							context.draw();
							stage.drag.diff = new Point(stage.cursor.current.x - drawable.point.x, stage.cursor.current.y - drawable.point.y);

							if(group)
							{
								let filtered: Array<{guid: string, map: Map<string, any>}> = context.getDrawables().filter(([guid, map]: any) =>
									map.object.group == group.guid 
								);
								filtered.forEach((map: any) => {
									map[1].object.toFront();
								});
							}
							else
								drawable.toFront();

							context.setFocus(control.guid);
							control.onDragBegin();
							stage.drag.interval = setInterval(context.drag.bind(null, context, control), stage.drag.rate);
						}
					}, stage.drag.delay);
				}
			}
		}
	}

	public static handleMouseUp(context: Context, stage: stage, event: HTMLElementEventMap['mouseup']): void
	{
		event.preventDefault();

		window.clearTimeout(stage.drag.timeout);
		window.clearInterval(stage.drag.interval);

		let control: Control = context.getControls().get(stage.cursor.control);
/*
		if(stage.states.drag && stage.drag.snapping)
		{
			control.drawable.point = new Point(
				Math.round((stage.cursor.current.x - stage.drag.diff.x) / stage.drag.snapping) * stage.drag.snapping,
				Math.round((stage.cursor.current.y - stage.drag.diff.y) / stage.drag.snapping) * stage.drag.snapping
			);
		}
*/

		context.getExtendedMouseActions().map.forEach((entry: any) => {
			entry.object.onMouseUp(context);
		});

		if(control instanceof Control)
		{
			context.setFocus(control.guid);
			
			if(!stage.states.drag && stage.cursor.control && stage.states.mousedown)
			{
				if(event.button == 0 && control.enabled && control.drawable.visible)
				{
					if(control.focusable)
						context.setFocus(control.guid);
						
						control.onLeftClick();
				}
				else if(event.button == 2 && control.enabled && control.drawable.visible)
					control.onRightClick();
			}
			else if(stage.states.drag)
				control.onDragEnd();
		}

		stage.states.mousedown = false;
		stage.states.drag = false;

		//let index: number = stage.view.animated.indexOf(stage.drag.excluded);
		//if (index !== -1)
		//	stage.view.animated.splice(index, 1);
		//stage.view.animated = [];
		//stage.drag.excluded = [];

		context.refresh();
	}

	public static handleResize(context: Context, stage: stage, event: HTMLElementEventMap['resize']): void
	{
		event.preventDefault();

		if(stage.view.autosize)
		{
			clearTimeout(stage.view.idResizing);
			stage.view.idResizing = setTimeout(() => { 
				let oldsize = new Size(context.size.width, context.size.height);

				context.size = new Size(window.innerWidth, window.innerHeight);
				
				let drawables: Array<{guid: string, map: Map<string, any>}> = context.getDrawables().filter(([guid, map]: any) =>
					map.object.visible && 
					map.object.boundaries &&
					(
						map.object.boundaries.bottomright.x >= oldsize.width ||
						map.object.boundaries.bottomright.x >= context.size.width ||
						map.object.boundaries.bottomright.y >= oldsize.height ||
						map.object.boundaries.bottomright.y >= context.size.height 
					)
				);
				
				drawables.forEach((map: any) => {
					map[1].object.onResize();
				});
				
//onsole.log(context.getComponents(), size);
/*
				let components: Array<{guid: guid, map: Map<string, any>}> = context.getComponents().filter(([guid, map]: any) =>
					map.object.point.x + map.object.size.width > context.size.width &&
					map.object.point.y + map.object.size.height > context.size.height
				);
				console.log(components)
				components.forEach((map: any) => {
					map[1].object.onResize();
				});
*/
			}, 250);
		}
	}

	public static handleRightMouseClick(context: Context, stage: stage, event: HTMLElementEventMap['mousedown']): void
	{
		event.preventDefault();
	}

	public static handleDragStart(context: Context, stage: stage, event: HTMLElementEventMap['dragstart']): void
	{
		// Remove default action to avoid dragging the canvas
		event.preventDefault();
	}
}
