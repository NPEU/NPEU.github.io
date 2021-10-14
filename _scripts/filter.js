/*!***************************************************
* mark.js v8.11.1
* https://markjs.io/
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Mark = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var DOMIterator = function () {
  function DOMIterator(ctx) {
    var iframes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var iframesTimeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;
    classCallCheck(this, DOMIterator);

    this.ctx = ctx;
    this.iframes = iframes;
    this.exclude = exclude;
    this.iframesTimeout = iframesTimeout;
  }

  createClass(DOMIterator, [{
    key: 'getContexts',
    value: function getContexts() {
      var ctx = void 0,
          filteredCtx = [];
      if (typeof this.ctx === 'undefined' || !this.ctx) {
        ctx = [];
      } else if (NodeList.prototype.isPrototypeOf(this.ctx)) {
        ctx = Array.prototype.slice.call(this.ctx);
      } else if (Array.isArray(this.ctx)) {
        ctx = this.ctx;
      } else if (typeof this.ctx === 'string') {
        ctx = Array.prototype.slice.call(document.querySelectorAll(this.ctx));
      } else {
        ctx = [this.ctx];
      }
      ctx.forEach(function (ctx) {
        var isDescendant = filteredCtx.filter(function (contexts) {
          return contexts.contains(ctx);
        }).length > 0;
        if (filteredCtx.indexOf(ctx) === -1 && !isDescendant) {
          filteredCtx.push(ctx);
        }
      });
      return filteredCtx;
    }
  }, {
    key: 'getIframeContents',
    value: function getIframeContents(ifr, successFn) {
      var errorFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      var doc = void 0;
      try {
        var ifrWin = ifr.contentWindow;
        doc = ifrWin.document;
        if (!ifrWin || !doc) {
          throw new Error('iframe inaccessible');
        }
      } catch (e) {
        errorFn();
      }
      if (doc) {
        successFn(doc);
      }
    }
  }, {
    key: 'isIframeBlank',
    value: function isIframeBlank(ifr) {
      var bl = 'about:blank',
          src = ifr.getAttribute('src').trim(),
          href = ifr.contentWindow.location.href;
      return href === bl && src !== bl && src;
    }
  }, {
    key: 'observeIframeLoad',
    value: function observeIframeLoad(ifr, successFn, errorFn) {
      var _this = this;

      var called = false,
          tout = null;
      var listener = function listener() {
        if (called) {
          return;
        }
        called = true;
        clearTimeout(tout);
        try {
          if (!_this.isIframeBlank(ifr)) {
            ifr.removeEventListener('load', listener);
            _this.getIframeContents(ifr, successFn, errorFn);
          }
        } catch (e) {
          errorFn();
        }
      };
      ifr.addEventListener('load', listener);
      tout = setTimeout(listener, this.iframesTimeout);
    }
  }, {
    key: 'onIframeReady',
    value: function onIframeReady(ifr, successFn, errorFn) {
      try {
        if (ifr.contentWindow.document.readyState === 'complete') {
          if (this.isIframeBlank(ifr)) {
            this.observeIframeLoad(ifr, successFn, errorFn);
          } else {
            this.getIframeContents(ifr, successFn, errorFn);
          }
        } else {
          this.observeIframeLoad(ifr, successFn, errorFn);
        }
      } catch (e) {
        errorFn();
      }
    }
  }, {
    key: 'waitForIframes',
    value: function waitForIframes(ctx, done) {
      var _this2 = this;

      var eachCalled = 0;
      this.forEachIframe(ctx, function () {
        return true;
      }, function (ifr) {
        eachCalled++;
        _this2.waitForIframes(ifr.querySelector('html'), function () {
          if (! --eachCalled) {
            done();
          }
        });
      }, function (handled) {
        if (!handled) {
          done();
        }
      });
    }
  }, {
    key: 'forEachIframe',
    value: function forEachIframe(ctx, filter, each) {
      var _this3 = this;

      var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

      var ifr = ctx.querySelectorAll('iframe'),
          open = ifr.length,
          handled = 0;
      ifr = Array.prototype.slice.call(ifr);
      var checkEnd = function checkEnd() {
        if (--open <= 0) {
          end(handled);
        }
      };
      if (!open) {
        checkEnd();
      }
      ifr.forEach(function (ifr) {
        if (DOMIterator.matches(ifr, _this3.exclude)) {
          checkEnd();
        } else {
          _this3.onIframeReady(ifr, function (con) {
            if (filter(ifr)) {
              handled++;
              each(con);
            }
            checkEnd();
          }, checkEnd);
        }
      });
    }
  }, {
    key: 'createIterator',
    value: function createIterator(ctx, whatToShow, filter) {
      return document.createNodeIterator(ctx, whatToShow, filter, false);
    }
  }, {
    key: 'createInstanceOnIframe',
    value: function createInstanceOnIframe(contents) {
      return new DOMIterator(contents.querySelector('html'), this.iframes);
    }
  }, {
    key: 'compareNodeIframe',
    value: function compareNodeIframe(node, prevNode, ifr) {
      var compCurr = node.compareDocumentPosition(ifr),
          prev = Node.DOCUMENT_POSITION_PRECEDING;
      if (compCurr & prev) {
        if (prevNode !== null) {
          var compPrev = prevNode.compareDocumentPosition(ifr),
              after = Node.DOCUMENT_POSITION_FOLLOWING;
          if (compPrev & after) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'getIteratorNode',
    value: function getIteratorNode(itr) {
      var prevNode = itr.previousNode();
      var node = void 0;
      if (prevNode === null) {
        node = itr.nextNode();
      } else {
        node = itr.nextNode() && itr.nextNode();
      }
      return {
        prevNode: prevNode,
        node: node
      };
    }
  }, {
    key: 'checkIframeFilter',
    value: function checkIframeFilter(node, prevNode, currIfr, ifr) {
      var key = false,
          handled = false;
      ifr.forEach(function (ifrDict, i) {
        if (ifrDict.val === currIfr) {
          key = i;
          handled = ifrDict.handled;
        }
      });
      if (this.compareNodeIframe(node, prevNode, currIfr)) {
        if (key === false && !handled) {
          ifr.push({
            val: currIfr,
            handled: true
          });
        } else if (key !== false && !handled) {
          ifr[key].handled = true;
        }
        return true;
      }
      if (key === false) {
        ifr.push({
          val: currIfr,
          handled: false
        });
      }
      return false;
    }
  }, {
    key: 'handleOpenIframes',
    value: function handleOpenIframes(ifr, whatToShow, eCb, fCb) {
      var _this4 = this;

      ifr.forEach(function (ifrDict) {
        if (!ifrDict.handled) {
          _this4.getIframeContents(ifrDict.val, function (con) {
            _this4.createInstanceOnIframe(con).forEachNode(whatToShow, eCb, fCb);
          });
        }
      });
    }
  }, {
    key: 'iterateThroughNodes',
    value: function iterateThroughNodes(whatToShow, ctx, eachCb, filterCb, doneCb) {
      var _this5 = this;

      var itr = this.createIterator(ctx, whatToShow, filterCb);
      var ifr = [],
          elements = [],
          node = void 0,
          prevNode = void 0,
          retrieveNodes = function retrieveNodes() {
        var _getIteratorNode = _this5.getIteratorNode(itr);

        prevNode = _getIteratorNode.prevNode;
        node = _getIteratorNode.node;

        return node;
      };
      while (retrieveNodes()) {
        if (this.iframes) {
          this.forEachIframe(ctx, function (currIfr) {
            return _this5.checkIframeFilter(node, prevNode, currIfr, ifr);
          }, function (con) {
            _this5.createInstanceOnIframe(con).forEachNode(whatToShow, function (ifrNode) {
              return elements.push(ifrNode);
            }, filterCb);
          });
        }
        elements.push(node);
      }
      elements.forEach(function (node) {
        eachCb(node);
      });
      if (this.iframes) {
        this.handleOpenIframes(ifr, whatToShow, eachCb, filterCb);
      }
      doneCb();
    }
  }, {
    key: 'forEachNode',
    value: function forEachNode(whatToShow, each, filter) {
      var _this6 = this;

      var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

      var contexts = this.getContexts();
      var open = contexts.length;
      if (!open) {
        done();
      }
      contexts.forEach(function (ctx) {
        var ready = function ready() {
          _this6.iterateThroughNodes(whatToShow, ctx, each, filter, function () {
            if (--open <= 0) {
              done();
            }
          });
        };
        if (_this6.iframes) {
          _this6.waitForIframes(ctx, ready);
        } else {
          ready();
        }
      });
    }
  }], [{
    key: 'matches',
    value: function matches(element, selector) {
      var selectors = typeof selector === 'string' ? [selector] : selector,
          fn = element.matches || element.matchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
      if (fn) {
        var match = false;
        selectors.every(function (sel) {
          if (fn.call(element, sel)) {
            match = true;
            return false;
          }
          return true;
        });
        return match;
      } else {
        return false;
      }
    }
  }]);
  return DOMIterator;
}();

var Mark$1 = function () {
  function Mark(ctx) {
    classCallCheck(this, Mark);

    this.ctx = ctx;
    this.ie = false;
    var ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      this.ie = true;
    }
  }

  createClass(Mark, [{
    key: 'log',
    value: function log(msg) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'debug';

      var log = this.opt.log;
      if (!this.opt.debug) {
        return;
      }
      if ((typeof log === 'undefined' ? 'undefined' : _typeof(log)) === 'object' && typeof log[level] === 'function') {
        log[level]('mark.js: ' + msg);
      }
    }
  }, {
    key: 'escapeStr',
    value: function escapeStr(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }
  }, {
    key: 'createRegExp',
    value: function createRegExp(str) {
      if (this.opt.wildcards !== 'disabled') {
        str = this.setupWildcardsRegExp(str);
      }
      str = this.escapeStr(str);
      if (Object.keys(this.opt.synonyms).length) {
        str = this.createSynonymsRegExp(str);
      }
      if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
        str = this.setupIgnoreJoinersRegExp(str);
      }
      if (this.opt.diacritics) {
        str = this.createDiacriticsRegExp(str);
      }
      str = this.createMergedBlanksRegExp(str);
      if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
        str = this.createJoinersRegExp(str);
      }
      if (this.opt.wildcards !== 'disabled') {
        str = this.createWildcardsRegExp(str);
      }
      str = this.createAccuracyRegExp(str);
      return str;
    }
  }, {
    key: 'createSynonymsRegExp',
    value: function createSynonymsRegExp(str) {
      var syn = this.opt.synonyms,
          sens = this.opt.caseSensitive ? '' : 'i',
          joinerPlaceholder = this.opt.ignoreJoiners || this.opt.ignorePunctuation.length ? '\0' : '';
      for (var index in syn) {
        if (syn.hasOwnProperty(index)) {
          var value = syn[index],
              k1 = this.opt.wildcards !== 'disabled' ? this.setupWildcardsRegExp(index) : this.escapeStr(index),
              k2 = this.opt.wildcards !== 'disabled' ? this.setupWildcardsRegExp(value) : this.escapeStr(value);
          if (k1 !== '' && k2 !== '') {
            str = str.replace(new RegExp('(' + this.escapeStr(k1) + '|' + this.escapeStr(k2) + ')', 'gm' + sens), joinerPlaceholder + ('(' + this.processSynomyms(k1) + '|') + (this.processSynomyms(k2) + ')') + joinerPlaceholder);
          }
        }
      }
      return str;
    }
  }, {
    key: 'processSynomyms',
    value: function processSynomyms(str) {
      if (this.opt.ignoreJoiners || this.opt.ignorePunctuation.length) {
        str = this.setupIgnoreJoinersRegExp(str);
      }
      return str;
    }
  }, {
    key: 'setupWildcardsRegExp',
    value: function setupWildcardsRegExp(str) {
      str = str.replace(/(?:\\)*\?/g, function (val) {
        return val.charAt(0) === '\\' ? '?' : '\x01';
      });
      return str.replace(/(?:\\)*\*/g, function (val) {
        return val.charAt(0) === '\\' ? '*' : '\x02';
      });
    }
  }, {
    key: 'createWildcardsRegExp',
    value: function createWildcardsRegExp(str) {
      var spaces = this.opt.wildcards === 'withSpaces';
      return str.replace(/\u0001/g, spaces ? '[\\S\\s]?' : '\\S?').replace(/\u0002/g, spaces ? '[\\S\\s]*?' : '\\S*');
    }
  }, {
    key: 'setupIgnoreJoinersRegExp',
    value: function setupIgnoreJoinersRegExp(str) {
      return str.replace(/[^(|)\\]/g, function (val, indx, original) {
        var nextChar = original.charAt(indx + 1);
        if (/[(|)\\]/.test(nextChar) || nextChar === '') {
          return val;
        } else {
          return val + '\0';
        }
      });
    }
  }, {
    key: 'createJoinersRegExp',
    value: function createJoinersRegExp(str) {
      var joiner = [];
      var ignorePunctuation = this.opt.ignorePunctuation;
      if (Array.isArray(ignorePunctuation) && ignorePunctuation.length) {
        joiner.push(this.escapeStr(ignorePunctuation.join('')));
      }
      if (this.opt.ignoreJoiners) {
        joiner.push('\\u00ad\\u200b\\u200c\\u200d');
      }
      return joiner.length ? str.split(/\u0000+/).join('[' + joiner.join('') + ']*') : str;
    }
  }, {
    key: 'createDiacriticsRegExp',
    value: function createDiacriticsRegExp(str) {
      var sens = this.opt.caseSensitive ? '' : 'i',
          dct = this.opt.caseSensitive ? ['aàáảãạăằắẳẵặâầấẩẫậäåāą', 'AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćč', 'CÇĆČ', 'dđď', 'DĐĎ', 'eèéẻẽẹêềếểễệëěēę', 'EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïī', 'IÌÍỈĨỊÎÏĪ', 'lł', 'LŁ', 'nñňń', 'NÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøō', 'OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rř', 'RŘ', 'sšśșş', 'SŠŚȘŞ', 'tťțţ', 'TŤȚŢ', 'uùúủũụưừứửữựûüůū', 'UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿ', 'YÝỲỶỸỴŸ', 'zžżź', 'ZŽŻŹ'] : ['aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ', 'cçćčCÇĆČ', 'dđďDĐĎ', 'eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ', 'iìíỉĩịîïīIÌÍỈĨỊÎÏĪ', 'lłLŁ', 'nñňńNÑŇŃ', 'oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ', 'rřRŘ', 'sšśșşSŠŚȘŞ', 'tťțţTŤȚŢ', 'uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ', 'yýỳỷỹỵÿYÝỲỶỸỴŸ', 'zžżźZŽŻŹ'];
      var handled = [];
      str.split('').forEach(function (ch) {
        dct.every(function (dct) {
          if (dct.indexOf(ch) !== -1) {
            if (handled.indexOf(dct) > -1) {
              return false;
            }
            str = str.replace(new RegExp('[' + dct + ']', 'gm' + sens), '[' + dct + ']');
            handled.push(dct);
          }
          return true;
        });
      });
      return str;
    }
  }, {
    key: 'createMergedBlanksRegExp',
    value: function createMergedBlanksRegExp(str) {
      return str.replace(/[\s]+/gmi, '[\\s]+');
    }
  }, {
    key: 'createAccuracyRegExp',
    value: function createAccuracyRegExp(str) {
      var _this = this;

      var chars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~¡¿';
      var acc = this.opt.accuracy,
          val = typeof acc === 'string' ? acc : acc.value,
          ls = typeof acc === 'string' ? [] : acc.limiters,
          lsJoin = '';
      ls.forEach(function (limiter) {
        lsJoin += '|' + _this.escapeStr(limiter);
      });
      switch (val) {
        case 'partially':
        default:
          return '()(' + str + ')';
        case 'complementary':
          lsJoin = '\\s' + (lsJoin ? lsJoin : this.escapeStr(chars));
          return '()([^' + lsJoin + ']*' + str + '[^' + lsJoin + ']*)';
        case 'exactly':
          return '(^|\\s' + lsJoin + ')(' + str + ')(?=$|\\s' + lsJoin + ')';
      }
    }
  }, {
    key: 'getSeparatedKeywords',
    value: function getSeparatedKeywords(sv) {
      var _this2 = this;

      var stack = [];
      sv.forEach(function (kw) {
        if (!_this2.opt.separateWordSearch) {
          if (kw.trim() && stack.indexOf(kw) === -1) {
            stack.push(kw);
          }
        } else {
          kw.split(' ').forEach(function (kwSplitted) {
            if (kwSplitted.trim() && stack.indexOf(kwSplitted) === -1) {
              stack.push(kwSplitted);
            }
          });
        }
      });
      return {
        'keywords': stack.sort(function (a, b) {
          return b.length - a.length;
        }),
        'length': stack.length
      };
    }
  }, {
    key: 'isNumeric',
    value: function isNumeric(value) {
      return Number(parseFloat(value)) == value;
    }
  }, {
    key: 'checkRanges',
    value: function checkRanges(array) {
      var _this3 = this;

      if (!Array.isArray(array) || Object.prototype.toString.call(array[0]) !== '[object Object]') {
        this.log('markRanges() will only accept an array of objects');
        this.opt.noMatch(array);
        return [];
      }
      var stack = [];
      var last = 0;
      array.sort(function (a, b) {
        return a.start - b.start;
      }).forEach(function (item) {
        var _callNoMatchOnInvalid = _this3.callNoMatchOnInvalidRanges(item, last),
            start = _callNoMatchOnInvalid.start,
            end = _callNoMatchOnInvalid.end,
            valid = _callNoMatchOnInvalid.valid;

        if (valid) {
          item.start = start;
          item.length = end - start;
          stack.push(item);
          last = end;
        }
      });
      return stack;
    }
  }, {
    key: 'callNoMatchOnInvalidRanges',
    value: function callNoMatchOnInvalidRanges(range, last) {
      var start = void 0,
          end = void 0,
          valid = false;
      if (range && typeof range.start !== 'undefined') {
        start = parseInt(range.start, 10);
        end = start + parseInt(range.length, 10);
        if (this.isNumeric(range.start) && this.isNumeric(range.length) && end - last > 0 && end - start > 0) {
          valid = true;
        } else {
          this.log('Ignoring invalid or overlapping range: ' + ('' + JSON.stringify(range)));
          this.opt.noMatch(range);
        }
      } else {
        this.log('Ignoring invalid range: ' + JSON.stringify(range));
        this.opt.noMatch(range);
      }
      return {
        start: start,
        end: end,
        valid: valid
      };
    }
  }, {
    key: 'checkWhitespaceRanges',
    value: function checkWhitespaceRanges(range, originalLength, string) {
      var end = void 0,
          valid = true,
          max = string.length,
          offset = originalLength - max,
          start = parseInt(range.start, 10) - offset;
      start = start > max ? max : start;
      end = start + parseInt(range.length, 10);
      if (end > max) {
        end = max;
        this.log('End range automatically set to the max value of ' + max);
      }
      if (start < 0 || end - start < 0 || start > max || end > max) {
        valid = false;
        this.log('Invalid range: ' + JSON.stringify(range));
        this.opt.noMatch(range);
      } else if (string.substring(start, end).replace(/\s+/g, '') === '') {
        valid = false;
        this.log('Skipping whitespace only range: ' + JSON.stringify(range));
        this.opt.noMatch(range);
      }
      return {
        start: start,
        end: end,
        valid: valid
      };
    }
  }, {
    key: 'getTextNodes',
    value: function getTextNodes(cb) {
      var _this4 = this;

      var val = '',
          nodes = [];
      this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function (node) {
        nodes.push({
          start: val.length,
          end: (val += node.textContent).length,
          node: node
        });
      }, function (node) {
        if (_this4.matchesExclude(node.parentNode)) {
          return NodeFilter.FILTER_REJECT;
        } else {
          return NodeFilter.FILTER_ACCEPT;
        }
      }, function () {
        cb({
          value: val,
          nodes: nodes
        });
      });
    }
  }, {
    key: 'matchesExclude',
    value: function matchesExclude(el) {
      return DOMIterator.matches(el, this.opt.exclude.concat(['script', 'style', 'title', 'head', 'html']));
    }
  }, {
    key: 'wrapRangeInTextNode',
    value: function wrapRangeInTextNode(node, start, end) {
      var hEl = !this.opt.element ? 'mark' : this.opt.element,
          startNode = node.splitText(start),
          ret = startNode.splitText(end - start);
      var repl = document.createElement(hEl);
      repl.setAttribute('data-markjs', 'true');
      if (this.opt.className) {
        repl.setAttribute('class', this.opt.className);
      }
      repl.textContent = startNode.textContent;
      startNode.parentNode.replaceChild(repl, startNode);
      return ret;
    }
  }, {
    key: 'wrapRangeInMappedTextNode',
    value: function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
      var _this5 = this;

      dict.nodes.every(function (n, i) {
        var sibl = dict.nodes[i + 1];
        if (typeof sibl === 'undefined' || sibl.start > start) {
          if (!filterCb(n.node)) {
            return false;
          }
          var s = start - n.start,
              e = (end > n.end ? n.end : end) - n.start,
              startStr = dict.value.substr(0, n.start),
              endStr = dict.value.substr(e + n.start);
          n.node = _this5.wrapRangeInTextNode(n.node, s, e);
          dict.value = startStr + endStr;
          dict.nodes.forEach(function (k, j) {
            if (j >= i) {
              if (dict.nodes[j].start > 0 && j !== i) {
                dict.nodes[j].start -= e;
              }
              dict.nodes[j].end -= e;
            }
          });
          end -= e;
          eachCb(n.node.previousSibling, n.start);
          if (end > n.end) {
            start = n.end;
          } else {
            return false;
          }
        }
        return true;
      });
    }
  }, {
    key: 'wrapMatches',
    value: function wrapMatches(regex, ignoreGroups, filterCb, eachCb, endCb) {
      var _this6 = this;

      var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
      this.getTextNodes(function (dict) {
        dict.nodes.forEach(function (node) {
          node = node.node;
          var match = void 0;
          while ((match = regex.exec(node.textContent)) !== null && match[matchIdx] !== '') {
            if (!filterCb(match[matchIdx], node)) {
              continue;
            }
            var pos = match.index;
            if (matchIdx !== 0) {
              for (var i = 1; i < matchIdx; i++) {
                pos += match[i].length;
              }
            }
            node = _this6.wrapRangeInTextNode(node, pos, pos + match[matchIdx].length);
            eachCb(node.previousSibling);
            regex.lastIndex = 0;
          }
        });
        endCb();
      });
    }
  }, {
    key: 'wrapMatchesAcrossElements',
    value: function wrapMatchesAcrossElements(regex, ignoreGroups, filterCb, eachCb, endCb) {
      var _this7 = this;

      var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
      this.getTextNodes(function (dict) {
        var match = void 0;
        while ((match = regex.exec(dict.value)) !== null && match[matchIdx] !== '') {
          var start = match.index;
          if (matchIdx !== 0) {
            for (var i = 1; i < matchIdx; i++) {
              start += match[i].length;
            }
          }
          var end = start + match[matchIdx].length;
          _this7.wrapRangeInMappedTextNode(dict, start, end, function (node) {
            return filterCb(match[matchIdx], node);
          }, function (node, lastIndex) {
            regex.lastIndex = lastIndex;
            eachCb(node);
          });
        }
        endCb();
      });
    }
  }, {
    key: 'wrapRangeFromIndex',
    value: function wrapRangeFromIndex(ranges, filterCb, eachCb, endCb) {
      var _this8 = this;

      this.getTextNodes(function (dict) {
        var originalLength = dict.value.length;
        ranges.forEach(function (range, counter) {
          var _checkWhitespaceRange = _this8.checkWhitespaceRanges(range, originalLength, dict.value),
              start = _checkWhitespaceRange.start,
              end = _checkWhitespaceRange.end,
              valid = _checkWhitespaceRange.valid;

          if (valid) {
            _this8.wrapRangeInMappedTextNode(dict, start, end, function (node) {
              return filterCb(node, range, dict.value.substring(start, end), counter);
            }, function (node) {
              eachCb(node, range);
            });
          }
        });
        endCb();
      });
    }
  }, {
    key: 'unwrapMatches',
    value: function unwrapMatches(node) {
      var parent = node.parentNode;
      var docFrag = document.createDocumentFragment();
      while (node.firstChild) {
        docFrag.appendChild(node.removeChild(node.firstChild));
      }
      parent.replaceChild(docFrag, node);
      if (!this.ie) {
        parent.normalize();
      } else {
        this.normalizeTextNode(parent);
      }
    }
  }, {
    key: 'normalizeTextNode',
    value: function normalizeTextNode(node) {
      if (!node) {
        return;
      }
      if (node.nodeType === 3) {
        while (node.nextSibling && node.nextSibling.nodeType === 3) {
          node.nodeValue += node.nextSibling.nodeValue;
          node.parentNode.removeChild(node.nextSibling);
        }
      } else {
        this.normalizeTextNode(node.firstChild);
      }
      this.normalizeTextNode(node.nextSibling);
    }
  }, {
    key: 'markRegExp',
    value: function markRegExp(regexp, opt) {
      var _this9 = this;

      this.opt = opt;
      this.log('Searching with expression "' + regexp + '"');
      var totalMatches = 0,
          fn = 'wrapMatches';
      var eachCb = function eachCb(element) {
        totalMatches++;
        _this9.opt.each(element);
      };
      if (this.opt.acrossElements) {
        fn = 'wrapMatchesAcrossElements';
      }
      this[fn](regexp, this.opt.ignoreGroups, function (match, node) {
        return _this9.opt.filter(node, match, totalMatches);
      }, eachCb, function () {
        if (totalMatches === 0) {
          _this9.opt.noMatch(regexp);
        }
        _this9.opt.done(totalMatches);
      });
    }
  }, {
    key: 'mark',
    value: function mark(sv, opt) {
      var _this10 = this;

      this.opt = opt;
      var totalMatches = 0,
          fn = 'wrapMatches';

      var _getSeparatedKeywords = this.getSeparatedKeywords(typeof sv === 'string' ? [sv] : sv),
          kwArr = _getSeparatedKeywords.keywords,
          kwArrLen = _getSeparatedKeywords.length,
          sens = this.opt.caseSensitive ? '' : 'i',
          handler = function handler(kw) {
        var regex = new RegExp(_this10.createRegExp(kw), 'gm' + sens),
            matches = 0;
        _this10.log('Searching with expression "' + regex + '"');
        _this10[fn](regex, 1, function (term, node) {
          return _this10.opt.filter(node, kw, totalMatches, matches);
        }, function (element) {
          matches++;
          totalMatches++;
          _this10.opt.each(element);
        }, function () {
          if (matches === 0) {
            _this10.opt.noMatch(kw);
          }
          if (kwArr[kwArrLen - 1] === kw) {
            _this10.opt.done(totalMatches);
          } else {
            handler(kwArr[kwArr.indexOf(kw) + 1]);
          }
        });
      };

      if (this.opt.acrossElements) {
        fn = 'wrapMatchesAcrossElements';
      }
      if (kwArrLen === 0) {
        this.opt.done(totalMatches);
      } else {
        handler(kwArr[0]);
      }
    }
  }, {
    key: 'markRanges',
    value: function markRanges(rawRanges, opt) {
      var _this11 = this;

      this.opt = opt;
      var totalMatches = 0,
          ranges = this.checkRanges(rawRanges);
      if (ranges && ranges.length) {
        this.log('Starting to mark with the following ranges: ' + JSON.stringify(ranges));
        this.wrapRangeFromIndex(ranges, function (node, range, match, counter) {
          return _this11.opt.filter(node, range, match, counter);
        }, function (element, range) {
          totalMatches++;
          _this11.opt.each(element, range);
        }, function () {
          _this11.opt.done(totalMatches);
        });
      } else {
        this.opt.done(totalMatches);
      }
    }
  }, {
    key: 'unmark',
    value: function unmark(opt) {
      var _this12 = this;

      this.opt = opt;
      var sel = this.opt.element ? this.opt.element : '*';
      sel += '[data-markjs]';
      if (this.opt.className) {
        sel += '.' + this.opt.className;
      }
      this.log('Removal selector "' + sel + '"');
      this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function (node) {
        _this12.unwrapMatches(node);
      }, function (node) {
        var matchesSel = DOMIterator.matches(node, sel),
            matchesExclude = _this12.matchesExclude(node);
        if (!matchesSel || matchesExclude) {
          return NodeFilter.FILTER_REJECT;
        } else {
          return NodeFilter.FILTER_ACCEPT;
        }
      }, this.opt.done);
    }
  }, {
    key: 'opt',
    set: function set$$1(val) {
      this._opt = _extends({}, {
        'element': '',
        'className': '',
        'exclude': [],
        'iframes': false,
        'iframesTimeout': 5000,
        'separateWordSearch': true,
        'diacritics': true,
        'synonyms': {},
        'accuracy': 'partially',
        'acrossElements': false,
        'caseSensitive': false,
        'ignoreJoiners': false,
        'ignoreGroups': 0,
        'ignorePunctuation': [],
        'wildcards': 'disabled',
        'each': function each() {},
        'noMatch': function noMatch() {},
        'filter': function filter() {
          return true;
        },
        'done': function done() {},
        'debug': false,
        'log': window.console
      }, val);
    },
    get: function get$$1() {
      return this._opt;
    }
  }, {
    key: 'iterator',
    get: function get$$1() {
      return new DOMIterator(this.ctx, this.opt.iframes, this.opt.exclude, this.opt.iframesTimeout);
    }
  }]);
  return Mark;
}();

function Mark(ctx) {
  var _this = this;

  var instance = new Mark$1(ctx);
  this.mark = function (sv, opt) {
    instance.mark(sv, opt);
    return _this;
  };
  this.markRegExp = function (sv, opt) {
    instance.markRegExp(sv, opt);
    return _this;
  };
  this.markRanges = function (sv, opt) {
    instance.markRanges(sv, opt);
    return _this;
  };
  this.unmark = function (opt) {
    instance.unmark(opt);
    return _this;
  };
  return this;
}

return Mark;

})));

/*!
    Filterability v0.0.1
    https://github.com/Fall-Back/Filterability
    Copyright (c) 2017, Andy Kirk
    Released under the MIT license https://git.io/vwTVl
*/
(function() {
    var ready = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    var getSelectValues = function(select) {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    };

    var setSelectValues = function(select, values) {
        var options = select && select.options;
        var opt;

        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (values.indexOf(opt.value) !== -1) {
                opt.selected = true;
            } else {
                opt.selected = false;
            }
        }
        return true;
    };

    var getParameterByName = function(name, url) {
        url = (typeof url !== 'undefined') ?  url : window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };

    var resetPreset = function(form) {
        els = form.querySelectorAll('[filterable_preset]');

        Array.prototype.forEach.call(els, function(el, i) {
            var el_tagName = el.tagName.toLowerCase();

            if (el_tagName == 'select') {
                setSelectValues(el, []);
            } else if (el_tagName == 'input' && (el.getAttribute('type') == 'checkbox' || el.getAttribute('type') == 'radio')) {
                el.checked = false;
            }
        });
    };

    var triggerEvent = function(element, event_type) {

        //console.log(element, event_type);
        setTimeout(function() {
            var event = document.createEvent('Event');
            event.initEvent(event_type, true, false);
            element.dispatchEvent(event);
        }, 1);
        

    }

    var filterability = {

        markjs_error_raised: false,
        filterable_index_names: [],

        init: function() {
            // Look for all `filterable_group`:
            var filterable_groups = document.querySelectorAll('[filterable_group]');

            Array.prototype.forEach.call(filterable_groups, function(filterable_group, i) {
                // Store items:
                filterable_group.items = filterable_group.querySelectorAll('[filterable_item]');

                // Action 'remove' selector:
                var remove_selector = filterable_group.getAttribute('filterable_remove');
                if (remove_selector !== '') {
                    var remove_els = document.querySelectorAll(remove_selector);
                    Array.prototype.forEach.call(remove_els, function(remove_el, i) {
                        remove_el.remove();
                    });
                }

                // Expose the form if necessary:
                var filterable_form_template = filterable_group.querySelector('[filterable_form_template]');
                var filterable_form;
                var form_added = false;
                if (filterable_form_template) {
                    filterable_form = filterable_form_template.innerHTML;

                    // Check for a replace selector, and put the form there, otherwise keep it in
                    // place:
                    var replace_selector = filterable_group.getAttribute('filterable_replace');
                    if (replace_selector) {
                        var replace_el = document.querySelector(replace_selector);
                        var form_el = document.createElement('div');
                        form_el.id  = 'filterable_form_' + i;
                        form_el.innerHTML = filterable_form;
                        if (replace_el.parentNode.replaceChild(form_el, replace_el)) {
                            form_added = form_el.id;
                        }
                    } else {
                        filterable_form_template.insertAdjacentHTML('afterend', filterable_form);
                        form_added = true;
                    }
                }

                // If the form hasn't been added, we can't go any further.
                if (!form_added) {
                    return;
                }

                // Generate initial indexes:
                filterability.generateIndex(filterable_group);


                // Add the empty message to each list:
                var filterable_empty_list_template = filterable_group.querySelector('[filterable_empty_list_template]');
                var filterable_empty_list;
                if (filterable_empty_list_template) {
                    filterable_empty_list = filterable_empty_list_template.innerHTML;
                } else {
                    // Might as well provide a default:
                    var filterable_empty_list_message = 'No matches found.';
                    var filterable_empty_list_element = document.createElement('p');
                    filterable_empty_list_element.textContent = filterable_empty_list_message;
                    filterable_empty_list_element.setAttribute('filterable_empty_list_message', '');
                    filterable_empty_list_element.setAttribute('hidden', '');
                    filterable_empty_list = filterable_empty_list_element.outerHTML;
                }

                var filterable_lists = filterable_group.querySelectorAll('[filterable_list]');
                Array.prototype.forEach.call(filterable_lists, function(filterable_list, i) {
                    filterable_list.insertAdjacentHTML('afterend', filterable_empty_list);
                });

                if (typeof form_added  === 'string') {
                    filterable_form = document.querySelector('#' + form_added);
                } else {
                    filterable_form = filterable_group;
                }

                if (!filterable_form) {
                    console.error('Could not find form.');
                    return;
                }

                // Get the input:
                var filterable_input = filterable_form.querySelector('[filterable_input]');

                // Check if there's sessionStorage for the input and use that value:
                filterable_input.value = window.sessionStorage.getItem(filterable_input.id);

                // Check if there's a corresponding query string parameter and use that value:
                var input_val;
                if (input_val = getParameterByName(filterable_input.id)) {
                    filterable_input.value = input_val;
                }
                
                // Trigger change event not natively fired:
                triggerEvent(filterable_input, 'change');


                // Check for presence of a submit button:
                var filterable_submit = filterable_form.querySelector('[filterable_submit]');

                // If there is one, we want to attach the hander, otherwise, filter on keyup:
                if (filterable_submit) {
                    filterable_submit.addEventListener('click', function(e) {
                        e.preventDefault();

                        // Add value to sessionStorage:
                        window.sessionStorage.setItem(filterable_input.id, filterable_input.value);

                        // Filter the list:
                        filterability.filterList(filterable_group, filterable_input.value);
                        return false;
                    });
                } else {

                    // Attach search input handler:
                    // @TODO: Could allow for different input actions to trigger this.
                    // E.g. user may want to choose from a list of predefined options by which to filter
                    // the list(s) so a select or checkbox change should work as well.

                    filterable_input.addEventListener('keyup', function(e) {
                        // Add value to sessionStorage:
                        window.sessionStorage.setItem(filterable_input.id, this.value);

                        // Filter the list:
                        filterability.filterList(filterable_group, this.value);
                    });
                }

                // Prevent the form being submitted ever:
                // - No a form may have a legitmate need to be be filterable AND be submitted.
                // - use input[type="button"] to prevent submits instead.
                /*filterable_input.form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    return false;
                });*/


                // Toggler stuff:
                var filterable_toggles = filterable_form.querySelectorAll('[filterable_toggle]');

                if (filterable_toggles.length > 0) {
                    var els = filterable_group.querySelector('[filterable_item]').querySelectorAll('[filterable_index_name]');
                    filterability.filterable_index_names = Array.prototype.map.call(els, function(obj) {
                        return obj.getAttribute('filterable_index_name');
                    });

                    Array.prototype.forEach.call(filterable_toggles, function(filterable_toggle, i) {
                        var el_tagName = filterable_toggle.tagName.toLowerCase();
                        var el_type = filterable_toggle.type;
                        if (el_type) {
                            el_type = el_type.toLowerCase();
                        }
                        // Check element is of valid / supported type:
                        if (el_tagName === 'select' || (el_tagName === 'input' && ['checkbox', 'radio'].indexOf(el_type) > -1)) {
                            // Check if the value matches the ones available in the data (or empty string for ALL):
                            if (
                                filterability.filterable_index_names.indexOf(filterable_toggle.getAttribute('filterable_toggle')) > -1
                             || filterable_toggle.getAttribute('filterable_toggle') === ''
                            ) {
                                // Add the event listener:
                                filterable_toggle.addEventListener('change', function(e) {
                                    filterability.toggle_index(filterable_group, this.getAttribute('filterable_toggle'));
                                    filterability.generateIndex(filterable_group);
                                    filterability.filterList(filterable_group, filterable_input.value);

                                    //console.log(el_tagName + ' toggler ' + el_type);

                                    // Add value to sessionStorage:
                                    window.sessionStorage.setItem(filterable_input.id + '.filterable_toggle', this.getAttribute('filterable_toggle'));
                                });

                                // Check the sessionStorage and query string parameter to see if one should be checked:
                                var toggle_val = window.sessionStorage.getItem(filterable_input.id + '.filterable_toggle');

                                var qs_toggle;
                                if (qs_toggle = getParameterByName(filterable_input.id + '.filterable_toggle')) {
                                    toggle_val = qs_toggle;
                                }

                                if (toggle_val && toggle_val == filterable_toggle.getAttribute('filterable_toggle')) {
                                    filterable_toggle.click();
                                }
                            }
                        }
                    });

                }


                // Exclusion stuff:
                filterability.update_exclusions(filterable_group, filterable_form);

                var excludable_toggles = filterable_form.querySelectorAll('[filterable_exclude_container][filterable_exclude_match]');

                if (excludable_toggles.length > 0) {
                    Array.prototype.forEach.call(excludable_toggles, function(excludable_toggle, i) {
                        var el_tagName = excludable_toggle.tagName.toLowerCase();
                        var el_type = excludable_toggle.type;
                        if (el_type) {
                            el_type = el_type.toLowerCase();
                        }
                        // Check element is of valid / supported type:
                        if (el_tagName === 'input' && ['checkbox'].indexOf(el_type) > -1) {
                            excludable_toggle.addEventListener('change', function(e) {
                                filterability.update_exclusions(filterable_group, filterable_form);
                            });
                        }
                    });
                }

                // Check for presence of a reset button:
                var filterable_reset = filterable_form.querySelector('[filterable_reset]');
                if (filterable_reset) {
                    filterable_reset.addEventListener('click', function(e) {

                        // We need this to happen AFTER reset has completed, so use a timeout:
                        setTimeout(function() {
                            // Clear the sessionStorage:
                            window.sessionStorage.removeItem(filterable_input.id);
                            window.sessionStorage.removeItem(filterable_input.id + '.filterable_toggle');

                            // 'Reset' doesn't re-trigger the toggler stuff, so do that here:
                            var event = document.createEvent('HTMLEvents');
                            event.initEvent('change', true, false);

                            var toggler_selects = filterable_form.querySelectorAll('select[filterable_toggle]');
                            Array.prototype.forEach.call(toggler_selects, function(toggler_select, i) {
                                toggler_select.dispatchEvent(event);
                            });

                            var toggler_checkradios = filterable_form.querySelectorAll('[filterable_toggle]:checked');
                            Array.prototype.forEach.call(toggler_checkradios, function(toggler_checkradio, i) {

                                //console.log(toggler_checkradio);
                                toggler_checkradio.dispatchEvent(event);
                            });


                            filterability.filterList(filterable_group, '');
                        }, 1);
                    });
                }

                // Allow values pre-filled by the browser to update the list:
                window.setTimeout(function(){
                    filterability.trigger_filter(filterable_submit, filterable_input);
                }, 100);


                // Add behaviour to preset inputs:
                var preset_inputs = filterable_form.querySelectorAll('[filterable_preset]');

                if (preset_inputs.length > 0) {

                    /* I'm not sure I really need a form input for this, but leave here for reference:
                    // Add a hidden input to store the preset origin so we can restore the form
                    // element UI state accross page loads:
                    var preset_origin = document.createElement('input');
                    preset_origin.setAttribute('type', 'hidden');
                    preset_origin.setAttribute('filterable_input_preset_origin', '');

                    filterable_form.querySelector('form').appendChild(preset_origin);
                    */

                    Array.prototype.forEach.call(preset_inputs, function(preset_input, i) {

                        preset_input.addEventListener('change', function(e) {
                            e.preventDefault();

                            var el = e.target;

                            var el_tagName = preset_input.tagName.toLowerCase();

                            if (el_tagName == 'select') {
                                var selected_values = getSelectValues(el);

                                resetPreset(el.form);
                                setSelectValues(el, selected_values);

                                filterable_input.value = selected_values.join('|');

                            } else if (el_tagName == 'input' && el.getAttribute('type') == 'checkbox') {
                                // Get all check boxes with the same name as they're series:
                                var values = [];
                                var el_name = el.getAttribute('name');

                                var checkboxes = filterable_form.querySelectorAll('input[name="' + el_name + '"]:checked');
                                Array.prototype.forEach.call(checkboxes, function(checkbox, i) {
                                    values.push(checkbox.value);
                                });

                                resetPreset(el.form);
                                Array.prototype.forEach.call(checkboxes, function(checkbox, i) {
                                    if(values.indexOf(checkbox.value) !== -1) {
                                        checkbox.checked = true;
                                    }
                                });


                                filterable_input.value = values.join('|');
                            } else {
                                filterable_input.value = el.value;
                            }
                            
                            // Trigger change event not natively fired:
                            triggerEvent(filterable_input, 'change');

                            // Store the preset origin:
                            //preset_origin.value = el.name;
                            window.sessionStorage.setItem(filterable_input.preset_origin, el.name);

                            filterability.trigger_filter(filterable_submit, filterable_input);
                        });

                        // If the prest origin has been set, update the form UI:
                        /*if (
                            window.sessionStorage.getItem(filterable_input.preset_origin) == preset_input.name
                         || preset_origin.value == preset_input.name
                        ) {*/
                        if (window.sessionStorage.getItem(filterable_input.preset_origin) == preset_input.name) {

                            // This element was recorded as the preset origin.

                            var existing_value = filterable_input.value;
                            var existing_value_array = existing_value.split('|');
                            var el_tagName = preset_input.tagName.toLowerCase();

                            if (el_tagName == 'select') {
                                setSelectValues(preset_input, existing_value_array);
                            } else if (el_tagName == 'input' && preset_input.getAttribute('type') == 'checkbox') {
                                if (existing_value_array.indexOf(preset_input.value) !== -1) {
                                    preset_input.checked = true;
                                }
                            }
                        }

                    });
                }
            });

        },

        trigger_filter: function(filterable_submit, filterable_input) {
            if (filterable_submit) {
                filterable_submit.click();
            } else {
                var kbd_evt;
                
                try {
                    kbd_evt = new KeyboardEvent('keyup', {'key': '13', 'bubbles': true});
                } catch (e) {
                    kbd_evt = document.createEvent('KeyboardEvent');
                    kbd_evt.initKeyboardEvent(
                        'keyup',
                        false,
                        false,
                        null,
                        '13',
                        0,
                        '',
                        false,
                        ''
                    );
                }
                
                filterable_input.dispatchEvent(kbd_evt);
            }
        },

        update_exclusions: function(group, form) {
            group.exclusions = {
                length: 0,
                keys: []
            };
            var excludable_toggles = form.querySelectorAll('[filterable_exclude_container][filterable_exclude_match]');

            if (excludable_toggles.length > 0) {
                Array.prototype.forEach.call(excludable_toggles, function(excludable_toggle, i) {

                    if (!excludable_toggle.checked) {

                        var container_name = excludable_toggle.getAttribute('filterable_exclude_container');

                        if (group.exclusions[container_name] === undefined) {
                            group.exclusions[container_name] = [];
                        }

                        group.exclusions[container_name].push(excludable_toggle.getAttribute('filterable_exclude_match'));
                        group.exclusions.length++;
                        group.exclusions.keys.push(container_name);
                    }
                });

                var filterable_input = form.querySelector('[filterable_input]');
                filterability.filterList(group, filterable_input.value);
            }
        },

        generateIndex: function(group) {
            var items = group.items;
            var index_string;
            Array.prototype.forEach.call(items, function(item, i){
                if (item.getAttribute('filterable_index') === '') {
                    index_string = item.textContent;
                } else {
                    var indexes = item.querySelectorAll('[filterable_index]');

                    // @TODO: there's probably a more concise way of doing this. Need to ++ my JS. :-(
                    index_string = '';

                    Array.prototype.forEach.call(indexes, function(index, i) {
                        index_string += index.textContent + ' ';
                    });
                }

                // Tidy index string:
                index_string = index_string.toLowerCase().trim();
                index_string = index_string.replace(/\s{2,}/g, '');

                item.setAttribute('filterable_index_string', index_string);
            });
        },

        filterList: function(group, query) {

            query = query.toLowerCase().trim();
            var items = group.items;
            var odd_even = 'odd';

            Array.prototype.forEach.call(items, function(item, i) {
                // Apply exclusions:
                var skip = false;
                if (group.exclusions && group.exclusions.length > 0) {
                    Array.prototype.forEach.call(group.exclusions.keys, function(ex_el_name) {
                        Array.prototype.forEach.call(group.exclusions[ex_el_name], function(ex_match) {
                            var re = new RegExp(ex_match);
                            var ex_el = item.querySelector(ex_el_name);
                            var match = re.exec(ex_el.innerHTML);
                            if (match !== null) {
                                skip = true;
                            }
                        });
                    });
                }

                item.removeAttribute('hidden');
                item.removeAttribute('filterable_visible_item');
                if (skip) {
                    item.setAttribute('hidden', '');
                    return;
                }

                // Tidy query in case it was entered in a more readable way:
                query = query.replace(' |', '|');
                query = query.replace('| ', '|');

                var regex = new RegExp('(' + query + ')', 'g');
                var str_to_test = item.getAttribute('filterable_index_string');

                if (regex.test(str_to_test)) {
                    item.removeAttribute('hidden');

                    item.setAttribute('filterable_visible_item', odd_even);
                    odd_even = odd_even == 'odd' ? 'even' : 'odd';

                    // Check we want to highlight results:
                    if (group.getAttribute('filterable_mark_results') === '') {
                        filterability.debounce(filterability.highlight_results(item, regex, str_to_test), 250);
                    }
                } else {
                    item.setAttribute('hidden', '');
                }
            });


            filterability.checkListEmpty(group);
        },

        checkListEmpty: function(group) {
            // After filtering, if a list is empty, show the 'empty' message:
            var lists = group.querySelectorAll('[filterable_list]');
            Array.prototype.forEach.call(lists, function(list, i) {
                var n_items       = list.querySelectorAll('[filterable_item]:not([hidden])').length;
                var list_is_empty = !n_items;
                var empty_message = list.nextElementSibling;
                // @TODO: should probably check the we've really selected a `filterable_empty_list_message`

                list.setAttribute('filterable_visibile_items', n_items);

                if (list_is_empty) {
                    list.setAttribute('hidden', '');
                    empty_message.removeAttribute('hidden');
                } else {
                    list.removeAttribute('hidden');
                    empty_message.setAttribute('hidden', '');
                }
            });
        },

        // Allow user-selected indexes:
        toggle_index: function(group, index_name) {
            var items = group.querySelectorAll('[filterable_index_name]');

            Array.prototype.forEach.call(items, function(item, i) {
                if (
                    item.getAttribute('filterable_index_name') === index_name
                 || index_name === ''
                ) {
                    item.setAttribute('filterable_index', '');
                } else {
                    item.removeAttribute('filterable_index');
                }
            });
        },

        //highlight_results: function(item, query) {
        highlight_results: function(item, regex, str_to_test) {
            // Note this can be really slow on large lists.
            if (window.Mark) {
                var markInstance = new Mark(item.querySelectorAll('[filterable_index], [filterable_index_name]'));
                markInstance.unmark({
                    done: function(){
                        var matches = str_to_test.match(regex);
                        Array.prototype.forEach.call(matches, function(match, i) {
                            markInstance.mark(match);
                        });
                    }
                });
            } else {
                if (!filterability.markjs_error_raised) {
                    console.error('Mark.js isn\'t loaded - could not highlight query results.');
                    filterability.markjs_error_raised = true;
                }
            }
        },

        closest: function(el, selector, stopSelector) {
            var retval = null;
            while (el) {
                if (el.matches(selector)) {
                    retval = el;
                    break;
                } else if (stopSelector && el.matches(stopSelector)) {
                    break;
                }
                el = el.parentElement;
            }
            return retval;
        },

        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }
    };

    ready(filterability.init);
})();