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
import { calculator } from "./calculator"
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;
    private input: HTMLInputElement;
    private answer: HTMLInputElement;
    private calculator: calculator

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.updateCount = 0;
        if (document) {
            let encodedHTML = "IDxkaXYgaWQ9ImNhbGN1bGF0b3IiIGFsaWduPSJjZW50ZXIiPgoKICAgICAgICA8ZGl2PgogICAgICAgICAgICA8aW5wdXQgaWQ9InNjcmVlbiIgdmFsdWU9IjAiPjxicj4KICAgICAgICAgICAgUmVzdWx0OiA8aW5wdXQgaWQ9ImFuc3dlciIgcmVhZG9ubHkgdmFsdWU9IjAiPjxicj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdj4KICAgICAgICAgICAgPGJ1dHRvbj4xPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+MjwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uPjM8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ib3BlcmF0b3IiPis8L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdj4KICAgICAgICAgICAgPGJ1dHRvbj40PC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+NTwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uPjY8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ib3BlcmF0b3IiPi08L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdj4KICAgICAgICAgICAgPGJ1dHRvbj43PC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+ODwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uPjk8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ib3BlcmF0b3IiPi88L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdj4KICAgICAgICAgICAgPGJ1dHRvbj4wPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24+LjwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uPiU8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz0ib3BlcmF0b3IiPng8L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KCiAgICAgICAgPGRpdj4KICAgICAgICAgICAgPGJ1dHRvbj4wMDwvYnV0dG9uPgogICAgICAgICAgICA8YnV0dG9uPig8L2J1dHRvbj4KICAgICAgICAgICAgPGJ1dHRvbj4pPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9Im9wZXJhdG9yIj5ePC9idXR0b24+CiAgICAgICAgPC9kaXY+CgogICAgICAgIDxkaXY+CiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9InJlc2V0Ij5DPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9ImV2YWwiPj08L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KCiAgICA8L2Rpdj4gICAg";
            let new_div: HTMLElement = document.createElement('div');
            new_div.innerHTML = atob(encodedHTML);
            this.target.appendChild(new_div);
            var buttons = this.target.getElementsByTagName('button');
            var inputs = document.getElementsByTagName('input');
            this.input = inputs.item(0);
            this.answer = inputs.item(1);
            this.calculator = new calculator(this.input,this.answer);
            this.answer.value = buttons.length.toString();
            for (let i = 0; i < buttons.length; i++) {
                let button = buttons[i];
                button.addEventListener("click", () => {
                    this.calculator.processButton(button);
                    //this.input.value = this.calculator.input.value
                })
            }
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