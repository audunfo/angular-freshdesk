'use strict';

/**
 * @ngdoc object
 * @name freshdesk.widget.$freshWidgetProvider
 */
$freshWidgetProvider.$inject = [];
function $freshWidgetProvider () {
  var scriptUrl,
      accountUrl,
      assetUrl,
      secure = false,
      requester,
      product,
      fields = {},
      options = {};

  function buildQueryString () {
    var query = '';

    if (angular.isDefined(requester))
      query += '&helpdesk_ticket[requester]=' + encodeURIComponent(requester);

    if (angular.isDefined(product))
      query += '&helpdesk_ticket[product]=' + encodeURIComponent(product);

    Object.keys(fields).forEach(function (key) {
      query += '&helpdesk_ticket[custom_field][' + encodeURIComponent(key) + ']=' + encodeURIComponent(fields[key]);
    });

    // Strip first ampersand
    return query.length ? query.substr(1) : undefined;
  }

  function getWidgetOptions () {
    var query = buildQueryString();

    if (angular.isDefined(query))
      options.queryString = query;

    if (angular.isDefined(accountUrl))
      options.url = accountUrl;

    options.assetUrl = getAssetUrl();

    return options;
  }

  function getScriptUrl () {
    if (angular.isDefined(scriptUrl))
      return scriptUrl;

    if (secure)
      return 'https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js';
    else
      return 'http://assets.freshdesk.com/widget/freshwidget.js';
  }

  function getAssetUrl () {
    if (angular.isDefined(assetUrl))
      return assetUrl;

    if (secure)
      return 'https://s3.amazonaws.com/assets.freshdesk.com/widget';
    else
      return 'http://assets.freshdesk.com/widget';
  }

  /**
   * @ngdoc function
   * @name freshdesk.widget.$freshWidgetProvider#setScriptUrl
   * @methodOf freshdesk.widget.$freshWidgetProvider
   *
   * @param {string} url The URL to the freshwidget.js file
   *
   * @description
   * Override the URL for the FreshWidget javascript library.
   */
  this.setScriptUrl = function (url) {
    scriptUrl = url;
  };

  /**
   * @ngdoc function
   * @name freshdesk.widget.$freshWidgetProvider#setAccount
   * @methodOf freshdesk.widget.$freshWidgetProvider
   *
   * @param {string} account Your account name
   *
   * @description
   * Set the FreshDesk account name. Internally, this will set the link to your support portal.
   */
  this.setAccount = function (account) {
    accountUrl = 'https://' + account + '.freshdesk.com';
  };

  /**
   * @ngdoc function
   * @name freshdesk.widget.$freshWidgetProvider#setAccountUrl
   * @methodOf freshdesk.widget.$freshWidgetProvider
   *
   * @param {string} url Your account URL
   *
   * @description
   * Set the URL to your FreshDesk support portal.
   */
  this.setAccountUrl = function (url) {
    accountUrl = url;
  };

  /**
   * @ngdoc function
   * @name freshdesk.widget.$freshWidgetProvider#setOptions
   * @methodOf freshdesk.widget.$freshWidgetProvider
   *
   * @param {object} opts The options object
   *
   * @description
   * Set the widget options.
   */
  this.setOptions = function (opts) {
    options = opts;
  };

  /**
   * @ngdoc function
   * @name freshdesk.widget.$freshWidgetProvider#setProduct
   * @methodOf freshdesk.widget.$freshWidgetProvider
   *
   * @param {string} prod The product id
   *
   * @description
   * Set the product for which this widget is active (for use in a multi-product environment).
   */
  this.setProduct = function (prod) {
    product = prod;
  };

  /**
   * @ngdoc object
   * @name freshdesk.widget.$freshWidget
   *
   * @requires $q
   * @requires $location
   * @requires $document
   * @requires $window
   */
  this.$get = $get;
  $get.$inject = ['$q', '$location', '$document', '$window'];
  function $get ($q, $location, $document, $window) {
    var $freshWidget = {},
        script,
        widget = $q.defer();

    secure = $location.protocol() === 'https';

    /**
     * @ngdoc function
     * @name freshdesk.widget.$freshWidget#init
     * @methodOf freshdesk.widget.$freshWidget
     *
     * @return {promise} A promise that will resolve when the script has been loaded
     *
     * @description Injects the widget script into the DOM and initializes the FreshWidget once the script is loaded.
     */
    $freshWidget.init = function () {
      script = $document[0].createElement('script');

      script.type = 'text/javascript';
      script.async = true;
      script.src = getScriptUrl();

      script.onload = function (event) {
        try {
          $window.FreshWidget.init('', getWidgetOptions());

          widget.resolve(event);
        } catch (error) {
          widget.reject(error);
        }
      };

      script.onerror = function (event) {
        widget.reject(event);
      };

      $document.find('body').append(script);

      return widget.promise;
    };

    /**
     * @ngdoc function
     * @name freshdesk.widget.$freshWidget#show
     * @methodOf freshdesk.widget.$freshWidget
     *
     * @description Destroy the FreshWidget.
     */
    $freshWidget.destroy = function () {
      $window.FreshWidget.destroy();

      angular.element(script).remove();
    };

    /**
     * @ngdoc function
     * @name freshdesk.widget.$freshWidget#inject
     * @methodOf freshdesk.widget.$freshWidget
     *
     * @param {object} opts The options object
     *
     * @description Add extra widget options and re-initialize the widget
     */
    $freshWidget.addOptions = function (opts) {
      angular.extend(options, opts);
    };

    /**
     * @ngdoc function
     * @name freshdesk.widget.$freshWidget#identify
     * @methodOf freshdesk.widget.$freshWidget
     *
     * @param {string}  emailAddress The requester's email address
     * @param {object} [values=null] Extra fields to pass to the widget
     *
     * @description Update the widget
     */
    $freshWidget.identify = function (emailAddress, values) {
      requester = emailAddress;
      fields = values;

      $window.FreshWidget.update(getWidgetOptions());
    };

    /**
     * @ngdoc function
     * @name freshdesk.widget.$freshWidget#show
     * @methodOf freshdesk.widget.$freshWidget
     *
     * @description Show the widget form
     */
    $freshWidget.show = function () {
      $window.FreshWidget.show();
    };

    /**
     * @ngdoc function
     * @name freshdesk.widget.$freshWidget#hide
     * @methodOf freshdesk.widget.$freshWidget
     *
     * @description Hide the widget form
     */
    $freshWidget.hide = function () {
      $window.FreshWidget.close();
    };

    return $freshWidget;
  }
}

angular.module('freshdesk.widget', ['ng'])
  .provider('$freshWidget', $freshWidgetProvider);