// Generated by CoffeeScript 1.4.0
(function() {

  define(['jquery', 'primedia_events', 'utils'], function($, events, utils) {
    var _read, _write;
    _read = function(key, not_found) {
      var data;
      if (not_found == null) {
        not_found = {};
      }
      data = localStorage.getItem(key);
      if (data != null) {
        return JSON.parse(data);
      } else {
        return not_found;
      }
    };
    _write = function(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    };
    return {
      path: function() {
        return window.location.pathname;
      },
      path_and_query: function() {
        return window.location.pathname + window.location.search;
      },
      path_refinements: function() {
        return $("head meta[name='refinements']").attr('content') || null;
      },
      key: function(type) {
        if (type == null) {
          type = "refined";
        }
        switch (type) {
          case "refined":
            return this.path();
          case "base":
            return this.path().split(this.path_refinements()).shift();
        }
      },
      track: function() {
        var count;
        count = this.peek('count', 0) + 1;
        return this.save('count', count);
      },
      save: function(item, value, type) {
        var key, prefill_data, record;
        key = this.key(type);
        prefill_data = utils.getPageInfo(key);
        record = _read(key, prefill_data);
        record[item] = value;
        _write(key, record);
        return record;
      },
      peek: function(item, not_found, type) {
        var v;
        if (not_found == null) {
          not_found = 0;
        }
        v = _read(this.key(type));
        if (v[item] != null) {
          return v[item];
        } else {
          return not_found;
        }
      },
      number_of_visits: function() {
        return this.peek('count');
      },
      refinements: function() {
        return this.peek('nodes', []);
      },
      number_of_refinements: function() {
        return this.peek('nodes', []).length;
      },
      type: function() {
        return this.peek('type', '');
      },
      searchType: function() {
        return this.peek('searchType', '');
      }
    };
  });

}).call(this);
