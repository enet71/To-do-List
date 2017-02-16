class ToDoList {
    constructor(elements) {
        this.doList = elements.do;
        this.doneList = elements.done;
        this.addList = elements.add;
        this.addButton = this.addList.querySelector("#addButton");
        this.doInput = this.addList.querySelector("#doInput");
        this.inputLabel = this.addList.querySelector("#label");

        this.doNothing = document.createElement("div");
        this.doneNothing = document.createElement("div");
        this.doNothing.innerHTML = "Nothing to do";
        this.doneNothing.innerHTML = "Nothing has been done";
        this.doNothing.classList.add("nothingText");
        this.doneNothing.classList.add("nothingText");
        this.doList.appendChild(this.doNothing);
        this.doneList.appendChild(this.doneNothing);

        this.addActions();
        this.addDrag();
    }

    addActions() {
        var th = this;
        th.addList.addEventListener("click", function () {
            if (event.target.id !== 'addButton') {
                return;
            }
            var element = new Element(th.doInput.value);
            th.doList.appendChild(element.contentElement);
            th.doInput.value = "";
            th.inputLabel.classList.remove("active");
            th.checkNothing();
        });

        document.addEventListener("click", function (e) {
            if (!e.target.classList.contains("delete")) {
                return;
            }
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            th.checkNothing();
        });

        document.addEventListener("click", function (e) {
            if (e.target.type != "checkbox") {
                return;
            }

            var parent = e.target.parentNode;
            if (e.target.checked) {
                th.doneList.insertBefore(parent, th.doneList.childNodes[0]);
                parent.classList.add("done");
            } else {
                th.doList.appendChild(parent);
                parent.classList.remove("done");
            }
            th.checkNothing();
        });
    }

    addDrag() {
        var clearElement = Element.clearElement;
        document.addEventListener("mousedown", function (e) {
            if (e.which != 1) {
                return;
            }

            if (!e.target.classList.contains("move")) {
                return;
            }

            var dragObject = e.target.parentNode;
            var parent = e.target.closest(".collection");
            var coordsParent = parent.getBoundingClientRect();
            var coordsObject = dragObject.getBoundingClientRect();
            var shiftY = e.pageY - coordsObject.top;
            var shiftYScroll = e.clientY - coordsObject.top;
            var shiftElement;

            clearElement.style.height = dragObject.offsetHeight + "px";
            document.onmousemove = function (e) {
                var coordsParentNew = parent.getBoundingClientRect();
                var coordsObjectNew = dragObject.getBoundingClientRect();

                setDragStyles(dragObject, "absolute", "100%", "99999", "0.8");

                if (e.clientY + shiftYScroll > coordsParentNew.bottom) {
                    dragObject.style.top = coordsParentNew.bottom - coordsParentNew.top - dragObject.offsetHeight + "px";
                    shiftElement = parent.childNodes[parent.childNodes.length];
                    parent.appendChild(clearElement);
                } else if (e.pageY - shiftY < coordsParentNew.top) {
                    dragObject.style.top = 0;
                    shiftElement = parent.childNodes[0];
                    parent.insertBefore(clearElement, shiftElement);
                } else {
                    dragObject.style.top = e.pageY - coordsParent.top - shiftY + "px";
                    shiftElement = document.elementFromPoint(coordsObjectNew.left + 50, coordsObjectNew.bottom + 5);
                    if (shiftElement) {
                        shiftElement = shiftElement.closest(".collection-item");
                    }
                    if (shiftElement != dragObject) {
                        parent.insertBefore(clearElement, shiftElement);
                    }
                }

                document.onmouseup = function () {
                    setDragStyles(dragObject);
                    parent.insertBefore(dragObject, shiftElement);
                    parent.removeChild(clearElement);
                    // document.onmousemove = null;
                    // document.onmouseup = null;
                };

                function setDragStyles(object, position, width, zIndex, opacity) {
                    object.style.position = position || "";
                    object.style.width = width || "";
                    object.style.zIndex = zIndex || "";
                    object.style.opacity = opacity || "";
                }

                // return false;
            };
        });
    }

    checkNothing() {
        this.doNothing.hidden = this.doList.childNodes.length > 2;
        this.doneNothing.hidden = this.doneList.childNodes.length > 2;
    }
}

function counter() {
    var n = 0;

    var value = function () {
        return n;
    };

    value.nextValue = function () {
        return n++;
    };

    return value;
}
var index = counter();

class Element {
    constructor(text) {
        this.text = text;
    }

    get contentElement() {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }

        var text = '<i class="fa fa-arrows-v move" aria-hidden="true"></i><input type="checkbox" id="myCheckbox' + index() + '" class="filled-in"/>' +
            '<label for="myCheckbox' + index.nextValue() + '" style="top:2px"></label>' +
            '<span class="text">' + this.text + '</span>' +
            '<span class="date">' + day + '.' + month + '.' + date.getFullYear() + '</span>' +
            '<a class="waves-effect waves-light btn delete">Delete</a>';
        var element = Element.clearElement;
        element.innerHTML = text;

        return element;
    }

    static get clearElement() {
        var element = document.createElement("div");
        element.classList.add("collection-item");
        element.classList.add("valign-wrapper");
        element.classList.add("item-style");
        return element;
    }
}