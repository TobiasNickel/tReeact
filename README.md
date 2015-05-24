tReeact
=======
Motivation
----------
With tReeact I have developed a framework, that is inspired by facebooks reactJS, enabling you to use the technologies you already use. The core idea that I found was: "Rerender your entire app, on every data-change." That approach is quite convenient because it is like most websites where developed 5-7 years ago. When every click of the user loaded the next page, executing some scripts on the Server and display the current data. If you realy wanted to see the current data, the user had to refresh the page with [F5].

Description
-----------
With tReeact I provide a framework, that allowes you like react, developing your app, in that way. Further more I will discribe how I provide that functionality. If you want to compare to react, check out reactjs.github.com. 

I want the developer to use same technologies that are already well tested and used in production. There templating-languages. In January I wrote an TemplateManager, that makes it even more handy to work with templates ever before. Using the templating-engines the developer generates HTML that is representing the view, that is rendered on the screen. The simplest way could be to append that HTML to some innerHTML inside the DOM. With that you re-render the entire page and loose all eventlistener and all changes you made manually (mutations). 

Facebooks React as well as tReeact provide a smarter way. You render the entire page how his should look at the current moment. The Framework then compares the new view and the last rendered view and applies a minimal set of changes on the DOM. To do so, the HTMLstructure is seed as a data-tree and these trees are compared. tReeact is parsing the HTML string into some XML-DOM object and compares it with a previous rendering. 

With that approach your eventlistener and other changes on a DOM-node keep avalable. And even if you have a node with an ID, you can append it to an other position, while keeping the listener.

Code Examles
------------
For an example check out the the indexHTML it uses some ejs template to create the html and adds an click event to some element triggering a rerendering. Because the TempleteManager uses Ajax-requests to load the templates, you need to host the folder on a webserver. I recommend installing PHP, navigate on the console into the folder run "php -S 0.0.0.0:8080" and open "http://localhost:8080/index.html" in your browser.


** Mutation: a mutated view is an view element that was changed by some javascript, that is propably not representing the rendered data.