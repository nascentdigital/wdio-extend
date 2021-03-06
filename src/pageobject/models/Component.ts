// imports
import {expect} from "chai";
import colorNormalize from "color-normalize";
import {Style} from "../style";
import {Container} from "./Container";


// class definition
export class Component extends Container {

    public readonly parent: Container;
    public readonly name: string;
    private _selector: string;
    private _style?: Style;


    protected constructor(parent: Container, selector: string, name?: string) {

        // call base constructor
        super();

        // initialize instance variables
        this.parent = parent;
        this.name = name || this.constructor.name;
        this._selector = selector;
    }


    public static create(parent: Container, selector: string, name: string): Component {
        return new Component(parent, selector, name);
    }

    public at(index: number): this {

        // clone this instance
        const clone = Object.create(this) as this;

        // mutate selector
        clone._selector = clone._selector + `:nth-of-type(${index + 1})`;

        // return clone
        return clone;
    }

    public get selector(): string {
        return this.parent instanceof Component
            ? `${this.parent.selector} ${this._selector}`
            : this._selector;
    }

    public get path(): string {
        return this.parent instanceof Component
            ? `${this.parent.path}.${this.name}`
            : this.name;
    }

    public withStyle(style: Style): this {
        this._style = style;
        return this;
    }

    public get element() { return $(this.selector); }

    public get elements() { return $$(this.selector); }

    public count() {
        return this.elements.length;
    }

    public getClasses(): string[] {
        return this.element.getClasses();
    }

    public getText(): string {
        return this.element.getText();
    }

    public isDisplayed() {
        return this.element.isDisplayed();
    }

    public validateStyle() {

        // fail immediately if there isn't any style
        const style = this._style;
        if (style === undefined) {
            expect.fail(`Attempt to validate undefined style on component ${this.path}`);
            return;
        }

        // determine current breakpoint
        const breakpoint = browser.getBreakpoint();

        // map style into individual assertions
        for (const entry of style.entries(breakpoint)) {

            // get property
            const [key, expected] = entry;
            const css = this.element.getCSSProperty(key);
            const cssType = css.parsed ? css.parsed.type : undefined;

            // handle font
            if (key === "font-family") {
                const actualFont = css.value.toLowerCase();
                const expectedFont = (expected as string).split(",")[0].toLowerCase();
                expect(actualFont, `${this.path} font-family`)
                    .to.be.eq(expectedFont);
            }

            // special handling for colors
            else if (cssType === "color") {
                const actualColor = colorNormalize(css.value);
                const expectedColor = colorNormalize(expected);
                expect(actualColor, `${this.path} css ${key}`)
                    .to.deep.eq(expectedColor);
            }

            // otherwise just check property
            else {
                expect(css.value, `${this.path} style ${key}`)
                    .to.be.eq(expected);
            }
        }
    }

    public waitUntilDisplayed(delayMs?: number, message?: string) {
        this.element.waitForDisplayed({
            timeout: delayMs,
            timeoutMsg: message
        })
    }

    public waitUntilNotDisplayed(delayMs?: number, message?: string) {
        this.element.waitForDisplayed({
            timeout: delayMs,
            timeoutMsg: message,
            reverse: true
        });
    }
}
