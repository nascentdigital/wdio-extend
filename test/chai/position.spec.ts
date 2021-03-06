// imports
import {expect} from "chai";
import {ChaiExtensions} from "../../src";
import {$, $$, Rect} from "../mock";


// bind extensions
ChaiExtensions.register();


// constants
const title = $(".title", {bounds: new Rect(100, 100, 100, 10)});
const caption = $(".caption", {bounds: new Rect(100, 110, 100, 50)});
const button = $(".button", {bounds: new Rect(220, 111, 100, 50)});


// tests
describe("Chai::position", () => {

    it("should fail when there are no elements to target", () => {
        expect(() => expect($$(".title", [])).to.not.be.positioned("leftAligned", caption)).to.throw();
        expect(() => expect(4).to.not.be.positioned("leftAligned", caption)).to.throw();
        expect(() => expect("test").to.not.be.positioned("leftAligned", caption)).to.throw();
        expect(() => expect(false).to.not.be.positioned("leftAligned", caption)).to.throw();
        expect(() => expect({}).to.not.be.positioned("leftAligned", caption)).to.throw();
        expect(() => expect([1, 2, 3]).to.not.be.positioned("leftAligned", caption)).to.throw();
    });

    it("should fail when there is no position defined", () => {
        expect(() => expect(title).to.be.positioned([], caption)).to.throw();
        expect(() => expect(title).to.not.be.positioned([], caption)).to.throw();
    });

    describe("elements vertically off by a pixel comparing top alignment", () => {

        it("should fail by default", () => {
            expect(caption).to.not.be
                .positioned(["topAligned", "bottomAligned"], button);
        });

        it("should pass if adding 'roughly' to comparison", () => {
            expect(caption).to.be
                .roughly.positioned(["topAligned", "bottomAligned"], button);
        });
    });

    describe("stacked column of elements", () => {

        describe("when asserting leftAligned", () => {

            it("should pass", () => {
                expect(title).to.be.positioned("leftAligned", caption);
            })

            it("should fail if negated", () => {
                expect(() => expect(title).to.not.be.positioned("leftAligned", caption)).to.throw();
            })
        });

        describe("when asserting leftOf positioning", () => {

            it("should fail", () => {
                expect(() => expect(title).to.be.positioned("leftOf", caption)).to.throw();
            })

            it("should pass if negated", () => {
                expect(title).to.not.be.positioned("leftOf", caption);
            })
        });

        describe("when asserting rightAligned", () => {

            it("should pass", () => {
                expect(title).to.be.positioned("rightAligned", caption);
            })

            it("should fail if negated", () => {
                expect(() => expect(title).to.not.be.positioned("rightAligned", caption)).to.throw();
            })
        });

        describe("when asserting rightOf positioning", () => {

            it("should fail", () => {
                expect(() => expect(title).to.be.positioned("rightOf", caption)).to.throw();
            })

            it("should pass if negated", () => {
                expect(title).to.not.be.positioned("rightOf", caption);
            })
        });

        describe("when asserting leftAligned + rightAligned together", () => {

            it("should pass", () => {
                expect(title).to.be.positioned(["leftAligned", "rightAligned"], caption);
            })

            it("should fail if negated", () => {
                expect(() => expect(title).to.not.be.positioned(["leftAligned", "rightAligned"], caption))
                    .to.throw();
            })
        });
    });
});
