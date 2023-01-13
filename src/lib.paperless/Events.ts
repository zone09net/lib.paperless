import {Point} from './Point.js';
import {Control} from './Control.js';
import {Group} from './Group.js';
import {Drawable} from './Drawable.js';
import {Context} from './Context.js';
import {Size} from './Size.js';



export class Events
{
	public static handleMouseMove(context: Context, event: HTMLElementEventMap['mousemove']): void
	{
		event.preventDefault();

		let refresh: boolean = false;
		let pointer: Point = new Point(event.clientX, event.clientY, { scale: window.devicePixelRatio * context.scale });

		context.states.pointer.last = context.states.pointer.current;
		context.states.pointer.current = pointer.toRealPosition(<HTMLElement>event.currentTarget);

		context.getExtendedMouseActions().map.forEach((entry: any) => {
			entry.object.onMouseMove(context);
		});

		if(!context.states.drag && !context.features.nohover)
		{
			let stickies: Array<{guid: string, map: Map<string, any>}> = context.getControls().sorted.filter(([guid, map]: any) =>
				map.object.drawable.sticky
			);

			let controls = [...stickies, ...context.getControls().sorted];
			let length: number = controls.length;

			for(let i: number = 0; i < length; i++)
			{
				let control: Control = (<any>controls[i])[1].object;

				if(control.drawable && control.drawable.hoverable)
				{
					if(control.drawable.isHover(context.states.pointer.current))
					{
						if(context.states.pointer.control == control.guid)
							break;
						else
						{
							let unhover: Control = context.get(context.states.pointer.control);

							if(unhover)
							{
								unhover.drawable.hover = false;
								unhover.onOutside();
							}
							
							context.states.pointer.control = control.guid;
							control.drawable.hover = true;
							control.onInside();
						}

						refresh = true;
						break;
					}
					else
					{
						if(context.states.pointer.control == control.guid)
						{
							refresh = true;
							context.states.pointer.control = undefined;
							control.drawable.hover = false;
							control.onOutside();
						}
					}
				}
			}
		}

		if(refresh && !context.fx.id)
			context.refresh();
	}

	public static handleMouseDown(context: Context, smuggler: any, event: HTMLElementEventMap['mousedown']): void
	{
		context.canvas.dispatchEvent(new MouseEvent("mousemove", {
			view: event.view,
			bubbles: true,
			cancelable: true,
			clientX: event.clientX,
			clientY: event.clientY
		}));

		event.preventDefault();

		context.states.pointer.clicked = new Point(context.states.pointer.current.x, context.states.pointer.current.y, { scale: 1 });
		context.states.mousedown = true;

		context.getExtendedMouseActions().map.forEach((entry: any) => {
			entry.object.onMouseDown(context);
		});

		if(event.button == 0 && context.states.pointer.control && !context.states.drag)
		{
			let control: Control = context.get(context.states.pointer.control);

			if(control)
			{
				let drawable: Drawable = control.drawable;
				let group: Group = context.get(drawable.group);

				if(control.movable && control.enabled)
				{
					smuggler.id.dragging = setTimeout(() => {
						if(drawable.isHover(context.states.pointer.current))
						{
							context.states.drag = true;
							//(<any>drawable.points)['dragdiff'] = new Point(context.states.pointer.current.x - drawable.matrix.e, context.states.pointer.current.y - drawable.matrix.f);
							smuggler.dragdiff = new Point((context.states.pointer.current.x / context.scale / window.devicePixelRatio) - drawable.matrix.e, (context.states.pointer.current.y / context.scale / window.devicePixelRatio) - drawable.matrix.f, { scale: context.scale * window.devicePixelRatio });

							if(group)
							{
								[...group.map, ...group.enrolled].forEach((entry: any) => {
									entry[1].object.points['origin'] = new Point(drawable.matrix.e - entry[1].object.matrix.e, drawable.matrix.f - entry[1].object.matrix.f, { scale: 1 });
								});
							}

							drawable.toFront();
							context.setFocus(control.guid);
							control.onDragBegin();
							context.drag(control);
							//window.requestAnimationFrame(() => context.drag(control));
						}
					}, context.dragging.delay);
				}
			}
		}
	}

	public static handleMouseUp(context: Context, smuggler: any, event: HTMLElementEventMap['mouseup']): void
	{
		event.preventDefault();
		window.clearTimeout(smuggler.id.dragging);

		let control: Control = context.getControls().get(context.states.pointer.control);
		
		/*
		if(stage.states.drag && stage.drag.snapping)
		{
			control.drawable.matrix.e = Math.round((context.states.pointer.current.x - stage.drag.diff.x) / stage.drag.snapping) * stage.drag.snapping;
			control.drawable.matrix.f = Math.round((context.states.pointer.current.y - stage.drag.diff.y) / stage.drag.snapping) * stage.drag.snapping;
		}
		*/

		context.getExtendedMouseActions().map.forEach((entry: any) => {
			entry.object.onMouseUp(context);
		});

		if(control instanceof Control)
		{
			if(!context.states.drag && context.states.pointer.control && context.states.mousedown)
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
			else if(context.states.drag)
				control.onDragEnd();
		}

		context.states.mousedown = false;
		context.states.drag = false;

		/*
		if(!context.features.nosnapping && context.dragging.restrict == Restrict.onrelease)
		{
			console.log('hit')
			control.drawable.matrix.e = Math.round((context.states.pointer.current.x - smuggler.dragdiff.x) / (context.dragging.grid.x || 1)) * (context.dragging.grid.x || 1);
			control.drawable.matrix.f = Math.round((context.states.pointer.current.y - smuggler.dragdiff.y) / (context.dragging.grid.y || 1)) * (context.dragging.grid.y || 1);
		}
		*/
		context.refresh();
	}

	public static handleResize(context: Context, smuggler: any, event: HTMLElementEventMap['resize']): void
	{
		if(context.autosize)
		{
			clearTimeout(smuggler.id.resizing);

			smuggler.id.resizing = setTimeout(() => { 
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

	public static handleRightMouseClick(context: Context, event: HTMLElementEventMap['mousedown']): void
	{
		event.preventDefault();
	}

	public static handleDragStart(context: Context, event: HTMLElementEventMap['dragstart']): void
	{
		// Remove default action to avoid dragging the canvas
		event.preventDefault();
	}

	public static handleTouchMove(context: Context, event: HTMLElementEventMap['touchmove'])
   {
      event.preventDefault();

      //const touches = _event.changedTouches || _event.touches || [];
      let touches: any = event.touches || [];
		let ratio: number = window.devicePixelRatio;
		let point: Point = new Point(touches[0].pageX / ratio, touches[0].pageY / ratio);

		context.canvas.dispatchEvent(new MouseEvent("mousemove", {
			view: event.view,
			bubbles: true,
			cancelable: true,
			clientX: point.x,
			clientY: point.y
		}));

      if(touches.length === 2)
      {
         //console.log("[move 2]");

			/*
         let pinch0 = new CVector2(touches[0].pageX, touches[0].pageY, _zsys._stage.view);
         let pinch1 = new CVector2(touches[1].pageX, touches[1].pageY, _zsys._stage.view);
         pinch0.toRealPosition(touches[0].target);
         pinch1.toRealPosition(touches[1].target);

         if(!_zsys._stage.states.pinch.pointCurrent1)
         {
            _zsys._stage.states.pinch.pointCurrent0 = new CVector2(pinch0.x, pinch0.y, _zsys._stage.view);
            _zsys._stage.states.pinch.pointCurrent1 = new CVector2(pinch1.x, pinch1.y, _zsys._stage.view);
            return;
         }
         else
         {
            _zsys._stage.states.pinch.pointLast0.x = _zsys.stage.states.pinch.pointCurrent0.x;
            _zsys._stage.states.pinch.pointLast0.y = _zsys.stage.states.pinch.pointCurrent0.y;
            _zsys._stage.states.pinch.pointLast1.x = _zsys.stage.states.pinch.pointCurrent1.x;
            _zsys._stage.states.pinch.pointLast1.y = _zsys.stage.states.pinch.pointCurrent1.y;
            _zsys._stage.states.pinch.pointCurrent0 = pinch0;
            _zsys._stage.states.pinch.pointCurrent1 = pinch1;
         }

         window.requestAnimationFrame(() => _zsys.draw());
			*/
      }
      else
      {
         if(!context.states.pinch)
         {
            //console.log("[move 1]");
         }
      }
   }

   public static handleTouchStart(context: Context, event: HTMLElementEventMap['touchstart'])
   {
		event.preventDefault();

      //const touches = _event.changedTouches || _event.touches || [];
      let touches: any = event.touches || [];

      context.states.pinch = false;

      if(touches.length === 2)
      {
         //console.log("[touch 2]");
         //console.log("[pinch]");

         context.states.mousedown = false;
         context.states.pinch = true;
      }
      else
      {
         if(!context.states.pinch)
         {
            //console.log("[touch 1]")

				let ratio: number = window.devicePixelRatio;
				let point: Point = new Point(touches[0].pageX / ratio, touches[0].pageY / ratio);
				
				context.canvas.dispatchEvent(new MouseEvent("mousedown", {
					view: event.view,
					bubbles: true,
					cancelable: true,
					clientX: point.x,
					clientY: point.y
				}));
         }
      }
   }	

   public static handleTouchEnd(context: Context, event: HTMLElementEventMap['touchend'])
   {
      //const touches = _event.changedTouches || _event.touches || [];
      let touches: any = event.touches || [];

		context.states.pinch = false;
      //_zsys._stage.states.pinch.pointCurrent0 = null;
      //_zsys._stage.states.pinch.pointCurrent1 = null;

      if(touches.length === 1)
      {
         //console.log("[release 2]")
      }
      else
      {
         //console.log("[release 1]")

         if(context.states.pinch)
         {
            //console.log("[release pinch]")
         }

			context.canvas.dispatchEvent(new MouseEvent("mouseup", {
				view: event.view,
				bubbles: true,
				cancelable: true,
			}));
      }
   }

	public static handleWindowTouchMove(context: Context, event: HTMLElementEventMap['touchmove'])
   {
      // This will remove the scrolling while we are zoomed and dragging tile
      if(context.states.drag || context.states.pinch)
      {
         event.preventDefault();
         return false;
      }
   }
}
