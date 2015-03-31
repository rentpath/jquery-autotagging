(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['jquery'], function($) {
    var ClickHandler;
    ClickHandler = (function() {
      function ClickHandler(wh, opts) {
        this.wh = wh;
        if (opts == null) {
          opts = {};
        }
        this.elemClicked = __bind(this.elemClicked, this);
        this.clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img';
        if (opts.exclusions != null) {
          this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ":not(" + opts.exclusions + "), ");
        }
      }

      ClickHandler.prototype.bind = function(elem) {
        return $(elem).on('click', this.clickBindSelector, this.elemClicked);
      };

      ClickHandler.prototype._shouldRedirect = function(href) {
        return (href != null) && (href.indexOf != null) && href.indexOf('javascript:') === -1;
      };

      ClickHandler.prototype._followHrefConfigured = function(event, options, wh) {
        var _ref, _ref1;
        if ((event != null ? (_ref = event.data) != null ? _ref.followHref : void 0 : void 0) != null) {
          return event != null ? (_ref1 = event.data) != null ? _ref1.followHref : void 0 : void 0;
        } else if ((options != null ? options.followHref : void 0) != null) {
          return options != null ? options.followHref : void 0;
        } else if ((wh != null ? wh.followHref : void 0) != null) {
          return wh != null ? wh.followHref : void 0;
        } else {
          return false;
        }
      };

      ClickHandler.prototype._setDocumentLocation = function(href) {
        return document.location = href;
      };

      ClickHandler.prototype._openNewWindow = function(href) {
        return window.open(href);
      };

      ClickHandler.prototype.elemClicked = function(e, options) {
        var attr, attrs, domTarget, getClosestAttr, href, item, jQTarget, realName, subGroup, target, trackingData, value, _i, _len, _ref;
        if (options == null) {
          options = {};
        }
        domTarget = e.target;
        attrs = domTarget.attributes;
        jQTarget = $(e.target);
        if (!jQTarget.is(this.clickBindSelector)) {
          jQTarget = jQTarget.parent();
        }
        item = this.wh.getItemId(jQTarget) || '';
        subGroup = this.wh.getSubgroupId(jQTarget) || '';
        value = this.wh.replaceDoubleByteChars(jQTarget.text()) || '';
        trackingData = {
          sg: subGroup,
          item: item,
          value: value,
          type: 'click',
          x: e.clientX,
          y: e.clientY
        };
        for (_i = 0, _len = attrs.length; _i < _len; _i++) {
          attr = attrs[_i];
          if (attr.name.indexOf('data-') === 0 && (_ref = attr.name, __indexOf.call(this.wh.exclusionList, _ref) < 0)) {
            realName = attr.name.replace('data-', '');
            trackingData[realName] = attr.value;
          }
        }
        getClosestAttr = function(attr) {
          return jQTarget.attr(attr) || jQTarget.closest('a').attr(attr);
        };
        href = getClosestAttr('href');
        target = getClosestAttr('target');
        if (this._followHrefConfigured(e, options, this.wh) && this._shouldRedirect(href)) {
          e.preventDefault();
          if (target === "_blank") {
            this._openNewWindow(href);
          } else {
            trackingData.afterFireCallback = (function(_this) {
              return function() {
                return _this._setDocumentLocation(href);
              };
            })(this);
          }
        }
        this.wh.fire(trackingData);
        return e.stopPropagation();
      };

      return ClickHandler;

    })();
    return ClickHandler;
  });

}).call(this);
