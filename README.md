# Overview

For this project, I have created a simple softrware app using TypeScript, in order to learn a language that I had no previous experience with. I wrote the app primarily in TypeScript, but also using HTML and CSS in order to help make it work properly.

The app that I created is a simple browser-based drawing app. In it, the user can create a drawing in their browser with any color and any thickness of line. The user also has a choice of a few different editing buttons, including "undo", to undo a line that they have just drawn, "redo", to remake a line that may have gotten deleted by accident, and "clear", to clear the whole canvas and start over. The user also has the ability to save drawings and open them from saved states, with the "save" and "load" buttons.

The reason I wrote this software was because I wanted to learn TypeScript, a language that I have had no previous experience in. To make my learning more fun, I chose to learn TypeScript with a project that I was interested in, in this case an art-based one.

[Software Demo Video](https://www.youtube.com/watch?v=gkHBXcFWPxo)

# Development Environment

In order to create this drawing app, I used VSCode as my programming environment, with the Live Server extension and the Chrome browser to test the software as I was in the process of writing it. I also used the built-in terminal in VSCode to run commands along the way when needed.

I used the TypeScript language to build the backbone of the app; in addition to this, I used the terminal to download various TypeScript libraries in order to create a TypeScript configuration file (i.e., "tsconfig.json"). This allowed me to configure TypeScript the way I needed for this specific project. TypeScript also has a built in compiler which allows you to compile TypeScript code into JavaScript, so that it can be run anywhere that JavaScript can; I used this function as well, in order to make my program usable in a web browser. I used HTML and CSS to create the toolbar at the top of the canvas, which allows the user to change their tools as well as edit and save their work.

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [typescriptlang.org](https://www.typescriptlang.org/docs/)
- [w3schools.com](https://www.w3schools.com/typescript/)
- [freecodecamp.org](https://www.freecodecamp.org/news/learn-typescript-beginners-guide/)

# Future Work

{Make a list of things that you need to fix, improve, and add in the future.}

- I need to create an "erase" option for the user, so that they can erase bits of their work freehand, rather than deleting whole chunks with the "undo" button.
- I want to include a larger library of tools and shapes so that the user has more to work with than just a simple line.
- I need to make the program responsive to a variety of different screen sizes and dimensions.