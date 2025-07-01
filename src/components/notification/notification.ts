import Block from "../../framework/Block";
import { IBlockEvents } from '../../utils/types';
import Icon from "../icon/icon";

interface INotificationProps {
    message: string;
    type?: "success" | "error";
    events?: IBlockEvents;
    icon?: string;
    visible?: boolean;
}

export default class Notification extends Block {
    constructor(props: INotificationProps) {
        const children: Record<string, Block> = {};
        children.icon = new Icon({ name: 'Close' });
        let events = props.events || {};

        events = {
            ...events,
            click: (e: Event) => this.handleClick(e)
        };

        super({
            ...props,
            events,
            type: props.type || "success",
            ...children
        });

    }

    handleClick(e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.notification__close')) {
            this.setProps({ visible: false });
        }
    }
    public showUp(message: string, type: "success" | "error" = "success") {
        this.setProps({
            message,
            type,
            visible: true,
            animating: true
        });
        setTimeout(() => {
            this.setProps({ animating: false });
        }, 300);
        setTimeout(() => {
            this.hideDown();
        }, 5000);
    }


    public hideDown() {
        this.setProps({
            visible: false,
            animating: true,
        });
        setTimeout(() => {
            this.setProps({ animating: false });
        }, 300);
    }


    render(): string {
        const visibilityClass = this.props.visible
            ? "notification_visible"
            : "notification_hidden";

        const animateClass = this.props.animating
            ? (this.props.visible ? "notification_animate-show" : "")
            : "";

        return `
      <div class="notification notification_${this.props.type} ${visibilityClass} ${animateClass}">
        <div class="notification__content">
          ${this.props.message}
        </div>
        <div class="notification__close">
          {{{ icon }}}
        </div>
      </div>
    `;
    }
}
