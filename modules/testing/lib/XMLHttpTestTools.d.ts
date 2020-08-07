import * as sinon from 'sinon';
export declare class XMLHttpTestTools {
    static JSON_HEADER: object;
    private static xhr;
    static requests: sinon.SinonFakeXMLHttpRequest[];
    static beforeEach(): void;
}
