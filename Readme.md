![web component logo](http://i49.tinypic.com/e7nj9v.png)

# events

Element event binding component with support for single elements as well as NodeLists, HTMLCollections and Arrays.
Based on [visionmedia](https://github.com/visionmedia)'s [component/event](https://github.com/component/event).

## Component
Built to be used with the [Component package manager](https://github.com/component/component). Read more here:
* [Component at Github](https://github.com/component/component)
* [TJ Holowaychuk's introduction](http://tjholowaychuk.com/post/27984551477/components)

## Installation

    $ component install javve/events

## Example

```js
var events = require('events');
var links = document.getElementsByTagName('a');

function onclick(e) {
  e.preventDefault();
  console.log(e.target);
  events.unbind(e.target, 'click', onclick);
}

events.bind(links, 'click', onclick);
```

## API

### .bind(els, type, callback, [capture])

  Bind to `el`'s event `type` with `callback`.

### .unbind(els, type, callback, [capture])

  Unbind `el`'s event `type` `callback`.

## License

  MIT
