export interface IContainers
{
	color?: string,
	backgroundColor?: string,
	fontFamily?: string,
	fontSize?: string
}

interface IContainerState
{
	element: HTMLDivElement;
	isExpanded: boolean;
	originalSize: { top: string, left: string, width: string, height: string };
	resizeHandles: HTMLDivElement[];
}

interface IResizeState
{
	active: boolean;
	element: HTMLDivElement;
	containerIndex: number;
	direction: string;
	startX: number;
	startY: number;
	startWidth: number;
	startHeight: number;
	startTop: number;
	startLeft: number;
	affectedContainers: Array<{
		index: number;
		edge: string;
		originalTop: number;
		originalLeft: number;
		originalWidth: number;
		originalHeight: number;
		gap: number;
	}>;
}

export class Containers
{
	private _containers: IContainerState[] = [];
	private _attributes: IContainers;
	private _resizeState: IResizeState | null = null;
	//---

	public constructor(attributes: IContainers = {}) 
	{
		const {
			color = 'var(--grey3)',
			backgroundColor = 'var(--black)',
			fontFamily = 'var(--font)',
			fontSize ='var(--fontsize)'
		} = attributes;

		this._attributes = attributes;
		this._initializeGlobalListeners();
	}

	private _initializeGlobalListeners(): void
	{
		document.addEventListener('mousemove', (e) => this._handleMouseMove(e));
		document.addEventListener('mouseup', () => this._handleMouseUp());
	}

	private _createResizeHandle(direction: string, container: HTMLDivElement): HTMLDivElement
	{
		const handle = document.createElement('div');
		handle.style.position = 'absolute';
		handle.style.backgroundColor = 'transparent';
		handle.style.zIndex = '1000';

		const size = '8px';
		const offset = '0px';

		switch (direction) {
			case 'n':
				handle.style.top = offset;
				handle.style.left = size;
				handle.style.right = size;
				handle.style.height = size;
				handle.style.cursor = 'ns-resize';
				break;
			case 's':
				handle.style.bottom = offset;
				handle.style.left = size;
				handle.style.right = size;
				handle.style.height = size;
				handle.style.cursor = 'ns-resize';
				break;
			case 'e':
				handle.style.right = offset;
				handle.style.top = size;
				handle.style.bottom = size;
				handle.style.width = size;
				handle.style.cursor = 'ew-resize';
				break;
			case 'w':
				handle.style.left = offset;
				handle.style.top = size;
				handle.style.bottom = size;
				handle.style.width = size;
				handle.style.cursor = 'ew-resize';
				break;
			case 'ne':
				handle.style.top = offset;
				handle.style.right = offset;
				handle.style.width = size;
				handle.style.height = size;
				handle.style.cursor = 'nesw-resize';
				break;
			case 'nw':
				handle.style.top = offset;
				handle.style.left = offset;
				handle.style.width = size;
				handle.style.height = size;
				handle.style.cursor = 'nwse-resize';
				break;
			case 'se':
				handle.style.bottom = offset;
				handle.style.right = offset;
				handle.style.width = size;
				handle.style.height = size;
				handle.style.cursor = 'nwse-resize';
				break;
			case 'sw':
				handle.style.bottom = offset;
				handle.style.left = offset;
				handle.style.width = size;
				handle.style.height = size;
				handle.style.cursor = 'nesw-resize';
				break;
		}

		handle.addEventListener('mousedown', (e) => this._handleMouseDown(e, container, direction));
		container.appendChild(handle);

		return handle;
	}

	private _handleMouseDown(e: MouseEvent, container: HTMLDivElement, direction: string): void
	{
		e.preventDefault();
		e.stopPropagation();

		const rect = container.getBoundingClientRect();
		
		// Find the index of this container
		const containerIndex = this._containers.findIndex(c => c.element === container);
		if (containerIndex === -1) return;

		// Find affected adjacent containers
		const affectedContainers = this._findAffectedContainers(containerIndex, direction, rect);

		this._resizeState = {
			active: true,
			element: container,
			containerIndex: containerIndex,
			direction: direction,
			startX: e.clientX,
			startY: e.clientY,
			startWidth: rect.width,
			startHeight: rect.height,
			startTop: rect.top,
			startLeft: rect.left,
			affectedContainers: affectedContainers
		};

		container.style.transition = 'none';
		
		// Disable transitions for affected containers
		affectedContainers.forEach(affected => {
			this._containers[affected.index].element.style.transition = 'none';
		});
	}

	private _findAffectedContainers(containerIndex: number, direction: string, rect: DOMRect): Array<{
		index: number;
		edge: string;
		originalTop: number;
		originalLeft: number;
		originalWidth: number;
		originalHeight: number;
		gap: number;
	}>
	{
		const affected: Array<any> = [];
		const tolerance = 30; // pixels tolerance for edge matching

		this._containers.forEach((container, index) => {
			if (index === containerIndex || container.isExpanded) return;

			const otherRect = container.element.getBoundingClientRect();

			// Check which edge of the current container is being resized
			// and find containers that share the opposite edge

			// Resizing north edge - affects containers above (their south edge)
			if (direction.includes('n')) {
				const topEdge = rect.top;
				const otherBottomEdge = otherRect.bottom;
				const gap = topEdge - otherBottomEdge;
				
				if (Math.abs(gap) < tolerance) {
					// Check if they overlap horizontally
					if (!(otherRect.right < rect.left || otherRect.left > rect.right)) {
						affected.push({
							index: index,
							edge: 'bottom',
							originalTop: otherRect.top,
							originalLeft: otherRect.left,
							originalWidth: otherRect.width,
							originalHeight: otherRect.height,
							gap: gap
						});
					}
				}
			}

			// Resizing south edge - affects containers below (their north edge)
			if (direction.includes('s')) {
				const bottomEdge = rect.bottom;
				const otherTopEdge = otherRect.top;
				const gap = otherTopEdge - bottomEdge;
				
				if (Math.abs(gap) < tolerance) {
					// Check if they overlap horizontally
					if (!(otherRect.right < rect.left || otherRect.left > rect.right)) {
						affected.push({
							index: index,
							edge: 'top',
							originalTop: otherRect.top,
							originalLeft: otherRect.left,
							originalWidth: otherRect.width,
							originalHeight: otherRect.height,
							gap: gap
						});
					}
				}
			}

			// Resizing east edge - affects containers to the right (their west edge)
			if (direction.includes('e') && !direction.includes('n') && !direction.includes('s')) {
				const rightEdge = rect.right;
				const otherLeftEdge = otherRect.left;
				const gap = otherLeftEdge - rightEdge;
				
				if (Math.abs(gap) < tolerance) {
					// Check if they overlap vertically
					if (!(otherRect.bottom < rect.top || otherRect.top > rect.bottom)) {
						affected.push({
							index: index,
							edge: 'left',
							originalTop: otherRect.top,
							originalLeft: otherRect.left,
							originalWidth: otherRect.width,
							originalHeight: otherRect.height,
							gap: gap
						});
					}
				}
			}

			// Resizing west edge - affects containers to the left (their east edge)
			if (direction.includes('w') && !direction.includes('n') && !direction.includes('s')) {
				const leftEdge = rect.left;
				const otherRightEdge = otherRect.right;
				const gap = leftEdge - otherRightEdge;
				
				if (Math.abs(gap) < tolerance) {
					// Check if they overlap vertically
					if (!(otherRect.bottom < rect.top || otherRect.top > rect.bottom)) {
						affected.push({
							index: index,
							edge: 'right',
							originalTop: otherRect.top,
							originalLeft: otherRect.left,
							originalWidth: otherRect.width,
							originalHeight: otherRect.height,
							gap: gap
						});
					}
				}
			}
		});

		return affected;
	}

	private _handleMouseMove(e: MouseEvent): void
	{
		if (!this._resizeState || !this._resizeState.active) {
			return;
		}

		const deltaX = e.clientX - this._resizeState.startX;
		const deltaY = e.clientY - this._resizeState.startY;
		const dir = this._resizeState.direction;
		const el = this._resizeState.element;

		let newWidth = this._resizeState.startWidth;
		let newHeight = this._resizeState.startHeight;
		let newTop = this._resizeState.startTop;
		let newLeft = this._resizeState.startLeft;

		// Handle horizontal resizing
		if (dir.includes('e')) {
			newWidth = Math.max(100, this._resizeState.startWidth + deltaX);
		} else if (dir.includes('w')) {
			newWidth = Math.max(100, this._resizeState.startWidth - deltaX);
			newLeft = this._resizeState.startLeft + deltaX;
		}

		// Handle vertical resizing
		if (dir.includes('s')) {
			newHeight = Math.max(100, this._resizeState.startHeight + deltaY);
		} else if (dir.includes('n')) {
			newHeight = Math.max(100, this._resizeState.startHeight - deltaY);
			newTop = this._resizeState.startTop + deltaY;
		}

		el.style.width = `${newWidth}px`;
		el.style.height = `${newHeight}px`;
		el.style.top = `${newTop}px`;
		el.style.left = `${newLeft}px`;

		// Update affected containers
		this._resizeState.affectedContainers.forEach(affected => {
			const affectedEl = this._containers[affected.index].element;
			
			if (affected.edge === 'bottom') {
				// Main container's top edge moved, adjust affected container's bottom edge (height)
				const newBottom = newTop - affected.gap;
				const newAffectedHeight = newBottom - affected.originalTop;
				affectedEl.style.height = `${Math.max(100, newAffectedHeight)}px`;
			}
			else if (affected.edge === 'top') {
				// Main container's bottom edge moved, adjust affected container's top edge
				const newBottom = newTop + newHeight;
				const newAffectedTop = newBottom + affected.gap;
				const newAffectedHeight = affected.originalHeight - (newAffectedTop - affected.originalTop);
				affectedEl.style.top = `${newAffectedTop}px`;
				affectedEl.style.height = `${Math.max(100, newAffectedHeight)}px`;
			}
			else if (affected.edge === 'right') {
				// Main container's left edge moved, adjust affected container's right edge (width)
				const newRight = newLeft - affected.gap;
				const newAffectedWidth = newRight - affected.originalLeft;
				affectedEl.style.width = `${Math.max(100, newAffectedWidth)}px`;
			}
			else if (affected.edge === 'left') {
				// Main container's right edge moved, adjust affected container's left edge
				const newRight = newLeft + newWidth;
				const newAffectedLeft = newRight + affected.gap;
				const newAffectedWidth = affected.originalWidth - (newAffectedLeft - affected.originalLeft);
				affectedEl.style.left = `${newAffectedLeft}px`;
				affectedEl.style.width = `${Math.max(100, newAffectedWidth)}px`;
			}
		});
	}

	private _handleMouseUp(): void
	{
		if (this._resizeState && this._resizeState.active) {
			this._resizeState.element.style.transition = 'all 0.3s ease';
			
			// Restore transitions for affected containers
			this._resizeState.affectedContainers.forEach(affected => {
				this._containers[affected.index].element.style.transition = 'all 0.3s ease';
			});
			
			this._resizeState.active = false;
			this._resizeState = null;
		}
	}

	public add(top: string = '13px', left: string = '13px', width: string = 'calc(50% - 15px)', height: string = 'calc(66.5% - 15px)'): number
	{
		const container = document.createElement('div');

		container.style.cssText = `
			color: ${this._attributes.color};
			background-color: ${this._attributes.backgroundColor};
			font-family: ${this._attributes.fontFamily};
			font-size: ${this._attributes.fontSize};
			position: absolute;
			border: none;
			border-radius: 10px;
			overflow-x: hidden;
			overflow-y: hidden;
			top: ${top};
			left: ${left};
			width: ${width};
			height: ${height};
			transition: all 0.3s ease;
		`;

		document.body.appendChild(container);

		// Create resize handles
		const resizeHandles: HTMLDivElement[] = [];
		const directions = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
		directions.forEach(dir => {
			resizeHandles.push(this._createResizeHandle(dir, container));
		});

		const containerState: IContainerState = {
			element: container,
			isExpanded: false,
			originalSize: { top, left, width, height },
			resizeHandles: resizeHandles
		};

		return this._containers.push(containerState) - 1;
	}

	public expand(index: number): void
	{
		if (index < 0 || index >= this._containers.length) {
			console.warn(`Container index ${index} out of bounds`);
			return;
		}

		const container = this._containers[index];
		if (container.isExpanded) {
			return;
		}

		// Hide resize handles when expanded
		container.resizeHandles.forEach(handle => handle.style.display = 'none');

		container.element.style.top = '0';
		container.element.style.left = '0';
		container.element.style.width = '100vw';
		container.element.style.height = '100vh';
		container.element.style.borderRadius = '0';
		container.isExpanded = true;
	}

	public retract(index: number): void
	{
		if (index < 0 || index >= this._containers.length) {
			console.warn(`Container index ${index} out of bounds`);
			return;
		}

		const container = this._containers[index];
		if (!container.isExpanded) {
			return;
		}

		// Show resize handles when retracted
		container.resizeHandles.forEach(handle => handle.style.display = 'block');

		container.element.style.top = container.originalSize.top;
		container.element.style.left = container.originalSize.left;
		container.element.style.width = container.originalSize.width;
		container.element.style.height = container.originalSize.height;
		container.element.style.borderRadius = '10px';
		container.isExpanded = false;
	}

	public toggle(index: number): void
	{
		if (index < 0 || index >= this._containers.length) {
			console.warn(`Container index ${index} out of bounds`);
			return;
		}

		const container = this._containers[index];
		if (container.isExpanded) {
			this.retract(index);
		} else {
			this.expand(index);
		}
	}

	public expandAll(): void
	{
		this._containers.forEach((_, index) => this.expand(index));
	}

	public retractAll(): void
	{
		this._containers.forEach((_, index) => this.retract(index));
	}

	public remove(index: number): void
	{
		if (index < 0 || index >= this._containers.length) {
			console.warn(`Container index ${index} out of bounds`);
			return;
		}

		const container = this._containers[index];
		// Remove resize handles
		container.resizeHandles.forEach(handle => handle.remove());
		// Remove container element
		document.body.removeChild(container.element);
		this._containers.splice(index, 1);
	}

	public removeAll(): void
	{
		this._containers.forEach(container => {
			container.resizeHandles.forEach(handle => handle.remove());
			document.body.removeChild(container.element);
		});
		this._containers = [];
	}

	public getContainer(index: number): HTMLDivElement | null
	{
		if (index < 0 || index >= this._containers.length) {
			return null;
		}
		return this._containers[index].element;
	}

	public getCount(): number
	{
		return this._containers.length;
	}

	public isExpanded(index: number): boolean
	{
		if (index < 0 || index >= this._containers.length) {
			return false;
		}
		return this._containers[index].isExpanded;
	}

	public setResizable(index: number, resizable: boolean): void
	{
		if (index < 0 || index >= this._containers.length) {
			console.warn(`Container index ${index} out of bounds`);
			return;
		}

		const display = resizable ? 'block' : 'none';
		this._containers[index].resizeHandles.forEach(handle => {
			handle.style.display = display;
		});
	}

	public setAllResizable(resizable: boolean): void
	{
		this._containers.forEach((_, index) => this.setResizable(index, resizable));
	}
}

// Example usage:
const containers: Containers = new Containers({
	color: 'white',
	backgroundColor: 'rgba(0, 0, 0, 0.8)',
	fontFamily: 'Arial',
	fontSize: '14px'
});

// Add containers in a grid layout (top-left, top-right, bottom)
// These containers share edges and will resize together
const container1 = containers.add();  // Top-left
const container2 = containers.add('13px', 'calc(50% + 15px)', 'calc(50% - 15px)', 'calc(66.5% - 15px)');  // Top-right
const container3 = containers.add('calc(66.5% + 15px)', '13px', 'calc(50% - 15px)', 'calc(33.5% - 15px)');  // Bottom (full width)
const container4 = containers.add('calc(66.5% + 15px)', 'calc(50% + 15px)', 'calc(50% - 26px)', 'calc(33.5% - 15px)');  // Bottom (full width)

// Resize containers by dragging edges or corners with the mouse
// - Adjacent containers will automatically resize together
// - Example: Drag the top edge of container3 up, and containers 1 & 2 will expand down
// - Example: Drag the right edge of container1 right, and container2 will shrink

// Expand/retract individual containers
// containers.expand(0);
// containers.retract(0);
// containers.toggle(0);

// Expand/retract all containers
// containers.expandAll();
// containers.retractAll();

// Enable/disable resizing
// containers.setResizable(0, false);  // Disable resizing for first container
// containers.setAllResizable(false);  // Disable resizing for all containers