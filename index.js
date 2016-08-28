(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["underscore", "jquery", "backbone"], function (_, $, Backbone) {
            return (root.IconView = factory(_, $, Backbone, root));
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = (root.IconView = factory(require("underscore"), require('jquery'), require('backbone'), root));
    } else {
        root.IconView = factory(root.jQuery, root._, root.Backbone, root);
    }
}(this, function ($, _, Backbone, window) {
    var ItemsModel = Backbone.Model.extend({});

    var ItemsCollection = Backbone.Collection.extend({
        model: ItemsModel
    });

    return Backbone.View.extend({
        el: '.icon-view',
        containerWidth: 100 * 3,
        containerHeight: 400,
        itemsPerRow: 2,
        itemHeight: 45,
        items: new ItemsCollection(),
        activeItemClassName: 'icon-view__item--active',

        _lastKnownPos: void 0,

        itemTpl: _.template(
            '<div class="icon-view__item" style="width: <%= 100 / itemsPerRow %>%; height: <%= itemHeight %>px" data-item-id="<%= item.id %>">' +
            '<div class="icon-view__item-icon" style="background-image:  url(<%= item.get("img") %>)"></div>' +
            '<div class="icon-view__item-title"><%= item.get("title") %></div>' +
            '</div>'),
        initialize: function (data) {
            if (_.isArray(data)) {
                this.addItems(data);
            }
            this.listenTo(this.items, 'add', this.onAddedItems);
            this.listenTo(this.items, 'change', this.onChangedItems);
            this.listenTo(this.items, 'remove', this.onRemovedItems);
            this.render();
        },

        events: {
            'click .icon-view__item': function (e) {
                var me = $(e.currentTarget);
                this.trigger('clickItem', me.data('item-id'), me.hasClass(this.activeItemClassName));
            },
            'scroll': function (event) {
                var that = this;
                var height = this.$el.height();
                var scrollDir = this._lastKnownPos > this.el.scrollTop ? 'up' : 'down';
                this._lastKnownPos = this.el.scrollTop;
                if (Math.ceil(height + that._lastKnownPos) >= that.el.scrollHeight && that._lastKnownPos !== 0) {
                    that.trigger('scrollEnd');
                }
                that.trigger('scroll', {
                    scrollBottom: that._lastKnownPos + height,
                    scrollDir: scrollDir
                });
            }
        },

        toggleUIState: _.throttle(function () {
            var activeIds = this.getActiveIds();
            this.$('.icon-view__item').removeClass(this.activeItemClassName);
            _.each(activeIds, function (id) {
                this.$('.icon-view__item[data-item-id="$1"]'.replace('$1', id)).addClass(this.activeItemClassName);
            }, this);
        }),
        getActiveIds: function () {
            return this.items.where({checked: true}).map(function (model) {
                return model.id;
            });
        },
        compileItem: function (model) {
            return this.itemTpl({
                item: model,
                itemsPerRow: this.itemsPerRow,
                itemHeight: this.itemHeight
            });
        },
        onAddedItems: function (model, collection, options) {
            var html = this.compileItem(model);
            this.$el.append(html);
            this.toggleUIState();
        },
        onChangedItems: function (model, options) {
            this.toggleUIState();
        },
        onRemovedItems: function (model, collection, options) {
            this.$('.icon-view__item[data-item-id="$1"]'.replace('$1', model.id)).remove();
            this.toggleUIState();
        },
        addItems: function (items) {
            return this.items.add(items);
        },
        removeItems: function (itemIds) {
            return this.items.remove(itemIds);
        },
        checkItems: function (itemIds, unCheckOthers) {
            return this.items.map(function (model) {
                if (unCheckOthers) {
                    model.set('checked', _.indexOf(itemIds, model.id) !== -1);
                }
                else if (_.indexOf(itemIds, model.id) !== -1) {
                    model.set('checked', true);
                }
            });
        },
        uncheckItems: function (itemIds) {
            return this.items.chain().filter(function (model) {
                return _.indexOf(itemIds, model.id) !== -1;
            }).map(function (model) {
                model.set('checked', false);
            }).value();
        },
        render: function () {
            var that = this;
            var html = this.items.reduce(function (all, item) {
                return all + that.compileItem(item);
            }, '');
            this.$el.html(html);
            this.$el.width(this.containerWidth).height(this.containerHeight);
            this.toggleUIState();
            return this;
        }
    });
}));