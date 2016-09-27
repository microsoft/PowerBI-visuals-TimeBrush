import { expect } from "chai";
import { coerceDate } from "./dataConversion";

describe("coerceDate", () => {
    it("should coerce 2014 as a date object", () => {
        expect(coerceDate(2014).getFullYear()).to.eq(2014);
    });
    it("should coerce '2014' as a date object", () => {
        expect(coerceDate("2014").getFullYear()).to.eq(2014);
    });
    it("should coerce iso date '1999-03-16T22:29:03.221Z' as the correct date object", () => {
        let result = coerceDate("1999-03-16T22:29:03.221Z");
        expect(result.getFullYear()).to.eq(1999);
        expect(result.getDate()).to.eq(16);
        expect(result.getMonth()).to.eq(2); // Months start at 0

        // TODO: Time??
    });
    it("should coerce time '12:33' as the correct date object", () => {
        let result = coerceDate("12:33");
        expect(result.getHours()).to.eq(12);
        expect(result.getMinutes()).to.eq(33); // Months start at 0

        // TODO: Time??
    });
    it("should coerce day 22", () => {
        let result = coerceDate(22);
        expect(result.getDate()).to.eq(22);
    });
    it("should coerce a javascript date into itself", () => {
        let myDate = new Date();
        let result = coerceDate(myDate);
        expect(result).to.eq(myDate);
    });
    it("should coerce epoch dates", () => {
        let myDate = new Date();
        let result = coerceDate(myDate.getTime());
        expect(result.getTime()).to.eq(myDate.getTime());
    });
    it("should coerce '' as undefined", () => {
        let result = coerceDate("");
        expect(result).to.be.undefined;
    });
    it("should coerce null as undefined", () => {
        let result = coerceDate(null);
        expect(result).to.be.undefined;
    });
    it("should coerce undefined as undefined", () => {
        let result = coerceDate(undefined);
        expect(result).to.be.undefined;
    });
});
