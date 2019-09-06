(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../lib/fleissner-cipher/fleissner-cipher.js":
/*!***************************************************!*\
  !*** ../lib/fleissner-cipher/fleissner-cipher.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { or, range, forEach, map, slice } = __webpack_require__(/*! ramda */ "../node_modules/ramda/es/index.js")
const { mapMatrix, rotateRight } = __webpack_require__(/*! ../rotation/rotation */ "../lib/rotation/rotation.js")
const { random, seed } = __webpack_require__(/*! ../random/random */ "../lib/random/random.js")

const createAny = ({ size }) => {
    return range(0, size)
        .map(() => range(0, size)
            .map(() => false)
        )
}


const punctuateMatrix = ({ coordinate, matrix }) => {
    const { x, y } = coordinate
    matrix[x][y] = true
    return matrix;
}

const randomRotation = ({ matrix }) => {
    const times = Math.ceil(random() * 4)
    let result = matrix
    forEach((_) => {
        result = rotateRight(result)
    }, range(0, times))
    return result
}

const shapeMsgToKey = (key, message, fn = (message) => (cell) => (message.length > 0 && cell) ? message.pop() : '') => {
    return map((row) => {
        return map(fn(message), row)
    }, key)
}

const createEmptySquare = (key) => {
    return shapeMsgToKey(key, '', (message) => () => '')
}

const completeSquare = (key, message, square) => {
    if (message.length <= 0) {
        return square
    }
    return completeSquare(rotateRight(key), message, mapMatrix(
        (first, second) => {
            return first + second
        },
        square,
        shapeMsgToKey(key, message)
    ))
}

const ABC = range(0, 26).map((char) => String.fromCharCode(65 + char)).join('')

module.exports = {
    createMatrix: ({ size, salt }) => {
        if (size % 2 !== 0) {
            throw new Error('Only even sized square sides are allowed!')
        }
        if (size < 0) {
            throw new Error('Only positive sized squre sides are allowed!')
        }

        seed(salt)

        const falsyMatrix = createAny({ size })
        const halfSideLength = size / 2
        let punctuatedMatrix = falsyMatrix
        forEach((row) => {
            forEach((col) => {
                const onePointMatrix = randomRotation({
                    matrix: punctuateMatrix({
                        coordinate: { x: col, y: row },
                        matrix: createAny({ size })
                    })
                })
                punctuatedMatrix = mapMatrix(or, onePointMatrix, punctuatedMatrix)
            }, range(0, halfSideLength))
        }, range(0, halfSideLength))
        const result = punctuatedMatrix
        return result
    },
    encrypt: (key, text, fillup = ABC) => {
        let result = [];
        const keySize = Math.pow(key.length, 2)
        while (text.length > 0) {
            let message = slice(0, keySize, text).split('').reverse()
            text = slice(keySize, Infinity, text)
            if (message.length < keySize) {
                message = slice(
                    0,
                    keySize - message.length,
                    fillup.repeat(Math.ceil(keySize / fillup.length))
                )
                    .split('')
                    .reverse()
                    .concat(message)
            }
            result.push(
                completeSquare(
                    key,
                    message,
                    createEmptySquare(key)
                )
            )
        }
        return result;
    }
}

/***/ }),

/***/ "../lib/random/random.js":
/*!*******************************!*\
  !*** ../lib/random/random.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// the initial seed
let seed = (new Date()).getTime();
const hashCode = (str) => {
    let hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
const seededRandom = function () {
    const max = 1;
    const min = 0;

    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280;

    return Math.abs(min + rnd * (max - min));
}

module.exports = {
    random: seededRandom,
    seed: (s) => {
        s = s || (new Date()).getTime()
        seed = hashCode(s.toString())
    }
}


/***/ }),

/***/ "../lib/rotation/rotation.js":
/*!***********************************!*\
  !*** ../lib/rotation/rotation.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const R = __webpack_require__(/*! ramda */ "../node_modules/ramda/es/index.js")

module.exports = {

    rotateRight: (input) => {
        // reverse the rows
        let matrix = R.clone(input).reverse();
        // swap the symmetric elements
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < i; j++) {
                var temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        return matrix;
    },

    isSquare: (matrix) => {
        const lengths = matrix.map( (m) => m.length)
        return lengths.reduce((init, l) => {
            return init && l === matrix.length;
        }, true)
    },

    mergeBooleanMatrices: (first, second) => {
        return first.map((row, rowIdx) => {
            return row.map((col, colIndex) => {
                return col && second[rowIdx][colIndex]
            })  
        })
    },

    mapMatrix: (fn, first, second) => {
        return first.map((row, rowIdx) => {
            return row.map((col, colIdx) => {
                return fn (col, second[rowIdx][colIdx])
            })  
        })
    },

    matrix2Str: (matrix) => {
        return matrix.map((row) => {
            return row.map((x) => (x)?"1": "0").join('  ')
        }).join('\n')
    },

    countFields: (matrix) => {
        let count = 0
        matrix.forEach((row) => {
            row.forEach((field) => {
                if (field) {
                    count += 1;
                }
            })
        })
        return count;
    }
}

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\r\n<div style=\"text-align:center\">\r\n  <h1>{{title}}</h1>\r\n  <app-even-size-selector></app-even-size-selector>\r\n</div>\r\n<hr>\r\n<h2>Wie nutzt man den Schlüssel?</h2>\r\n<ol>\r\n  <li>Schlüssel ausdrucken und an den Schnittmarken ausschneiden</li>\r\n  <li>Den Schlüssel auf ein Stück Papier legen und in die Löcher die geheime Nachricht eintragen</li>\r\n  <li>Den Schlüssel um 90 Grad drehen</li>\r\n  <li>Bei Punkt 2 wieder einsteigen und max noch zwei mal wiederholen</li>\r\n  <li>Dann entweder ein neues Buchstabenquadrat beginnen</li>\r\n  <li>Oder sollte die Nachricht zuende sein, die restlichen Felder mit Verschleierungszeichen füllen wie 'A B C ...'</li>\r\n</ol>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'Fleissner Schiffre Generator';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _boolean_matrix_boolean_matrix_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./boolean-matrix/boolean-matrix.component */ "./src/app/boolean-matrix/boolean-matrix.component.ts");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "./node_modules/@fortawesome/angular-fontawesome/fesm5/angular-fontawesome.js");
/* harmony import */ var _even_size_selector_even_size_selector_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./even-size-selector/even-size-selector.component */ "./src/app/even-size-selector/even-size-selector.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _boolean_matrix_boolean_matrix_component__WEBPACK_IMPORTED_MODULE_4__["BooleanMatrixComponent"],
                _even_size_selector_even_size_selector_component__WEBPACK_IMPORTED_MODULE_6__["EvenSizeSelectorComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_5__["FontAwesomeModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/boolean-matrix/boolean-matrix.component.css":
/*!*************************************************************!*\
  !*** ./src/app/boolean-matrix/boolean-matrix.component.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".booleanMatrix {\r\n    box-shadow: 0.5em 0.5em 0.4em grey;\r\n    margin: 0 auto;\r\n    background-color: rgba(256, 256, 256, 0);\r\n    border: 0.1em;\r\n    border-style: dashed;\r\n    display: inline-block;\r\n}\r\n\r\n.booleanMatrix_grid {\r\n    display: inline-block;\r\n    width: 1.5em;\r\n    height: 1.5em;\r\n    border-left-width: 0.5em;\r\n    border-top-width: 0.5em;\r\n    border-bottom-width: 0em;\r\n    border-right-width: 0em;\r\n    border-color: white;\r\n    border-style: solid;\r\n    background-color: rgba(256, 256, 256, 0);\r\n}\r\n\r\n.booleanMatrix_rightBorder {\r\n    display: inline-block;\r\n    border-color: white;\r\n    border-left-width: 0em;\r\n    border-top-width: 0em;\r\n    border-right-width: 0.5em;\r\n    border-bottom-width: 0.5em;\r\n    border-style: solid;\r\n}\r\n\r\n.booleanMatrix_cell {\r\n    display: inline-block;\r\n    width: 1.5em;\r\n    height: 1.5em;\r\n}\r\n\r\n.booleanMatrix--cutout--scissors {\r\n    position:relative;\r\n    display: inline-block;\r\n    width: 0.1em;\r\n    height: 0.1em;\r\n    left: -0.5em;\r\n    top: -0.5em;\r\n}\r\n\r\n.booleanMatrix--cutout {\r\n    border-style: dashed;\r\n    border-color: black;\r\n    border-width: 0.1em;\r\n    margin-top: -0.1em;\r\n    position: relative;\r\n    top: 0.1em;\r\n    display:  inline-block;\r\n    width: 1.3em;\r\n    height: 1.3em;\r\n}\r\n\r\n.booleanMatrix_cell--visible {\r\n    background-color: rgba(256, 256, 256, 0);\r\n}\r\n\r\n.booleanMatrix_cell--invisible {\r\n    background-color: rgba(256, 256, 256, 1);\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYm9vbGVhbi1tYXRyaXgvYm9vbGVhbi1tYXRyaXguY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLG1DQUFtQztJQUNuQyxlQUFlO0lBQ2YseUNBQXlDO0lBQ3pDLGNBQWM7SUFDZCxxQkFBcUI7SUFDckIsc0JBQXNCO0NBQ3pCOztBQUVEO0lBQ0ksc0JBQXNCO0lBQ3RCLGFBQWE7SUFDYixjQUFjO0lBQ2QseUJBQXlCO0lBQ3pCLHdCQUF3QjtJQUN4Qix5QkFBeUI7SUFDekIsd0JBQXdCO0lBQ3hCLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDcEIseUNBQXlDO0NBQzVDOztBQUVEO0lBQ0ksc0JBQXNCO0lBQ3RCLG9CQUFvQjtJQUNwQix1QkFBdUI7SUFDdkIsc0JBQXNCO0lBQ3RCLDBCQUEwQjtJQUMxQiwyQkFBMkI7SUFDM0Isb0JBQW9CO0NBQ3ZCOztBQUVEO0lBQ0ksc0JBQXNCO0lBQ3RCLGFBQWE7SUFDYixjQUFjO0NBQ2pCOztBQUVEO0lBQ0ksa0JBQWtCO0lBQ2xCLHNCQUFzQjtJQUN0QixhQUFhO0lBQ2IsY0FBYztJQUNkLGFBQWE7SUFDYixZQUFZO0NBQ2Y7O0FBRUQ7SUFDSSxxQkFBcUI7SUFDckIsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLFdBQVc7SUFDWCx1QkFBdUI7SUFDdkIsYUFBYTtJQUNiLGNBQWM7Q0FDakI7O0FBQ0Q7SUFDSSx5Q0FBeUM7Q0FDNUM7O0FBRUQ7SUFDSSx5Q0FBeUM7Q0FDNUMiLCJmaWxlIjoic3JjL2FwcC9ib29sZWFuLW1hdHJpeC9ib29sZWFuLW1hdHJpeC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmJvb2xlYW5NYXRyaXgge1xyXG4gICAgYm94LXNoYWRvdzogMC41ZW0gMC41ZW0gMC40ZW0gZ3JleTtcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTYsIDI1NiwgMjU2LCAwKTtcclxuICAgIGJvcmRlcjogMC4xZW07XHJcbiAgICBib3JkZXItc3R5bGU6IGRhc2hlZDtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufVxyXG5cclxuLmJvb2xlYW5NYXRyaXhfZ3JpZCB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB3aWR0aDogMS41ZW07XHJcbiAgICBoZWlnaHQ6IDEuNWVtO1xyXG4gICAgYm9yZGVyLWxlZnQtd2lkdGg6IDAuNWVtO1xyXG4gICAgYm9yZGVyLXRvcC13aWR0aDogMC41ZW07XHJcbiAgICBib3JkZXItYm90dG9tLXdpZHRoOiAwZW07XHJcbiAgICBib3JkZXItcmlnaHQtd2lkdGg6IDBlbTtcclxuICAgIGJvcmRlci1jb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTYsIDI1NiwgMjU2LCAwKTtcclxufVxyXG5cclxuLmJvb2xlYW5NYXRyaXhfcmlnaHRCb3JkZXIge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgYm9yZGVyLWNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlci1sZWZ0LXdpZHRoOiAwZW07XHJcbiAgICBib3JkZXItdG9wLXdpZHRoOiAwZW07XHJcbiAgICBib3JkZXItcmlnaHQtd2lkdGg6IDAuNWVtO1xyXG4gICAgYm9yZGVyLWJvdHRvbS13aWR0aDogMC41ZW07XHJcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG59XHJcblxyXG4uYm9vbGVhbk1hdHJpeF9jZWxsIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHdpZHRoOiAxLjVlbTtcclxuICAgIGhlaWdodDogMS41ZW07XHJcbn1cclxuXHJcbi5ib29sZWFuTWF0cml4LS1jdXRvdXQtLXNjaXNzb3JzIHtcclxuICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgd2lkdGg6IDAuMWVtO1xyXG4gICAgaGVpZ2h0OiAwLjFlbTtcclxuICAgIGxlZnQ6IC0wLjVlbTtcclxuICAgIHRvcDogLTAuNWVtO1xyXG59XHJcblxyXG4uYm9vbGVhbk1hdHJpeC0tY3V0b3V0IHtcclxuICAgIGJvcmRlci1zdHlsZTogZGFzaGVkO1xyXG4gICAgYm9yZGVyLWNvbG9yOiBibGFjaztcclxuICAgIGJvcmRlci13aWR0aDogMC4xZW07XHJcbiAgICBtYXJnaW4tdG9wOiAtMC4xZW07XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0b3A6IDAuMWVtO1xyXG4gICAgZGlzcGxheTogIGlubGluZS1ibG9jaztcclxuICAgIHdpZHRoOiAxLjNlbTtcclxuICAgIGhlaWdodDogMS4zZW07XHJcbn1cclxuLmJvb2xlYW5NYXRyaXhfY2VsbC0tdmlzaWJsZSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NiwgMjU2LCAyNTYsIDApO1xyXG59XHJcblxyXG4uYm9vbGVhbk1hdHJpeF9jZWxsLS1pbnZpc2libGUge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTYsIDI1NiwgMjU2LCAxKTtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/boolean-matrix/boolean-matrix.component.html":
/*!**************************************************************!*\
  !*** ./src/app/boolean-matrix/boolean-matrix.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n  <div class=\"booleanMatrix\">\r\n    <fa-icon class=\"booleanMatrix--cutout--scissors\" [icon]=\"faCut\"></fa-icon>\r\n    <div class=\"booleanMatrix_rightBorder\">\r\n      <div *ngFor=\"let row of matrix\">\r\n        <div *ngFor=\"let col of row\" class=\"booleanMatrix_grid\">\r\n          <div *ngIf=\"!col; else hole\" class=\"booleanMatrix_cell booleanMatrix_cell--invisible\">\r\n            &nbsp;\r\n          </div>\r\n          <ng-template #hole>\r\n            <div class=\"booleanMatrix_cell--visible booleanMatrix--cutout\">\r\n              <fa-icon class=\"booleanMatrix--cutout--scissors\" [icon]=\"faCut\"></fa-icon>\r\n            </div>\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/boolean-matrix/boolean-matrix.component.ts":
/*!************************************************************!*\
  !*** ./src/app/boolean-matrix/boolean-matrix.component.ts ***!
  \************************************************************/
/*! exports provided: BooleanMatrixComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BooleanMatrixComponent", function() { return BooleanMatrixComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _fleissner_cipher_wrapper_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fleissner-cipher-wrapper.service */ "./src/app/fleissner-cipher-wrapper.service.ts");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BooleanMatrixComponent = /** @class */ (function () {
    function BooleanMatrixComponent(fleissnerCipher) {
        this.fleissnerCipher = fleissnerCipher;
        this.faCut = _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_2__["faCut"];
        this.service = fleissnerCipher;
    }
    BooleanMatrixComponent.prototype.ngOnChanges = function (changes) {
        if (changes.size) {
            this.currentSize = parseInt(changes.size.currentValue, 10);
        }
        if (changes.salt) {
            this.currentSalt = changes.salt.currentValue;
        }
        this.matrix = this.service.createMatrix(this.currentSize, this.currentSalt);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], BooleanMatrixComponent.prototype, "size", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], BooleanMatrixComponent.prototype, "salt", void 0);
    BooleanMatrixComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-boolean-matrix',
            template: __webpack_require__(/*! ./boolean-matrix.component.html */ "./src/app/boolean-matrix/boolean-matrix.component.html"),
            styles: [__webpack_require__(/*! ./boolean-matrix.component.css */ "./src/app/boolean-matrix/boolean-matrix.component.css")]
        }),
        __metadata("design:paramtypes", [_fleissner_cipher_wrapper_service__WEBPACK_IMPORTED_MODULE_1__["FleissnerCipherWrapperService"]])
    ], BooleanMatrixComponent);
    return BooleanMatrixComponent;
}());



/***/ }),

/***/ "./src/app/even-size-selector/even-size-selector.component.css":
/*!*********************************************************************!*\
  !*** ./src/app/even-size-selector/even-size-selector.component.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2V2ZW4tc2l6ZS1zZWxlY3Rvci9ldmVuLXNpemUtc2VsZWN0b3IuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/even-size-selector/even-size-selector.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/even-size-selector/even-size-selector.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form>\r\n  <label for=\"size\">Seitenlänge</label>\r\n  <select [(ngModel)]=\"model.selectedSize\" name=\"size\" id=\"size\">\r\n    <option *ngFor=\"let size of evenSizes\" [value]=\"size\">{{size}}</option>\r\n  </select>\r\n\r\n  <label for=\"salt\">Salt</label>\r\n  <input [(ngModel)]=\"model.salt\" type=\"text\" id=\"salt\" name=\"salt\" [value]=\"salt\"/>\r\n</form>\r\n<hr>\r\n<app-boolean-matrix [size]=\"model.selectedSize\" [salt]=\"model.salt\"></app-boolean-matrix>"

/***/ }),

/***/ "./src/app/even-size-selector/even-size-selector.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/even-size-selector/even-size-selector.component.ts ***!
  \********************************************************************/
/*! exports provided: EvenSizeSelectorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EvenSizeSelectorComponent", function() { return EvenSizeSelectorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EvenSizeSelectorComponent = /** @class */ (function () {
    function EvenSizeSelectorComponent() {
        this.model = { selectedSize: 6 };
        this.evenSizes = [];
        for (var i = 2; i <= 20; i += 2) {
            this.evenSizes.push(i);
        }
    }
    EvenSizeSelectorComponent.prototype.ngOnInit = function () { };
    EvenSizeSelectorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-even-size-selector',
            template: __webpack_require__(/*! ./even-size-selector.component.html */ "./src/app/even-size-selector/even-size-selector.component.html"),
            styles: [__webpack_require__(/*! ./even-size-selector.component.css */ "./src/app/even-size-selector/even-size-selector.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], EvenSizeSelectorComponent);
    return EvenSizeSelectorComponent;
}());



/***/ }),

/***/ "./src/app/fleissner-cipher-wrapper.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/fleissner-cipher-wrapper.service.ts ***!
  \*****************************************************/
/*! exports provided: CreateMatrixParams, FleissnerCipherWrapperService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateMatrixParams", function() { return CreateMatrixParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FleissnerCipherWrapperService", function() { return FleissnerCipherWrapperService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lib_fleissner_cipher_fleissner_cipher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/fleissner-cipher/fleissner-cipher */ "../lib/fleissner-cipher/fleissner-cipher.js");
/* harmony import */ var _lib_fleissner_cipher_fleissner_cipher__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_fleissner_cipher_fleissner_cipher__WEBPACK_IMPORTED_MODULE_1__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CreateMatrixParams = /** @class */ (function () {
    function CreateMatrixParams() {
    }
    return CreateMatrixParams;
}());

var FleissnerCipherWrapperService = /** @class */ (function () {
    function FleissnerCipherWrapperService() {
    }
    FleissnerCipherWrapperService.prototype.createMatrix = function (size, salt) {
        return _lib_fleissner_cipher_fleissner_cipher__WEBPACK_IMPORTED_MODULE_1___default.a.createMatrix({ size: size, salt: salt });
    };
    FleissnerCipherWrapperService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], FleissnerCipherWrapperService);
    return FleissnerCipherWrapperService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\projects\fleissner-cipher\print-layout\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map