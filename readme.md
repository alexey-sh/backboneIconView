# backboneIconView
Simple widget like IconView in windows explorer

## Dependencies
 * jquery
 * underscore
 * Backbone
 
 
## Installing
 * inlude dependencies
 * include `icon-view.css` and `index.js` files
 
The widget supports AMD, CommonJS, pure include.


## Initialize 
`new IconView (data)` where data is an array of objects. 

Example of object:
```
{
  id: 1, 
  title: 'Documents', 
  img: 'images/folder.svg'
}
```
**NOTE:** `id` must be unique.


## Properties

 * `el`: String. Css selector of existing dom element. Default is `'.icon-view'`
 * `containerWidth`: Number. Width in pixels. Default is `100 * 3`
 * `containerHeight`: Number. Height in pixels. Default is `400`
 * `itemsPerRow`: Number. Default is `2`
 * `itemHeight`: Number. Default is `45`
 * `items`: Backbone Collection. Default is simple empty collection without any setup params. You also can listen all [events](http://backbonejs.org/#Events-catalog) of this collection.
 * `activeItemClassName`: String. Default is `'icon-view__item--active'`

## API
 * `addItems` (itemIds) 
 * `removeItems` (itemIds) 
 * `checkItems` (itemIds, unCheckOthers)
 * `uncheckItems` (itemIds)
 * `getActiveIds` returns an array of checked items


## Events
 * `clickItem` (item, isSelected), where `item` is instance of backbone model
 * `scrollEnd` 
 * `scroll` (data), there are the next properties: 
   * `scrollBottom` Number. Similar as scrollTop but includes height of element, i.e. `element.scrollTop + element.height`
   * `scrollDir` "up" || "down"


### Example

```
var items = [
    {id: 1, title: 'Documents', img: 'images/folder.svg'},
    {id: 2, title: 'Main styles for that great application', img: 'images/css.svg'},
    {id: 3, title: 'EPS', img: 'images/eps.svg'},
    {id: 4, title: 'Pictures', img: 'images/folder_images.svg'},
    {id: 5, title: 'index.html', img: 'images/html.svg'},
    {id: 6, title: 'Main logo', img: 'images/image.svg'},
    {id: 7, title: 'Main logo in PNG', img: 'images/png.svg'},
    {id: 8, title: 'Design', img: 'images/psd.svg'},
    {id: 9, title: 'Modern Design', img: 'images/sketch.svg'}
];
var CustomIconView = IconView.extend({
    el: '.icon-view',
    containerWidth: 150 * 3,
    containerHeight: 300,
    itemsPerRow: 3,
    itemHeight: 145
});

window.iconView = new CustomIconView(items);

function addItems() {
    var itemsLength = iconView.items.length;
    var copiedData = _.map(items, function (item) {
        item.id = item.id + itemsLength;
        return item;
    });
    iconView.addItems(copiedData);
}

$('.remove').on('click', function (e) {
    var ids = iconView.getActiveIds();
    iconView.removeItems(ids);
});
$('.add').on('click', addItems);
$('.select').on('click', function (e) {
    var ids = iconView.getActiveIds();
    if (ids.length) {
        iconView.uncheckItems(ids);
    }
    else {
        ids = iconView.items.map(function (model) {
            return model.id;
        });
        iconView.checkItems(ids);
    }
});
iconView.on('clickItem', function (item, isSelected) {
    if (isSelected) {
        iconView.uncheckItems([item]);
    }
    else {
        iconView.checkItems([item]);
    }
    alert('clicked item ' + iconView.items.get(item).get('title'));
});

iconView.on('scrollEnd', addItems);
```
