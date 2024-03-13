import * as Foundation from '@zone09.net/foundation';
import {Point} from './Point.js';
import {Control} from './Control.js';
import {Group} from './Group.js';
import {Drawable} from './Drawable.js';
import {Context} from './Context.js';
import {Size} from './Size.js';
import {Restrict} from './enums/Restrict.js';
import {Component} from './Component.js';
import {MouseAction} from './MouseAction.js';
import {Layer} from './Layer.js';



export class Events
{
	public static handleMouseMove(context: Context, event: HTMLElementEventMap['mousemove']): void
	{
		event.preventDefault();

		const layers: Layer[] = context.getLayers()
		const pointer: Point = new Point(event.clientX, event.clientY, { scale: window.devicePixelRatio * context.scale });
		let refresh: boolean = false;

		context.states.pointer.last = context.states.pointer.current;
		context.states.pointer.current = pointer.toRealPosition(<HTMLElement>event.currentTarget);

		layers.forEach((layer: Layer) => {
			layer.mouseactions.forEach((mouseaction: MouseAction) => {
				mouseaction.onMouseMove(context);
			});

			if(!context.states.drag && !context.features.nohover)
			{
				const stickies: Control[] = layer.controls.sorted.filter((control: Control) => control.drawable.sticky && control.drawable.visible);
				const nostickies: Control[] = layer.controls.sorted.filter((control: Control) => !control.drawable.sticky && control.drawable.visible);

				[...stickies, ...nostickies].every((control: Control) => {
					if(control.drawable && control.drawable.hoverable)
					{
						if(control.drawable.isHover(context.states.pointer.current))
						{
							if(context.states.pointer.control == control.guid)
								return false;
							else
							{
								const unhover: Control = context.get(context.states.pointer.control);

								if(unhover)
								{
									unhover.drawable.hover = false;
									unhover.onOutside(unhover);
								}
								
								context.states.pointer.control = control.guid;
								control.drawable.hover = true;
								control.onInside(control);
							}

							refresh = true;
							return false;
						}
						else
						{
							if(context.states.pointer.control == control.guid)
							{
								refresh = true;
								context.states.pointer.control = undefined;
								control.drawable.hover = false;
								control.onOutside(control);
							}
						}
					}

					return true;
				});
			}
		});

		if(refresh && !context.fx.id && !context.states.drag)
			context.refresh();
	}

	public static handleMouseDown(context: Context, event: HTMLElementEventMap['mousedown']): void
	{
		event.preventDefault();
		
		context.canvas.dispatchEvent(new MouseEvent("mousemove", {
			view: event.view,
			bubbles: true,
			cancelable: true,
			clientX: event.clientX,
			clientY: event.clientY
		}));

		context.states.pointer.clicked = new Point(context.states.pointer.current.x, context.states.pointer.current.y, { scale: 1 });
		context.states.mousedown = true;

		context.getLayers().forEach((layer: Layer) => {
			layer.mouseactions.forEach((mouseaction: MouseAction) => {
				mouseaction.onMouseDown(context);
			});
		});

		if(event.button == 0 && context.states.pointer.control && !context.states.drag)
		{
			const control: Control = context.get(context.states.pointer.control);

			if(control)
			{
				if(control.movable && control.enabled)
				{
					context.id.dragging = setTimeout(() => {
						if(control.drawable.isHover(context.states.pointer.current))
						{
							const group: Group = context.get(control.drawable.group);

							if(group)
							{
								[...group.grouped, ...group.enrolled].forEach((drawable: Drawable) => {
									(<any>drawable.points)['origin'] = new Point(control.drawable.x - drawable.x, control.drawable.y - drawable.y, { scale: 1 });
								});
							}

							context.states.pointer.dragdiff = new Point(
								(context.states.pointer.current.x / context.scale / window.devicePixelRatio) - control.drawable.x, 
								(context.states.pointer.current.y / context.scale / window.devicePixelRatio) - control.drawable.y, 
								{ scale: context.scale * window.devicePixelRatio }
							);

							context.states.drag = true;
							control.drawable.toFront();

							if(control.focusable)
								context.setFocus(control.guid);

							control.onDragBegin(control);
							context.drag();
						}
					}, context.dragging.delay);
				}
			}
		}
	}

	public static handleMouseUp(context: Context, event: HTMLElementEventMap['mouseup']): void
	{
		event.preventDefault();
		window.clearTimeout(context.id.dragging);

		const control: Control = context.get(context.states.pointer.control);

		context.getLayers().forEach((layer: Layer) => {
			layer.mouseactions.forEach((mouseaction: MouseAction) => {
				mouseaction.onMouseUp(context);
			});
		});

		if(control instanceof Control)
		{
			if(!context.states.drag && context.states.pointer.control && context.states.mousedown)
			{
				if(event.button == 0 && control.enabled && control.drawable.visible)
				{
					if(control.focusable)
						context.setFocus(control.guid);
					
					control.onLeftClick(control);
				}
				else if(event.button == 2 && control.enabled && control.drawable.visible)
					control.onRightClick(control);
			}
			else if(context.states.drag)
			{
				if(!context.features.nosnapping && context.dragging.restrict == Restrict.onrelease)
				{
					control.drawable.x = Math.round((context.states.pointer.current.x - context.states.pointer.dragdiff.x) / (context.dragging.grid.x || 1)) * (context.dragging.grid.x || 1);
					control.drawable.y = Math.round((context.states.pointer.current.y - context.states.pointer.dragdiff.y) / (context.dragging.grid.y || 1)) * (context.dragging.grid.y || 1);
					control.drawable.x /= (window.devicePixelRatio * context.scale);
					control.drawable.y /= (window.devicePixelRatio * context.scale);
				}

				control.onDragEnd(control);
			}
		}

		window.cancelAnimationFrame(context.id.dragging);
		context.states.mousedown = false;
		context.states.drag = false;

		if(!context.fx.id)
			context.refresh();
	}

	public static handleResize(context: Context, event: HTMLElementEventMap['resize']): void
	{
		if(context.autosize)
		{
			clearTimeout(context.id.resizing);

			context.id.resizing = setTimeout(() => {
				context.size = new Size(window.innerWidth, window.innerHeight);
				
				context.getLayers().forEach((layer: Layer) => {
					layer.drawables.forEach((drawable: Drawable) => {
						drawable.onResize(drawable);
					});

					layer.components.forEach((component: Component) => {
						component.onResize(component);
					});
				});
			}, 250);
		}
	}

	public static handleVisibilityChange(context: Context, event: HTMLElementEventMap['resize']): void
	{
		if(document.visibilityState === 'visible')
			context.refresh();
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
      const touches: any = event.touches || [];
		const ratio: number = window.devicePixelRatio;
		const point: Point = new Point(touches[0].pageX / ratio, touches[0].pageY / ratio);

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
      const touches: any = event.touches || [];

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

				const ratio: number = window.devicePixelRatio;
				const point: Point = new Point(touches[0].pageX / ratio, touches[0].pageY / ratio);
				
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
      const touches: any = event.touches || [];

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
      // This will remove the scrolling while we are zoomed and dragging
      if(context.states.drag || context.states.pinch)
      {
         event.preventDefault();
         return false;
      }
   }
}
