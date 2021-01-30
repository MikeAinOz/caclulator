/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
import { Calculator } from "./calculator"
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;
    private input: HTMLInputElement;
    private answer: HTMLInputElement;
    private calculator: Calculator

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.updateCount = 0;
        if (document) {
            let encodedHTML = "PCFET0NUWVBFIGh0bWw+CjxodG1sPgo8aGVhZD4KICAgIDx0aXRsZT5DYWxjdWxhdG9yPC90aXRsZT4KICAgCjwvaGVhZD4KPGJvZHk+CgogICAgPGRpdiBpZD0iY2FsY3VsYXRvciIgYWxpZ249ImNlbnRlciI+CgogICAgICAgIDxkaXY+CiAgICAgICAgICAgIDxpbnB1dCBpZD0ic2NyZWVuIiB2YWx1ZT0iMCI+PGJyPgogICAgICAgICAgICBSZXN1bHQ6IDxpbnB1dCBpZD0iYW5zd2VyIiByZWFkb25seSB2YWx1ZT0iMCI+PGJyPgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2PgogICAgICAgICAgICA8YnV0dG9uPjE8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbj4yPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+MzwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJvcGVyYXRvciI+KzwvYnV0dG9uPgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2PgogICAgICAgICAgICA8YnV0dG9uPjQ8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbj41PC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+NjwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJvcGVyYXRvciI+LTwvYnV0dG9uPgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2PgogICAgICAgICAgICA8YnV0dG9uPjc8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbj44PC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+OTwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJvcGVyYXRvciI+LzwvYnV0dG9uPgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2PgogICAgICAgICAgICA8YnV0dG9uPjA8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbj4uPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+JTwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJvcGVyYXRvciI+KjwvYnV0dG9uPgogICAgICAgIDwvZGl2PgoKICAgICAgICA8ZGl2PgogICAgICAgICAgICA8YnV0dG9uPjAwPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+KDwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uPik8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ib3BlcmF0b3IiPl48L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0icmVzZXQiPkM8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0iZXZhbCI+PTwvYnV0dG9uPgogICAgICAgIDwvZGl2PgoKICAgIDwvZGl2PiAgICAKPC9ib2R5Pgo8L2h0bWw+";
            let new_div: HTMLElement = document.createElement('div');
            new_div.innerHTML = atob(encodedHTML);
            this.target.appendChild(new_div);
            var buttons = this.target.getElementsByTagName('button');
            var inputs = document.getElementsByTagName('input');
            this.input = inputs.item(0);
            this.answer = inputs.item(1);
            this.calculator = new Calculator(this.input,this.answer);
            for (let i = 0; i < buttons.length; i++) {
                let button = buttons[i];
                button.addEventListener("click", () => {
                    this.calculator.processButton(button);
                    //this.input.value = this.calculator.input.value
                })
            }
            /*
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("Button Count :"));
            const new_em: HTMLElement = document.createElement("em");
            this.updateCount = buttons.length;
            this.textNode = document.createTextNode(this.updateCount.toString());
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            this.target.appendChild(new_p);
            const new_p1: HTMLElement = document.createElement("p");
            new_p1.textContent = buttons.item(4).innerText;
            this.target.appendChild(new_p1);
            */
        }
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        if (this.textNode) {
            //  this.textNode.textContent = (this.updateCount++).toString();
        }
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}