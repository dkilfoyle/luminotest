import { Widget } from "@lumino/widgets";

/**
 * This is the type of the custom event we use to communicate from lumino to react/redux
 */
export interface LuminoEvent {
  detail: { id: string; name: string; closable: boolean };
}

/**
 * LuminoWidget allows us to fire custom events to the HTMLElement that is holding all
 * the widgets. This approach handles the plumbing between Lumino and React/Redux
 */
export class LuminoWidget extends Widget {
  name: string; // will be displayed in the tab
  closable: boolean; // make disable closing on some widgets if you want
  mainRef: HTMLDivElement; // reference to the element holding the widgets to fire events
  constructor(id: string, name: string, mainRef: HTMLDivElement, closable = true) {
    super({ node: LuminoWidget.createNode(id) });

    this.id = id;
    this.name = name;
    this.mainRef = mainRef;
    this.closable = closable;

    this.setFlag(Widget.Flag.DisallowLayout);
    this.addClass("content");

    this.title.label = name; // this sets the tab name
    this.title.closable = closable;
  }

  static createNode(id: string) {
    const div = document.createElement("div");
    div.setAttribute("id", id);
    return div;
  }

  /**
   * this event is triggered when we click on the tab of a widget
   */
  onActivateRequest(msg: any) {
    // create custom event
    const event = new CustomEvent("lumino:activated", this.getEventDetails());
    // fire custom event to parent element
    this.mainRef?.dispatchEvent(event);
    // continue with normal Widget behaviour
    super.onActivateRequest(msg);
  }

  /**
   * this event is triggered when the user clicks the close button
   */
  onCloseRequest(msg: any) {
    // create custom event
    const event = new CustomEvent("lumino:deleted", this.getEventDetails());
    // fire custom event to parent element
    this.mainRef?.dispatchEvent(event);
    // continue with normal Widget behaviour
    super.onCloseRequest(msg);
  }

  /**
   * creates a LuminoEvent holding name/id to properly handle them in react/redux
   */
  private getEventDetails(): LuminoEvent {
    return {
      detail: {
        id: this.id,
        name: this.name,
        closable: this.closable,
      },
    };
  }
}
