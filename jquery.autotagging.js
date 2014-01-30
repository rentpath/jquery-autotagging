// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['jquery', 'browserdetect', 'jquery.cookie'], function($, browserdetect) {
    var WH;
    return WH = (function() {
      function WH() {
        this.obj2query = __bind(this.obj2query, this);
        this.firedTime = __bind(this.firedTime, this);
        this.fire = __bind(this.fire, this);
        this.elemClicked = __bind(this.elemClicked, this);
        this.clearOneTimeData = __bind(this.clearOneTimeData, this);
        this.init = __bind(this.init, this);
      }

      WH.prototype.WH_SESSION_ID = 'WHSessionID';

      WH.prototype.WH_LAST_ACCESS_TIME = 'WHLastAccessTime';

      WH.prototype.WH_USER_ID = 'WHUserID';

      WH.prototype.THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

      WH.prototype.TEN_YEARS_IN_DAYS = 3650;

      WH.prototype.cacheBuster = 0;

      WH.prototype.domain = '';

      WH.prototype.firstVisit = null;

      WH.prototype.metaData = null;

      WH.prototype.oneTimeData = null;

      WH.prototype.path = '';

      WH.prototype.performance = window.performance || {};

      WH.prototype.sessionID = '';

      WH.prototype.userID = '';

      WH.prototype.warehouseTag = null;

      WH.prototype.init = function(opts) {
        if (opts == null) {
          opts = {};
        }
        this.clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img';
        if (opts.exclusions != null) {
          this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ":not(" + opts.exclusions + "), ");
        }
        this.domain = document.location.host;
        this.exclusionList = opts.exclusionList || [];
        this.fireCallback = opts.fireCallback;
        this.path = "" + document.location.pathname + document.location.search;
        this.warehouseURL = opts.warehouseURL;
        this.opts = opts;
        this.setFollowHref(opts);
        this.setCookies();
        this.determineDocumentDimensions(document);
        this.determineWindowDimensions(window);
        this.determinePlatform(window);
        this.metaData = opts.metaData != null ? opts.metaData : this.getDataFromMetaTags(document);
        this.firePageViewTag();
        return this.bindBodyClicked(document);
      };

      WH.prototype.bindBodyClicked = function(doc) {
        return $(doc).on('click', this.clickBindSelector, this.elemClicked);
      };

      WH.prototype.clearOneTimeData = function() {
        return this.oneTimeData = void 0;
      };

      WH.prototype.getSubgroupId = function(elem) {
        var el, id, _i, _len, _ref;
        id = null;
        _ref = elem.parents();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          id = $(el).attr('id');
          if (id) {
            break;
          }
        }
        return id;
      };

      WH.prototype.determineWindowDimensions = function(obj) {
        obj = $(obj);
        return this.windowDimensions = "" + (obj.width()) + "x" + (obj.height());
      };

      WH.prototype.determineDocumentDimensions = function(obj) {
        obj = $(obj);
        return this.browserDimensions = "" + (obj.width()) + "x" + (obj.height());
      };

      WH.prototype.determinePlatform = function(win) {
        return this.platform = browserdetect.platform(win);
      };

      WH.prototype.determineReferrer = function(doc, win) {
        if (win.location.href.match(/\?use_real_referrer\=true/)) {
          return $.cookie('real_referrer');
        } else {
          return doc.referrer;
        }
      };

      WH.prototype.elemClicked = function(e, options) {
        var attr, attrs, clickedElementIsLink, domTarget, href, item, jQTarget, realName, subGroup, trackingData, value, _i, _len, _ref;
        if (options == null) {
          options = {};
        }
        domTarget = e.target;
        attrs = domTarget.attributes;
        jQTarget = $(e.target);
        clickedElementIsLink = $.inArray(jQTarget[0].tagName.toLowerCase(), ['a', 'input']) !== -1;
        if (!clickedElementIsLink) {
          jQTarget = jQTarget.parent();
        }
        item = this.getItemId(jQTarget) || '';
        subGroup = this.getSubgroupId(jQTarget) || '';
        value = jQTarget.text() || '';
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
          if (attr.name.indexOf('data-') === 0 && (_ref = attr.name, __indexOf.call(this.exclusionList, _ref) < 0)) {
            realName = attr.name.replace('data-', '');
            trackingData[realName] = attr.value;
          }
        }
        this.setFollowHref(options);
        href = jQTarget.attr('href') || jQTarget.parent('a').attr('href');
        if (href && this.followHref) {
          this.lastLinkClicked = href;
          e.preventDefault();
        }
        this.fire(trackingData);
        return e.stopPropagation();
      };

      WH.prototype.fire = function(obj) {
        var key,
          _this = this;
        obj.ft = this.firedTime();
        obj.cb = this.cacheBuster++;
        obj.sess = "" + this.userID + "." + this.sessionID;
        obj.fpc = this.userID;
        obj.site = this.domain;
        obj.path = this.path;
        obj.title = $('title').text();
        obj.bs = this.windowDimensions;
        obj.sr = this.browserDimensions;
        obj.os = this.platform.OS;
        obj.browser = this.platform.browser;
        obj.ver = this.platform.version;
        obj.ref = this.determineReferrer(document, window);
        obj.registration = $.cookie('sgn') === '1' ? 1 : 0;
        if ($.cookie('sgn') != null) {
          obj.person_id = $.cookie('zid');
        }
        if (obj.cg != null) {
          this.metaData.cg = obj.cg;
        }
        if (this.metaData.cg == null) {
          this.metaData.cg = '';
        }
        if (typeof this.fireCallback === "function") {
          this.fireCallback(obj);
        }
        if (this.oneTimeData != null) {
          for (key in this.oneTimeData) {
            obj[key] = this.oneTimeData[key];
          }
          this.clearOneTimeData();
        }
        if (this.firstVisit) {
          obj.firstVisit = this.firstVisit;
          this.firstVisit = null;
        }
        return this.obj2query($.extend(obj, this.metaData), function(query) {
          var lastLinkRedirect, requestURL;
          requestURL = _this.warehouseURL + query;
          if (requestURL.length > 2048 && navigator.userAgent.indexOf('MSIE') >= 0) {
            requestURL = requestURL.substring(0, 2043) + "&tu=1";
          }
          if (!_this.warehouseTag) {
            _this.warehouseTag = $('<img/>', {
              id: 'PRMWarehouseTag',
              border: '0',
              width: '1',
              height: '1'
            });
          }
          _this.warehouseTag.onload = $('body').trigger('WH_pixel_success_' + obj.type);
          _this.warehouseTag.onerror = $('body').trigger('WH_pixel_error_' + obj.type);
          _this.warehouseTag[0].src = requestURL;
          if (_this.lastLinkClicked != null) {
            lastLinkRedirect = function(e) {
              if (!((_this.lastLinkClicked != null) && (_this.lastLinkClicked.indexOf != null))) {
                return;
              }
              if (_this.lastLinkClicked.indexOf('javascript:') === -1) {
                return document.location = _this.lastLinkClicked;
              }
            };
            return _this.warehouseTag.unbind('load').unbind('error').bind('load', lastLinkRedirect).bind('error', lastLinkRedirect);
          }
        });
      };

      WH.prototype.firedTime = function() {
        var now;
        now = this.performance.now || this.performance.webkitNow || this.performance.msNow || this.performance.oNow || this.performance.mozNow;
        return ((now != null) && now.call(this.performance)) || new Date().getTime();
      };

      WH.prototype.firePageViewTag = function() {
        return this.fire({
          type: 'pageview'
        });
      };

      WH.prototype.getItemId = function(elem) {
        var id;
        id = elem.attr('id');
        if (!id) {
          id = this.firstClass(elem);
        }
        return id;
      };

      WH.prototype.firstClass = function(elem) {
        var klasses;
        if (!(klasses = elem.attr('class'))) {
          return;
        }
        return klasses.split(' ')[0];
      };

      WH.prototype.getDataFromMetaTags = function(obj) {
        var metaTag, metas, name, retObj, _i, _len;
        retObj = {};
        metas = $(obj).find('meta');
        for (_i = 0, _len = metas.length; _i < _len; _i++) {
          metaTag = metas[_i];
          metaTag = $(metaTag);
          if (metaTag.attr('name') && metaTag.attr('name').indexOf('WH.') === 0) {
            name = metaTag.attr('name').replace('WH.', '');
            retObj[name] = metaTag.attr('content');
          }
        }
        return retObj;
      };

      WH.prototype.getOneTimeData = function() {
        return this.oneTimeData;
      };

      WH.prototype.sort_order_array = ["site", "site_version", "firstvisit", "tu", "cg", "listingid", "dpg", "type", "sg", "item", "value", "ssSiteName", "ssTestName", "ssVariationGroupName", "spg", "lpp", "path", "logged_in", "ft"];

      WH.prototype.setTagOrder = function(obj) {
        var elem, index, key, prop_key_array, result_array;
        prop_key_array = [];
        result_array = [];
        for (key in obj) {
          prop_key_array.push(key);
        }
        for (elem in this.sort_order_array) {
          index = $.inArray(this.sort_order_array[elem], prop_key_array);
          if (index > 0) {
            result_array.push(prop_key_array[index]);
            prop_key_array.splice(index, 1);
          }
        }
        result_array = result_array.concat(prop_key_array);
        return result_array;
      };

      WH.prototype.obj2query = function(obj, cb) {
        var elem, key, rv, tag_order, val;
        tag_order = this.setTagOrder(obj);
        rv = [];
        for (elem in tag_order) {
          key = tag_order[elem];
          if (obj.hasOwnProperty(key) && ((val = obj[key]) != null)) {
            rv.push("&" + key + "=" + (encodeURIComponent(val)));
          }
        }
        cb(rv.join('').replace(/^&/, '?'));
      };

      WH.prototype.getSessionID = function(currentTime) {
        var last_access_time;
        last_access_time = $.cookie(this.WH_LAST_ACCESS_TIME) || currentTime;
        if ($.cookie(this.WH_SESSION_ID) === null) {
          this.firstVisit = currentTime;
          return currentTime;
        } else {
          return $.cookie(this.WH_SESSION_ID);
        }
      };

      WH.prototype.setCookies = function() {
        var sessionID, timestamp, userID;
        userID = $.cookie(this.WH_USER_ID);
        timestamp = (new Date()).getTime();
        if (!userID) {
          userID = timestamp;
          $.cookie(this.WH_USER_ID, userID, {
            expires: this.TEN_YEARS_IN_DAYS,
            path: '/'
          });
        }
        sessionID = this.getSessionID(timestamp);
        $.cookie(this.WH_SESSION_ID, sessionID, {
          path: '/'
        });
        $.cookie(this.WH_LAST_ACCESS_TIME, timestamp, {
          path: '/'
        });
        this.sessionID = sessionID;
        return this.userID = userID;
      };

      WH.prototype.setOneTimeData = function(obj) {
        var key, _results;
        this.oneTimeData || (this.oneTimeData = {});
        _results = [];
        for (key in obj) {
          _results.push(this.oneTimeData[key] = obj[key]);
        }
        return _results;
      };

      WH.prototype.setFollowHref = function(opts) {
        if (opts == null) {
          opts = {};
        }
        this.lastLinkClicked = null;
        return this.followHref = opts.followHref != null ? opts.followHref : true;
      };

      return WH;

    })();
  });

}).call(this);
