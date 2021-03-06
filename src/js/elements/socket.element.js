export class SocketElement extends HTMLElement {
	static get name () {
		return 'rpas-socket';
	}

	static get observedAttributes () {
		return [
			'data-url'
		];
	}

	constructor () {
		super();

        this.messageBuffer = [];
	}

	attributeChangedCallback (name, oldValue, newValue) {
		switch (name) {
			case 'data-url':
				this.onUrlChange(name, oldValue, newValue);
				break;
			default:
				console.warn('Unwatch attribute', name);
		}
	}

	onUrlChange (name, oldValue, newValue) {
        this.url = newValue;
	}

    start () {
        if (!!this.url) {
            this.ws.onopen = this.onOpenSocket.bind(this);
            this.ws.onmessage = this.onMessageSocket.bind(this);
            this.ws.onclose = this.onCloseSocket.bind(this);
        }
    }

	onOpenSocket () {
        while (this.messageBuffer.length) {
            let message = this.messageBuffer.pop();

            this.receive(message);
        }
	}

	onMessageSocket () {
		let json = JSON.parse(event.data),
			evt = new CustomEvent('message', {
				bubbles: true,
				detail: json
			});

		this.dispatchEvent(evt);
	}

	onCloseSocket () {
		let evt = new CustomEvent('close', {
			bubbles: true
		});
		this.dispatchEvent(evt);
	}

	receive (message) {
        if (this.isOpen) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.messageBuffer.push(message);
        }
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

            this.start();
		}
		return this._ws;
	}

	get isOpen () {
		return this.ws.readyState === this.ws.OPEN;
	}

    set url (url) {
        this._url = url;
    }

    get url () {
        return this._url;
    }
};

customElements.define(SocketElement.name, SocketElement);
