# CS465-FullStack

Architecture
* Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).
  
> Express HTML operates under the classic multi-page application lifecycle. Meaning when the user requests /travel or any part of the site, Express will execute logic, and injects MongoDB data into a template, such as in our case Handlebars, and then return with the completed HTML document. While compared to using Javascript, which works directly within the Browser Document Object Model; For smaller interactions such as opening a modal or validating a form field, vanilla Javascript is extremely lightweight because it requires no frameworks or extra building time. However, modern Single Page Applications scale better for complex UI states. Instead of manually searching for the elements in the DOM and updating them line-by-line, SPA maintains a centralized state and then automatically updates only the necessary UI parts via a Virtual DOM or a reactive system.

* Why did the backend use a NoSQL MongoDB database?

> Why did I use NoSQL for the back-end of the database? In a full-stack NodeJS and Express development (forming the MERN or MEAN stack), MongoDB has several distinct technical advantages. Starting with MongoDB stores the data in BSON documents, which map directly to the native JSON objects in Javascript. In a full-stack Javascript environment, the data flow remains continuous without needing complex ORM translation layers.

> Secondly, unlike traditional Database Management Systems like MySQL or PostgreSQL, MongoDB does not enforce fixed schemas at the database level. Also as the application is features evolve during the development, adding new fields, or modifying existing data models, this does not require running complex SQL schema migrations.

> Thirdly, Since MongoDB supports nested structures, the documents can be embedded and the arrays more naturally. If the application requires storing related data, for example user profiles with sub-arrays of preferences, addresses or travel packages, MongoDB can store them together within a single document instead of requiring a multi-table JOIN operation across the relational tables.

> Finally, since MongooDB was built with distributed architectures in mind, having features like native sharding allows the database to scale horizontally across multiple servers as the application grows more easily.

Functionality
* How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?

>  How does JSON differ from Javascript and how it ties the entire stack together? While JSON originates from the original Javascript syntax, they server fundamentally different purposes in a software system: Javascript is the programming language and JSON is a text-based data interchange format; the contents of Javascript includes the variables, functions, logic, loops and the dynamic expressions while JSON includes the data structures only. Javascript is executable from the browser during the NodeJS runtime, meanwhile JSON is passive data waiting to be parsed. Finally, Javascript, the keys does not need to be in quotes since unquoted strings, functions, and comments are allowed. However, JSON, the keys MUST be in double-quote strings with no trailing commas, and no comments.

> How does JSON connect to the full-stack? Since JSON is the universal language that is decoupled by software layers. Because JSON is language-agnostic text, the front and back-end does not need to how each other are built, just only how they speak through JSON over HTTP.

> This begins with the client request and the SPA front-end serializes the state into a JSON payload and sends it via HTTP Post and PUT.

> Next, the back-end processed through Express that parses the JSON request body, processes the business logic, and interacts with MongoDB.

> Then, MongoDB returns documents as JSON-compatible objects where Express sends them back down as JSON string responses.

> Lastly, the client is rendering the front-end and retrieves the JSON strong, parses it back into Javascript objects, and then updates UI components accordingly.

* Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.

> Reusing the user interface component reduced the complexity of the code and minimizes a chance that an error might occur. This allows for an effective and less time-consuming development of the site and helps to keep the design flow simple.

Testing
* Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.

> By testing the application, it helped me find errors and through the console log, and running a debug session, it helped me find out what failed, and using log messages helped me why they had failed. The security of endpoints in the full-stack development are important because since this application uses sensitive API methods, in our case POST and PUT, are boundaries to verify that the user is logged in as themselves and not someone else who is impersonating. The methods provided the calls to the database: PUT issues the edit call, POST creates the call, GET reads, and finally DELETE the call. 
    
Reflection
* How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?
> This course helped me in reaching my professional goals by helping me learn to develop multiple types of web applications through MEAN; and also learned how to develop the website by using Express and Angular to develop the SPA. In addition, it helped me to diagnose and troubleshoot the problems that I had occurred through the development cycle. It also helped me learned to send and retrieve requests by using Javascript and NoSQL.  
    
