// loading TemplateManager, a templateCompiler by Tobias Nickel (https://github.com/TobiasNickel/TemplateManager)
var TemplateManager=function(){function h(a,c,b,d,f,g,e){a instanceof h&&(e=a,a=e.engine,c=e.defaults,b=e.basePath,d=e.fileExtension,f=e.nameOfTemplatemanager,g=e.baseName,e=e.templates);this.templates=e?e:{};this.engine=a.toLowerCase().trim();this.defaults=c?c:{};this.basePath=b?b:"/templates";this.fileExtension=d?d:"html";this.nameOfTemplatemanager=f?f:"templateManager";this.baseName=g?g:"";switch(a.toLowerCase().trim()){case "ejs":this.compile=l;break;case "underscore":this.compile=m;break;case "mustache":this.compile=
n;break;case "jade":this.compile=p;break;default:throw"no valid templateEngine defined";}this.findTemplates()}function l(a){var c=new EJS({text:a});return function(a){return c.render(a)}}function p(a){var c=new jade.compile(a);return function(a){return c(a)}}function n(a){return function(c){return Mustache.render(a,c)}}function m(a){return _.template(a)}function k(a){for(var c=a.length,b=[],d=0,d=0;d<c;d+=1)b.push(a[d]);return b}function g(a,c){for(var b in c)a[b]=void 0!==a[b]?a[b]:c[b]}h.prototype.render=
function(a,c){var b={};b.that=b;g(b,c);var d=new h(this),f=a.lastIndexOf("/");-1!==f&&(d.baseName+=a.slice(0,f)+"/");b[this.nameOfTemplatemanager]=d;"/"===a[0]?a=a.slice(1):("../"===a[0]&&(a=a.slice(3)),a=this.baseName+a);this.templates[a]||this.loadTemplateFile(a);return this.templates[a]?(this.templates[a].defaults&&g(b,this.templates[a].defaults),g(b,this.defaults),this.templates[a].template(b)):"template "+a+" not found"};h.prototype.loadTemplateFile=function(a,c){var b=q();b.open("GET",this.basePath+
"/"+a+"."+this.fileExtension,!1);try{b.send(null)}catch(d){return null}if(404==b.status||2==b.status||0==b.status&&""==b.responseText)throw Error("can't load the template "+a);this.templates[a]={template:this.compile(b.responseText)};c&&(this.templates[a].defaults=c)};h.prototype.findTemplates=function(){for(var a=k(document.getElementsByTagName("template")),a=a.concat(k(document.querySelectorAll("script[type='text/template']"))),c=0;a[c];c++){var b=a[c],d=b.innerHTML.trim(),f=b.id.trim();this.templates[f]=
{template:this.compile(d)};b.remove()}};var q=function(){for(var a=[function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new XMLHttpRequest},function(){return new ActiveXObject("Microsoft.XMLHTTP")}],c=0;c<a.length;c++)try{var b=a[c]();if(null!=b)return b}catch(d){}};return h}();

// loading tXML, an xmlParser by Tobias Nickel(https://github.com/TobiasNickel/tXml)
function tXml(b){function k(){for(var f=[];b[a];){if(60==b.charCodeAt(a)){if(47===b.charCodeAt(a+1)){a=b.indexOf(">",a);break}else if(33===b.charCodeAt(a+1)){if(45==b.charCodeAt(a+2)){for(;62!==b.charCodeAt(a)||45!=b.charCodeAt(a-1)||45!=b.charCodeAt(a-2)||-1==a;)a=b.indexOf(">",a+1);-1===a&&(a=b.length)}else for(a+=2;62!==b.charCodeAt(a);)a++;a++;continue}var d={};a++;d.tagName=c();for(var g=!1;62!==b.charCodeAt(a);){var e=b.charCodeAt(a);if(64<e&&91>e||96<e&&123>e){for(var l=c(),e=b.charCodeAt(a);39!==
e&&34!==e;)a++,e=b.charCodeAt(a);var e=b[a],m=++a;a=b.indexOf(e,m);e=b.slice(m,a);g||(d.attributes={},g=!0);d.attributes[l.toLowerCase()]=e}a++}47!==b.charCodeAt(a-1)&&("script"==d.tagName?(g=a,a=b.indexOf("\x3c/script>",a),d.children=[b.slice(g,a-1)],a+=8):"style"==d.tagName?(g=a,a=b.indexOf("</style>",a),d.children=[b.slice(g,a-1)],a+=7):-1==h.indexOf(d.tagName)&&(a++,d.children=k(l)));f.push(d)}else d=a,a=b.indexOf("<",a)-1,-2===a&&(a=b.length),d=b.slice(d,a+1),0<d.trim().length&&f.push(d);a++}return f}
function c(){for(var c=a;-1===g.indexOf(b[a]);)a++;return b.slice(c,a)}var g="\n\t>/= ",h=["img","br","input"],a=0;return k()}
function TOMObjToXML(b){function k(b){if(b)for(var h=0;h<b.length;h++)if("string"==typeof b[h])c+=b[h].trim();else{var a=b[h];c+="<"+a.tagName;var f=void 0;for(f in a.attributes)c=-1===a.attributes[f].indexOf('"')?c+(" "+f+'="'+a.attributes[f].trim()+'"'):c+(" "+f+"='"+a.attributes[f].trim()+"'");c+=">";k(a.children);c+="</"+a.tagName+">"}}var c="";Array.isArray(b)||(b=[b]);k(b);return c};

/**
 *@author: Tobias Nickel
 *  Inspired by the awesome reactJS, I'd like to provide an alternative,
 *  that allowes you to use techniques, that you already use.
 *
 *  So, it is a module, that render your HTML to the dom and only updates the nessasary elements.
 *  it is so effective, that you can rerender your entire web-app each time, when data changes.
 *  your eventlistener keep available and you can even use css transition between one and a new rendering.
 */
TreeAct = (function() {
    var requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || function(cb) {
            setTimeout(cb, 0);
        };

    function TreeAct(root) {
        this.root = root;
        root.innerHTML = '';
        this.struct = [];
        this.struct.ids = {};
    }

    var creator = document.createElement('div'); // used by getNode()
    /**
     *creates the DOM node of a tXml-node
     */

    function getNode(xml) {
        creator.innerHTML = TOMObjToXML(xml);
        return creator.firstChild;
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

    function updateChildren(xml, orgXml, root) {
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
                cXml.node = getNode(cXml);
                insertAt(root, cXml.node, i);
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
                    updateChildren(cXml.children, orgXml.ids[id].children, orgXml.ids[id].node);
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
                updateChildren(cXml.children, orgXml[i].children, orgXml[i].node);
            } else if (cXml[0] !== orgXml[i][0]) {
                //exchange complete
                var node = getNode(cXml);
                xml.node = node;
                root.insertBefore(node, orgXml[i].node);
                orgXml[i].node.remove();
            }
        }
        for (; i < orgXml.length; i++) {
            orgXml[i].node.remove();
        }
        xml.ids = ids;
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
            if (org.attributes[i]) {
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
        if (!node.attributes) return node.tagname;
        var id = node.attributes.id ? "#" + node.attributes.id : "";
        var classname = node.attributes['class'] ? ":" + node.attributes['class'].split(" ")[0] : "";
        return node.tagName + id + classname;
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
        requestAnimationFrame(function() {
            updateChildren(xml, that.struct, that.root);
            that.struct = xml;
            if (doneCB) doneCB();
        });
    };
    return TreeAct;
})()

