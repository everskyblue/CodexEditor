"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const tabris_1 = require("tabris");
class App {
    constructor() {
        this.showText = () => {
            $(tabris_1.TextView).only().text = 'Tabris.js rocks!';
        };
    }
    start() {
        tabris_1.contentView.append(JSX.createElement($, null,
            JSX.createElement(tabris_1.Button, { center: true, onSelect: this.showText }, "Tap here"),
            JSX.createElement(tabris_1.TextView, { centerX: true, bottom: [tabris_1.Constraint.prev, 20], font: { size: 24 } })));
    }
}
exports.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0FwcC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWlFO0FBRWpFLE1BQWEsR0FBRztJQUFoQjtRQVdVLGFBQVEsR0FBRyxHQUFHLEVBQUU7WUFDdEIsQ0FBQyxDQUFDLGlCQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7UUFDL0MsQ0FBQyxDQUFDO0lBRUosQ0FBQztJQWJRLEtBQUs7UUFDVixvQkFBVyxDQUFDLE1BQU0sQ0FDaEIsa0JBQUMsQ0FBQztZQUNBLGtCQUFDLGVBQU0sSUFBQyxNQUFNLFFBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLGVBQW1CO1lBQ3pELGtCQUFDLGlCQUFRLElBQUMsT0FBTyxRQUFDLE1BQU0sRUFBRSxDQUFDLG1CQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUMsR0FBRyxDQUNsRSxDQUNMLENBQUM7SUFDSixDQUFDO0NBTUY7QUFmRCxrQkFlQyJ9