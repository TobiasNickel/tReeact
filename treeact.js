// loading tXML, an xmlParser by Tobias Nickel(https://github.com/TobiasNickel/tXml)
function tXml(b){function k(){for(var f=[];b[a];){
    if(60==b.charCodeAt(a)){if(47===b.charCodeAt(a+1)){a=b.indexOf(">",a);break
    }else if(33===b.charCodeAt(a+1)){if(45==b.charCodeAt(a+2)){
        for(;62!==b.charCodeAt(a)||45!=b.charCodeAt(a-1)||45!=b.charCodeAt(a-2)||-1==a;)a=b.indexOf(">",a+1);-1===a&&(a=b.length)
        }else for(a+=2;62!==b.charCodeAt(a);)a++;a++;continue}var d={};a++;d.tagName=c();
        for(var g=!1;62!==b.charCodeAt(a);){var e=b.charCodeAt(a);if(64<e&&91>e||96<e&&123>e){
            for(var l=c(),e=b.charCodeAt(a);39!==
e&&34!==e;)a++,e=b.charCodeAt(a);var e=b[a],m=++a;a=b.indexOf(e,m);e=b.slice(m,a);g||(d.attributes={},g=!0);
d.attributes[l.toLowerCase()]=e}a++}47!==b.charCodeAt(a-1)&&("script"==d.tagName?(g=a,a=b.indexOf("\x3c/script>",a),d.children=[b.slice(g,a-1)],a+=8):"style"==d.tagName?(g=a,a=b.indexOf("</style>",a),d.children=[b.slice(g,a-1)],a+=7):-1==h.indexOf(d.tagName)&&(a++,d.children=k(l)));f.push(d)}else d=a,a=b.indexOf("<",a)-1,-2===a&&(a=b.length),d=b.slice(d,a+1),0<d.trim().length&&f.push(d);a++}return f}
function c(){for(var c=a;-1===g.indexOf(b[a]);)a++;return b.slice(c,a)}
var g="\n\t>/= ",h=["img","br","input"],a=0;return k()}
function TOMObjToXML(b){function k(b){if(b)for(var h=0;h<b.length;h++)
if("string"==typeof b[h])c+=b[h].trim();else{var a=b[h];c+="<"+a.tagName;var f=void 0;for(f in a.attributes)c=-1===a.attributes[f].indexOf('"')?c+(" "+f+'="'+a.attributes[f].trim()+'"'):c+(" "+f+"='"+a.attributes[f].trim()+"'");c+=">";k(a.children);c+="</"+a.tagName+">"}}var c="";Array.isArray(b)||(b=[b]);k(b);return c};


/**
 *@author: Tobias Nickel
 *  Inspired by the awesome reactJS, I'd like to provide an alternative,
 *  that allowes you to use techniques, that you already use.
 *
 *  So, it is a module, that render your HTML to the dom and only updates the nessasary elements.
 *  it is so effective, that you can rerender your entire web-app each time, when data changes.
 *  your eventlistener keep available and you can even use css transition between one and a new rendering.
 */
var TreeAct = (function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(cb) {
      setTimeout(cb, 0);
    };

    function TreeAct(root) {
      this.root = root;
      root.innerHTML = '';
      this.struct = '';
      this.struct.ids = {};
      this.components = {};
    }



    var creator = document.createElement('div'); // used by getNode()
    /**
     *creates the DOM node of a tXml-node
     */
    function getNode(xml) {
        creator.innerHTML = TOMObjToXML(xml);
        return creator.firstChild;
    }

    function createRootNode(txmlNode){
        if(Array.isArray(txmlNode)){
          return getNode(txmlNode);
        }
        var root = document.createElement(txmlNode.tagName);
        var attr = txmlNode.attributes;
        if(attr){
          for(var i in attr){
            root.setAttribute(i, attr[i]);
          }
        }
        return root;
    }

    /**
     * try to find the element with a given id in the attribute
     * @param list {Array} the list to search in, often a tXML child-List
     * @param id {string} the id of the searched element
     */
    function indexOfId(list, id) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].attributes && list[i].attributes.id == id) {
                return i;
            }
        }
        return -1;
    }


    /**
     * the core method of this framework. it is responsible for the reconsilation.
     *
     * this is a recursive method, that goes recursive trough the tree-structure of a Document.
     * there are no tests, stop on circular structures, objects parsed by tXml are never circular as XML is.
     *
     * @param xml {tXml} tXml document, representing the new tree.
     * @param oldXml {tXml} the old tXml-Document, the tree as is is currently displayed.
     * @param root {DOM-node} the DOM-node, that is displaying the html.
     */
    function updateChildren(xml, orgXml, root, tReeAct) {
        if (!xml) {
            root.innerHTML = '';
            return;
        }

        orgXml = orgXml || [];
        orgXml.ids = orgXml.ids || {};

        //make sure, the nodes and objects are connected
        if (orgXml[0] && !orgXml[0].node) {
            var children = root.childNodes;
            for (var i = 0; i < orgXml.length; i++) {
                if (typeof orgXml[i] == "string") orgXml[i] = [orgXml[i]];
                orgXml[i].label = getNodeLabel(orgXml[i]);
                orgXml[i].node = children[i];
                if (orgXml[i].attributes && orgXml[i].attributes.id)
                    orgXml.ids[orgXml[i].attributes.id] = orgXml[i]
            }
        }

        var ids = {}; // id : xmlMapping (xml has node attribute): has indexAttribute, for the index in orgXml
        // used to reuse the elements that have an ID.
        for (var i = 0; i < xml.length; i++) {
            if (typeof xml[i] == 'string') xml[i] = [xml[i]];
            var cXml = xml[i];
            cXml.label = getNodeLabel(cXml);
            cXml.index = i;
            if (!orgXml[i]) {
                // nothing to compare with: create
                cXml.node = createRootNode(cXml);
                insertAt(root, cXml.node, i);

                if(cXml.attributes && cXml.attributes.component) {
                  cXml.component = tReeAct.components[cXml.attributes.component](cXml.node, tReeAct);
                }
                updateChildren(cXml.children, '', cXml.node, tReeAct);
                if(cXml.component && cXml.component.didRender) cXml.component.didRender(cXml.node, tReeAct);
                if (cXml.attributes && cXml.attributes.id) ids[cXml.attributes.id] = cXml;
            } else if (cXml.attributes && cXml.attributes.id) {
                // try to reuse & compare childs
                //  elements that has an id
                var id = cXml.attributes.id;
                ids[cXml.attributes.id] = cXml;
                // check for existence
                if (orgXml.ids[id]) {
                    // ensure position & compare childs
                    if (id !== orgXml.ids[id].index)
                        moveElement(orgXml, orgXml.ids[id].index, id);
                    updateNode(cXml, orgXml.ids[id]);
                    updateChildren(cXml.children, orgXml.ids[id].children, orgXml.ids[id].node, tReeAct);
                } else {
                    //exchange complete
                    var node = getNode(cXml);
                    xml.node = node;
                    root.insertBefore(node, orgXml[i].node);
                    orgXml[i].node.remove();
                }
            } else if (cXml.label == orgXml[i].label) {
                //compare childs
                updateNode(cXml, orgXml[i]);
                updateChildren(cXml.children, orgXml[i].children, orgXml[i].node, tReeAct);
            } else if (cXml[i] !== orgXml[i][0] || cXml.tagName !== orgXml[0].tagName || getComponent(cXml) !== getComponent(orgXml[0])) {
                //exchange complete
                cXml.node = createRootNode(cXml);;
                root.insertBefore(cXml.node, orgXml[i].node);
                orgXml[i].node.remove();

                if(cXml.attributes && cXml.attributes.component) {
                  cXml.component = tReeAct.components[cXml.attributes.component](cXml.node, tReeAct);
                }
                updateChildren(cXml.children, '', cXml.node, tReeAct);
                if(cXml.component && cXml.component.didRender) cXml.component.didRender(cXml.node, tReeAct);
                if (cXml.attributes && cXml.attributes.id) ids[cXml.attributes.id] = cXml;
            }else{
                //compare childs
                updateNode(cXml, orgXml[i]);
                updateChildren(cXml.children, orgXml[i].children, orgXml[i].node, tReeAct);
            }
        }
        for (; i < orgXml.length; i++) {
            orgXml[i].node.remove();
        }
        xml.ids = ids;
    }

    function getComponent(xmlNode){
        if(!xmlNode.attributes) return;
        return xmlNode.attributes.component
    }

    /**
     *updates the node, not its children
     * means tagname and attributes
     *@param xml {tXml}
     *@param org {tXml} the old and currently displayed node. the org is containing the belonging DOM node
     */
    function updateNode(xml, org) {
        if (xml.tagName !== org.tagName)
            org.node.tagName = xml.tagName;

        for (var i in xml.attributes) {
            if (org && org.attributes && org.attributes[i]) {
                if (xml.attributes[i] !== org.attributes[i])
                    org.node.setAttribute(i, xml.attributes[i]);
                delete org.attributes[i];
            }
        }
        for (var i in org.attributes) {
            org.node.removeAttribute(i);
        }
    }


    /**
     * returns a label of the given tXML-node
     * it is in the format of "tagname#id.class"
     * where only the fist class is used.
     * That let the app-developer toggle a class
     * without recreating the element.
     *
     *@param node {tXml}
     */
    function getNodeLabel(node) {
        if (!node.tagName) return node[0];
        if (!node.attributes) return node.tagNlame;
        var id = node.attributes.id ? "#" + node.attributes.id : "";
        var classname = node.attributes['class'] ? ":" + node.attributes['class'].split(" ")[0] : "";
        var componentName = node.attributes.component ? '('+node.attributes.component+')' : ''
        return node.tagName + id + classname + componentName;
    }

    /**
     *insert an element at the position i of root's children
     */
    function insertAt(root, element, i) {
        var child = root.childNodes[i];
        if (child) {
            root.insertBefore(element, child);
        } else {
            root.appendChild(element);
        }
    }
    /**
     *@param arr {array}
     *@param from {int}
     *@param to {int}
     */
    function moveElement(arr, from, to) {
        if (from == to) return;
        arr.splice(to, 0, arr.splice(from, 1)[0])
    }
    /**
     *@param xml {xml-string}
     *@param doneCB {function} method that will be called, after all elements are attached to the DOM
     */
    TreeAct.prototype.render = function(xml, doneCB) {
        if (typeof xml == 'string') xml = tXml(xml);
        var that = this;
        requestAnimationFrame = setTimeout;
        requestAnimationFrame(function() {
            updateChildren(xml, that.struct, that.root, that);
            that.struct = xml;
            if (doneCB) doneCB();
        });
    };

   TreeAct.prototype.addComponent = function(name, thePrototype) {
     this.components[name]=function(el,tReeAct){
       this.init(el, tReeAct);
     }
     this.components[name].prototype = thePrototype;
   };
    return TreeAct;
})()

if(typeof module == 'object') module.exports = TreeAct;
