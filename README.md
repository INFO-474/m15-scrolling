# Module 15: Scrolling!

## Overview
One of the most popular ways of animating transitions in web-visualizations is through scrolling. It's a beautiful way to allow users to dive deeper into a visualization, and there have been some really [incredible](http://www.r2d3.us/visual-intro-to-machine-learning-part-1/) [examples](http://letsfreecongress.org/) in recent years (both of those are by [Tony Chu](https://twitter.com/tonyhschu)).

This module introduces two approaches to scrolling. The first is a summary of the pioneering work done by [Jim Vallandingham](http://vallandingham.me/scroller.html), which uses D3 to track position in the page and fire events. The second approach uses Angular to track and fire events, which I believe is a more direct solution (assuming you know -- and like -- Angular). In case it wasn't obvious, these solutions **are not** intended to be used in tandem. The first is awesome if you're not using a framework, and the second great if you're using Angular. Either way, the intuition is the same: determine where you are on the page, and when you get to certain points, fire the appropriate event. It's not terribly complicated, so depending on what you're trying to do, you can also just (sc)roll your own.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Resources](#resources)
- [Custom Directives](#custom-directives)
  - [Use case](#use-case)
  - [Syntax](#syntax)
- [D3 Chart Directives](#d3-chart-directives)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Resources
Here are a few resources to get you started scrolling:

- [So You Want To Build a Scroller](http://vallandingham.me/scroller.html) _(Jim Vallandingham)_
- [How to Scroll](https://bost.ocks.org/mike/scroll/) _(Mike Bostock)_

## D3 Scrolling
This section outlines how to implement scrolling functionality based on [code](https://github.com/vlandham/scroll_demo) written for [this demo](http://vallandingham.me/scroll_demo/). [This post](http://vallandingham.me/scroller.html) explains the topic in **much greater detail**, so I suggest you use it as a reference (perhaps instead of this document). In order to leverage the `scroller.js` functionality, you need to set up the appropriate DOM elements with specific styles.


### HTML Elements
First things first, you need to put some elements on the screen. The suggested pattern is to wrap the sections that you wish to scroll through in a div with id `#sections`, and have a different `<section>` element for each piece of explanatory text you want to scroll through. Then, below you `#sections` div, you'll have a div with id `#vis` that holds your visualization. Here's the sample code from the explanatory post:

```html
<div id='graphic'>
  <div id='sections'>
    <section class="step">
      <div class="title">OpenVis Conf 2013</div>
        I did what no presenter should ever do: I watched my own talk...
    </section>
    <section class="step">
      <!-- another section -->
    </section>
  </div>
  <div id='vis'>
  </div>
</div>
```

Note the assignment of the `step` class for each one of the `<section>` elements. For each annotation you wish to make, you'll simply create another `<section>` element. There's no reason that these need to be restricted to only _text_, but as you add more elements (i.e., `<img>`, etc.), you may need to adjust the css.

### CSS
As in other web applications, we'll use simple CSS syntax to assign the position and display of different elements. Conceptually, here's what we're aiming for:

  - A corpus of text that we're able to scroll through, positioned on the left of the page
  - A visualization that stays fixed on the top of the page as you scroll through the story

Here's the relevant CSS from Jim's tutorial:
```css
#sections {
  position: relative;
  display: inline-block;
  width: 250px;
  top: 0px;
  z-index: 90;
}

.step {
  margin-bottom: 200px;
}

#vis {
  display: inline-block;
  position: fixed;
  top: 60px;
  z-index: 1;
  margin-left: 0;
  height: 600px;
  width: 600px;
  background-color: #ddd;
}
```

Because both `#sections` and `#vis` have a display property set to `inline-block`, we're able to assign them width and height attributes, and have them sit in the same horizontal line. The `fixed` position of the `#vis` element ensures it stays in place, and the `margin-bottom` of each section with class `.step` ensures that there is room to scroll. These components provide a skeleton which we can use to assign interactivity and fire desired events. I've found it additionally helpful to add the following `margin-bottom` to the _last_ `.step` element:

```css
.step:last-child {
  margin-bottom:calc(100vh - 100px);
}
```

## JavaScript
Here, we'll discuss how to implement the scroller in your JavaScript code. The `scroller.js` function encapsulates the desired functionality in a reusable function, and if you're interested in _how_ it does this, see [the post](http://vallandingham.me/scroller.html), which describes this overall approach:

>Given a set of `sections`, figure out where these elements are located vertically down the page. When the page is scrolled, figure out which of these elements is currently front-and-center in the browser’s viewport. If this element is different than the last ‘active’ element, then switch to this new section and tell the visualization.

In terms of implementing this approach, it really only takes 3 simple steps (note, the `scroller` function uses the same reusability patter as our D3.js charts):


```javascript
// 1. Define a new scroller, and use the `.container` method to specify the desired container
var scroll = scroller()
    .container(d3.select('#graphic'));

// 2. Pass in a selection of all elements that you wish to fire a step event:
scroll(d3.selectAll('.step')); // each section with class `step` is a new step

// Specify the function you wish to activate when a section becomes active
scroll.on('active', function(index) {
  update(index);
})
```
The `scroll.on('active')` method specifies the **index** of the element you have scrolled to, which can be used to update the visualization. For example:

```javascript
// Declare our chart

// Function to execute on scroll
var update = function(index) {
  switch(index) {
    case 1:
      var fillColor = 'blue';
      break;
    case 2:
      var fillColor = 'red';
      break;
    default:
      var fillColor = 'black';
      break;
  }
  myChart.fillColor(fillColor);
  chart.call(myChart);
}
```

Note, the code also supports tracking the progress **between two sections**, which is not something supported by the Angular code below (though it wouldn't be difficult to add...).

For an example, see [demo-1](demo-1).

## Angular Scrolling

For an example, see [demo-2](demo-2).
