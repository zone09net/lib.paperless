import * as Paperless from '../../lib.paperless.js';



export class Disappear extends Paperless.Control
{
	public constructor(attributes: Paperless.IControlAttributes = {})
	{
		super(attributes);
	}

	public onInside(): void
	{
		this.context.detach([this.drawable.guid, this.guid]);
	}
}
