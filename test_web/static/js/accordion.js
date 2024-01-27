/** @ts-check */

class AccordionContent extends HTMLDivElement {
    constructor() {
        super();
    }
}

class AccordionHeader extends HTMLDivElement {
    constructor() {
        super();
    }
    get parentBox() {
        return this.parentElement;
    }
    connectedCallback() {
        const childNodes = Array.from(this.childNodes);
        this.innerHTML = "";
        const btn = document.createElement("button");
        btn.append(...childNodes);
        this.append(btn);
        btn.addEventListener("click", this._btnClicked.bind(this));
    }
    _btnClicked() {
        this.parentBox?.toggle();
    }
}

class AccordionBox extends HTMLElement {
    constructor() {
        super();
        /** @type {AccordionContent} */
        this.content = this.querySelector("accordion-content");
        /** @type {AccordionHeader} */
        this.header = this.querySelector("accordion-header");
        /** @type {Accordion} */
        this.accordion = this.parentElement;
        this.contentResizeObserver = new ResizeObserver(() => {
            this.resized();
        });
        this.maxRecordedHeight = 0;
        this._internals = this.attachInternals();
    }
    get collapsed() {
        return this.hasAttribute("collapsed");
    }
    set collapsed(val) {
        console.log(this.content);
        if (val) {
            this.setAttribute("collapsed", "");
        } else {
            this.removeAttribute("collapsed");
        }
    }
    toggle() {
        this.collapsed = !this.collapsed;
    }
    resized() {
        if (this.maxRecordedHeight < this.clientHeight)
            this.maxRecordedHeight = this.clientHeight;
    }
    connectedCallback() {
        customElements.upgrade(this.content);
    }
    disconnectedCallback() {
        this.contentResizeObserver.unobserve(this);
    }
}

class Accordion extends HTMLDivElement {
    constructor() {
        super();
        /** @type {AccordionBox[]} */
        this.boxes = [];
    }
    /**
     * @param {string} id
     * @returns {AccordionBox | null}
     */
    getBox(id) {
        const box = this.boxes.find((b) => b.id === id);
        if (!box) {
            throw "No box with id " + id;
        } else return box;
    }
    toggle(id) {
        const box = this.getBox(id);
        if (!box) {
            console.warn("Tried to toggle unknown accordion box ", id);
            return null;
        }
        box.toggle();
    }
    connectedCallback() {
        this.boxes = Array.from(this.querySelectorAll("accordion-box"));
    }
}

window.customElements.define("main-accordion", Accordion, { extends: "div" });
window.customElements.define("accordion-box", AccordionBox);
window.customElements.define("accordion-header", AccordionHeader, {
    extends: "div",
});
window.customElements.define("accordion-content", AccordionContent, {
    extends: "div",
});

const module = {};

module.exports = {
    AccordionBox,
    Accordion,
    AccordionContent,
    AccordionHeader,
};
