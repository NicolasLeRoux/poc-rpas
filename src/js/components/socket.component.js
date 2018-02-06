export class SocketComponent extends HTMLElement {
	static get name () {
		return 'rpas-socket';
	}

	constructor () {
		super();

        this.isOpen = false;
	}

	/**
	 * Invoked when the custom element is first connected to the document's DOM.
	 */
	connectedCallback () {
		this.ws.onopen = this.onOpenSocket.bind(this);
		this.ws.onmessage = this.onMessageSocket.bind(this);
        this.ws.onclose = this.onCloseSocket.bind(this);
	}

	onOpenSocket () {
        this.isOpen = true;

		this.send({
			type: 'PILOT',
			action: 'INIT_SOCKET'
		});
	}

	onMessageSocket () {
		let json = JSON.parse(event.data),
			evt = new CustomEvent('message', {
				detail: json
			});

		this.dispatchEvent(evt);
	}

    onCloseSocket () {
        this.isOpen = false;
    }

	send (json) {
		this.ws.send(JSON.stringify(json));
	}

	/**
	 * Invoked when the custom element is moved to a new document.
	 */
	adoptedCallback () {
		console.log('adoptedCallback');
	}

	/**
	 * Invoked when the custom element is disconnected from the document's DOM.
	 */
	disconnectedCallback () {
		this.ws.close();
	}

	get ws () {
		if (!this._ws) {
			this._ws = new WebSocket(this.dataset.url, this.dataset.protocol);
		}
		return this._ws;
	}

    get isOpen () {
        return this._isOpen;
    }

    set isOpen (boolean) {
        this._isOpen = !!boolean;
    }
};

customElements.define(SocketComponent.name, SocketComponent);
