import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { BoxPanel, DockPanel, Widget } from "@lumino/widgets";
import { Provider, useSelector } from "react-redux";
import { store, useAppDispatch } from "../../store/store";
import { selectWidgets, AppWidget, AppWidgetType, deleteWidget, activateWidget } from "../../store/widgetsSlice";
import { LuminoEvent, LuminoWidget } from "./LuminoWidget";
import Watcher from "../counter/Watcher";
import Incrementor from "../counter/Incrementor";
import Decrementor from "../counter/Decrementor";
import "./Lumino.css";

/**
 * Props of any component that will be rendered inside a LuminoWidget
 */
export interface ReactWidgetProps {
  id: string;
  name: string;
}

/**
 * Type of any component that will be rendered inside a LuminoWidget
 */
export type ReactWidget = React.FC<ReactWidgetProps>;

/**
 * Method to return the component corresponding to the widgettype
 */
const getComponent = (type: AppWidgetType): ReactWidget => {
  switch (type) {
    case "WATCHER":
      return Watcher;
    case "INCREMENTOR":
      return Incrementor;
    case "DECREMENTOR":
      return Decrementor;
    default:
      return Watcher;
  }
};

/**
 * Initialize Boxpanel and Dockpanel globally once to handle future calls
 */
const main = new BoxPanel({ direction: "left-to-right", spacing: 0 });
const dock = new DockPanel();

let attached = false;

/**
 * This component watches the widgets redux state and draws them
 */
const Lumino: React.FC = () => {
  // const [attached, setAttached] = useState(false); // avoid attaching DockPanel and BoxPanel twice
  const mainRef = useRef<HTMLDivElement>(null); // reference for Element holding our Widgets
  const [renderedWidgetIds, setRenderedWidgetIds] = useState<string[]>([]); // tracker of components that have been rendered with LuminoWidget already
  const widgets = useSelector(selectWidgets); // widgetsState
  const dispatch = useAppDispatch();

  /**
   * creates a LuminoWidget and adds it to the DockPanel. Id of widget is added to renderedWidgets
   */
  const addWidget = useCallback((w: AppWidget) => {
    if (mainRef.current === null) return;
    setRenderedWidgetIds((cur) => [...cur, w.id]);
    const lum = new LuminoWidget(w.id, w.tabTitle, mainRef.current, true);
    dock.addWidget(lum);
  }, []);

  /**
   * watch widgets state and calls addWidget for Each. After addWidget is executed we look
   * for the element in the DOM and use React to render the Component into the widget
   * NOTE: We need to use Provider in order to access the Redux State inside the widgets.
   */
  useEffect(() => {
    if (!attached) return;
    widgets.forEach((w) => {
      if (renderedWidgetIds.includes(w.id)) return; // avoid drawing widgets twice
      addWidget(w); // addWidget to DOM
      const el = document.getElementById(w.id); // get DIV
      const Component = getComponent(w.type); // get Component for TYPE
      if (el) {
        ReactDOM.render(
          // draw Component into Lumino DIV
          <Provider store={store}>
            <Component id={w.id} name={w.tabTitle} />
          </Provider>,
          el
        );
      }
    });
  }, [widgets, attached, addWidget, renderedWidgetIds]);

  /**
   * This effect initializes the BoxPanel and the Dockpanel and adds event listeners
   * to dispatch proper Redux Actions for our custom events
   */
  useEffect(() => {
    if (mainRef.current === null || attached === true) {
      return;
    }
    main.id = "main";
    main.addClass("main");
    dock.id = "dock";
    window.onresize = () => main.update();
    BoxPanel.setStretch(dock, 1);
    Widget.attach(main, mainRef.current);
    // setAttached(true);
    attached = true;
    main.addWidget(dock);
    // dispatch activated action
    mainRef.current.addEventListener("lumino:activated", (e: Event) => {
      const le = e as unknown as LuminoEvent;
      dispatch(activateWidget(le.detail.id));
    });
    // dispatch deleted action
    mainRef.current.addEventListener("lumino:deleted", (e: Event) => {
      const le = e as unknown as LuminoEvent;
      dispatch(deleteWidget(le.detail.id));
    });
  }, [mainRef, attached, dispatch]);

  return <div ref={mainRef} className={"main"} />;
};

export default Lumino;
