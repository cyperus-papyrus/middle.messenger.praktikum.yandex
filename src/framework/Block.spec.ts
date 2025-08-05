import { expect } from 'chai';
import sinon from 'sinon';
import Block from './Block';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>');
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;

class SimpleBlock extends Block {
    render() {
        return '<div class="test-block">{{text}}</div>';
    }
}

describe('Block', () => {
    it('Должен создавать экземпляр', () => {
        const block = new SimpleBlock({});
        expect(block).to.be.instanceOf(Block);
    });

    it('Должен рендерить контент', () => {
        const block = new SimpleBlock({ text: 'Hello' });
        const content = block.getContent();
        expect(content.textContent).to.equal('Hello');
    });

    it('Должен обновлять пропсы через setProps', () => {
        const block = new SimpleBlock({ text: 'Initial' });
        block.setProps({ text: 'Updated' });

        expect(block.getContent().textContent).to.equal('Updated');
    });

    it('Должен обрабатывать события', () => {
        const clickSpy = sinon.spy();
        const block = new SimpleBlock({
            events: {
                click: clickSpy
            }
        });

        const element = block.getContent();
        element.dispatchEvent(new Event('click'));

        expect(clickSpy.calledOnce).to.equal(true);
    });

    it('Должен выбрасывать ошибку при получении контента без элемента', () => {
        const block = new SimpleBlock({});

        const blockWithNullableElement = block as unknown as { _element: HTMLElement | null };
        blockWithNullableElement._element = null;

        let errorThrown = false;
        let errorMessage = '';

        try {
            block.getContent();
        } catch (e) {
            errorThrown = true;
            errorMessage = (e as Error).message;
        }

        expect(errorThrown).to.equal(true);
        expect(errorMessage).to.equal('Element is not created');
    });
});
