import {Drawable} from './Drawable.js';
import {Point} from './Point.js';



/**
 * When you [[add]] an annimation, you pass this interface that contains various options and callback functions that are then passed to the an [[effect]] function. 
 * 
 * Someone could easely create a new effect function with [[IFx]] as parameter.
 * 
 * ```typescript
 * function fullrotate(fx: Paperless.IFx)
 * {
 * 	let angle: number = Math.abs(fx.smuggler.ease(fx.t) * 360);
 * 	(<Paperless.Drawable>fx.drawable).rotation = 360 - angle;
 * 	(<Paperless.Drawable>fx.drawable).draw((<Paperless.Drawable>fx.drawable).context.context2D);
 * }
 * 
 * drawable = context.attach(new Paperless.Drawables.Line(new Paperless.Point(100, 600), new Paperless.Point(100, 700)));
 * context.fx.add({
 * 	duration: 2000,
 * 	drawable: drawable,
 * 	effect: fullrotate,
 * 	loop: true,
 * 	smuggler: { ease: Paperless.Fx.easeLinear},
 * });
 * ```
 */
export interface IFx {
	/** 
	 * [[Drawable]] that will be part of the annimation. In the case the [[Drawable]] given is in a group, all group member will have the same annimation. 
	 * In the case an array of [[Drawable]] is given, the group attribute is ignored.
	 * */
	drawable: Drawable | Array<Drawable>,

	/** Sets the duration of the annimation in ms. Default is 1000ms. */
	duration?: number,

	/** Set loop to true if you want the annimation to repeat after it finish. Default is false. */
	loop?: boolean,

	/**
	 * Effect that the annimation will have, this is a callback function.
	 * 
	 * The [[Fx]] class contains different effect functions:
	 * * fadeIn
	 * * fadeOut
	 * * rotate
	 * * move
	 * * scale
	 */
	effect: (fx: IFx) => void,

	/** Ignore group membership of the [[Drawable]] to annimate. Default is false. */
	nogroup?: boolean,

	/** Arguments to be sent to the [[effect]] callback function. */
	smuggler?: IFxSmuggler,

	/** Callback function to be called when the annimation end. */
	complete?: (fx: IFx) => void,

	/** @ignore */
	t0?: number,

	/** 
	 * This variable represents the current time of the annimation depending on the [[duration]] that was given. The time goes from 0 to 1 and is calculated internaly.
	 */
	t?: number
}

/**
 * The interface is used to pass arguments to the [[effect]] callback funtion within [[IFx]]. Depending on the effect in use, some arguments may not be used.
 */
 export interface IFxSmuggler {
	/** 
	 * This is the timing callback function to be used by the annimation. The function will be called at every tick calculated from the [[duration]].
	 * The list can be found in the [[Fx]] class, choices are:
	 * 
	 * [[easeLinear]] <br>
	 * [[easeInSine]], [[easeOutSine]], [[easeInOutSine]] <br>
	 * [[easeInQuad]], [[easeOutQuad]], [[easeInOutQuad]] <br>
	 * [[easeInCubic]], [[easeOutCubic]], [[easeInOutCubic]] <br>
	 * [[easeInQuart]], [[easeOutQuart]], [[easeInOutQuart]] <br>
	 * [[easeInQuint]], [[easeOutQuint]], [[easeInOutQuint]] <br>
	 * [[easeInExpo]], [[easeOutExpo]], [[easeInOutExpo]] <br>
	 * [[easeInCirc]], [[easeOutCirc]], [[easeInOutCirc]] <br>
	 * [[easeInBack]], [[easeOutBack]], [[easeInOutBack]] <br>
	 * [[easeInElastic]], [[easeOutElastic]], [[easeInOutElastic]] <br>
	 * [[easeInBounce]], [[easeOutBounce]], [[easeInOutBounce]] <br>
	 */
	ease?: (t: number) => number,

	/** This is the total angle to rotate the [[Drawable]] in the given [[duration]] on the [[rotate]] effect. When used with the [[move]] effect, it is 
	 * the direction where the drawable will go. */
	angle?: number,

	/** Used with [[move]] effect, it is the total distance to move in pixels. */
	distance?: number,

	/** Used with the [[scale]] effect, it is the x and y scale that will be modified on the [[Drawable]]. */
	scale?: {x: number, y: number},

	/** Used to pass custom argument(s) to an home made [[effect]] callback function. */ 
	custom?: any,

	/** @ignore */
	origin?: number | Point,
	/** @ignore */
	originx?: number,
	/** @ignore */
	originy?: number,
	/** @ignore */
	startx?: number,
	/** @ignore */
	endx?: number,
	/** @ignore */
	starty?: number,
	/** @ignore */
	endy?: number
}

