
import * as Foundation from '@zone09.net/foundation';
import {Drawable} from "./Drawable.js";
import {Vector} from "./Vector.js";
import {Point} from "./Point.js";
import {DrawAction} from "./DrawAction.js";
import {Cross} from "./drawables/Cross.js";
import {Line} from "./drawables/Line.js";
import {Circle} from "./drawables/Circle.js";
import {Smiley} from "./drawables/Smiley.js";



export interface collision
{
	collider: Drawable,
	collidee: Drawable,
	normal: Vector,
	magnitude: number,
	unitNormal: Vector,
	unitTangent: Vector,
}



export class Physic extends DrawAction
{
	private _collisions: collision[] = [];
	private _map: Map<string, {collider: Drawable, collidee: Drawable}> = new Map();
	//---

	public constructor()
	{
		super();
	}

	public addCollision(collider: Drawable, collidee: Drawable): void
	{
		const normal: Vector = new Vector({
			x: ((collider.x * (collidee.width / 2)) + (collidee.x * (collider.width / 2))) / ((collider.width / 2) + (collidee.width / 2)),
			y: ((collider.y * (collidee.height / 2)) + (collidee.y * (collider.height / 2))) / ((collider.height / 2) + (collidee.height / 2))
		});
		
		const unitNormal: Vector = normal.clone().normalize();
		const unitTangent: Vector = unitNormal.clone().tangent();

		//if(!this._map.has(collider.guid + '-' + collidee.guid) && !this._map.has(collider.guid + '-' + collidee.guid))
		{
			this._map.set(collider.guid + '-' + collidee.guid, {collider: collider, collidee: collidee});
			this._map.set(collidee.guid + '-' + collider.guid, {collider: collider, collidee: collidee});

			this._collisions.push({
				collider: collider,
				collidee: collidee,
				normal: normal,
				magnitude: normal.components.magnitude,
				unitNormal: unitNormal,
				unitTangent: unitTangent,
			});
		}
	}

	 
	public elasticCollision(collision: collision): void
	{
		
		// Projecting the velocity vectors onto the unit normal and unit tangent vectors
		const colliderNormal: number = collision.unitNormal.dot(collision.collider.physic.velocity);
		const colliderTangent: number = collision.unitTangent.dot(collision.collider.physic.velocity);
		const collideeNormal: number = collision.unitNormal.dot(collision.collidee.physic.velocity);
		const collideeTangent: number = collision.unitTangent.dot(collision.collidee.physic.velocity);

		// New normal velocities using one-dimensional elastic collision equations
		const totalMass: number = collision.collider.physic.mass + collision.collidee.physic.mass;
		const colliderNormalVelocity: number = ( ((collision.collider.physic.mass - collision.collidee.physic.mass) * colliderNormal) + (2 * collision.collidee.physic.mass * collideeNormal) ) / totalMass;
		const collideeNormalVelocity: number = ( ((collision.collidee.physic.mass - collision.collider.physic.mass) * collideeNormal) + (2 * collision.collider.physic.mass * colliderNormal) ) / totalMass;

		// Compute new normal and tangential velocity vectors
		const colliderNewNormal: Vector = collision.unitNormal.clone().multiply(colliderNormalVelocity);
		const colliderNewTangent: Vector = collision.unitTangent.clone().multiply(colliderTangent);
		const collideeNewNormal: Vector = collision.unitNormal.clone().multiply(collideeNormalVelocity);
		const collideeNewTangent: Vector = collision.unitTangent.clone().multiply(collideeTangent);
		
		// Set new velocities in x and y coordinates
		collision.collider.physic.velocity = new Vector({x: colliderNewNormal.components.x + colliderNewTangent.components.x, y: colliderNewNormal.components.y + colliderNewTangent.components.y});
		collision.collidee.physic.velocity = new Vector({x: collideeNewNormal.components.x + collideeNewTangent.components.x, y: collideeNewNormal.components.y + collideeNewTangent.components.y});

		// Rad are not good, check https://en.wikipedia.org/wiki/Elastic_collision
		collision.collider.physic.velocity.rad(Math.atan2(collision.collider.y - collision.collidee.y, collision.collider.x - collision.collidee.x));
		collision.collidee.physic.velocity.rad(3.14 + collision.collider.physic.velocity.components.rad);
		

		/*
		const relativeVelocity: Vector = new Vector({
			x: collision.collider.physic.velocity.components.x - collision.collidee.physic.velocity.components.x, 
			y: collision.collider.physic.velocity.components.y - collision.collidee.physic.velocity.components.y
		});

		const speed: number = relativeVelocity.dot(collision.unitNormal);
		const impulse = 2 * speed / (collision.collidee.physic.mass + collision.collider.physic.mass);

		const colliderNewNormal: Vector = collision.unitNormal.clone().multiply(collision.collidee.physic.mass * impulse);
		const collideeNewNormal: Vector = collision.unitNormal.clone().multiply(collision.collider.physic.mass * impulse);
		
		collision.collider.physic.velocity.subtract(colliderNewNormal)//.magnitude();
		collision.collidee.physic.velocity.add(collideeNewNormal)//.magnitude();

		//if(collision.collider.physic.velocity.components.magnitude <= 0.05)
		//	collision.collider.physic.velocity.magnitude(0.05);
		//if(collision.collidee.physic.velocity.components.magnitude <= 0.05)
		//	collision.collidee.physic.velocity.magnitude(0.05);

		//collision.collider.physic.velocity.rad(Math.atan2(collision.collider.y - collision.collidee.y, collision.collider.x - collision.collidee.x));
		//collision.collidee.physic.velocity.rad(3.14 + collision.collider.physic.velocity.components.rad);
		*/
		
		/*
		//console.clear();
		console.group('collision');
		
			console.log(collision);
			console.log('impact', collision.normal);
			
			console.group('collider');
				console.log('point', collision.collider.physic.velocity);
				//console.log('correction', correctionCollider);
			console.groupEnd();

			console.group('collidee');
				console.log('point', collision.collidee.physic.velocity);
				//console.log('correction', correctionCollidee);
			console.groupEnd();
			
		console.groupEnd();
		*/
		
	}

	public onDrawBefore(context2D: OffscreenCanvasRenderingContext2D): void
	{
		
		this._collisions.forEach((collision) => {
			/*
			const impact: Point = new Point(
				((collision.collider.x * (collision.collidee.width / 2)) + (collision.collidee.x * (collision.collider.width / 2))) / ((collision.collider.width / 2) + (collision.collidee.width / 2)),
				((collision.collider.y * (collision.collidee.height / 2)) + (collision.collidee.y * (collision.collider.height / 2))) / ((collision.collider.height / 2) + (collision.collidee.height / 2))
			);

			const angle: number = new Vector({x: collision.collidee.x, y: collision.collidee.y}).subtract(new Vector({x: collision.collider.x, y: collision.collider.y})).rad();

			new Cross({
				context: this.context,
				point: {x: impact.x, y: impact.y},
				linewidth: 1,
				size: {width: 200, height: 200},
				angle: angle * 180 / Math.PI,
				strokecolor: '#333333'
			});

			new Circle({
				context: this.context,
				point: collision.collider.point,
				outerRadius: (<Smiley>collision.collider).outerRadius,
				nofill: true,
			});

			new Circle({
				context: this.context,
				point: collision.collidee.point,
				outerRadius: (<Smiley>collision.collidee).outerRadius,
				nofill: true,
			});

			new Line({
				context: this.context,
				point0: {x: collision.collider.x - 150, y: collision.collider.y - 150},
				point1: {x: collision.collider.x + 150, y: collision.collider.y + 150},
				linewidth: 1,
				strokecolor: collision.collider.fillcolor
			});

			new Line({
				context: this.context,
				point0: {x: collision.collidee.x - 150, y: collision.collidee.y - 150},
				point1: {x: collision.collidee.x + 150, y: collision.collidee.y + 150},
				linewidth: 1,
				strokecolor: collision.collidee.fillcolor
			});
			*/
			this.elasticCollision(collision);
			//this.context.detach([collision.collider.guid, collision.collidee.guid]);
		});
	}

	public onDrawAfter(context2D: OffscreenCanvasRenderingContext2D): void
	{
		this._map.forEach((collision) => {
			if(!collision.collider.intersectCircle(collision.collidee))
			{
				this._map.delete(collision.collider.guid + '-' + collision.collidee.guid);
				this._map.delete(collision.collidee.guid + '-' + collision.collider.guid);
			}
		});

		this._collisions = [];
	}

	// Accessors
	// --------------------------------------------------------------------------

	public get collisions(): collision[]
	{
		return this._collisions
	}

}
