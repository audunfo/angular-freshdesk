/**
 * @ngdoc object
 * @name sw.freshdesk.$freshDeskProvider
 *
 * @requires sw.freshdesk-chat.$freshChatProvider
 * @requires sw.freshdesk-widget.$freshWidgetProvider
 *
 * @description
 * Utility service for the different FreshDesk components.
 *
 * Using this provider, you can configure the common settings for all components at once.
 */
$freshDeskProvider.$inject = ['$freshChatProvider', '$freshWidgetProvider'];
function $freshDeskProvider ($freshChatProvider, $freshWidgetProvider) {
  'use strict';

  var chat = false, widget = false;

  /**
   * @ngdoc function
   * @name sw.freshdesk.$freshDeskProvider#setAccount
   * @methodOf sw.freshdesk.$freshDeskProvider
   *
   * @param {string} account Your account name
   *
   * @description
   * Set the FreshDesk account name. Internally, this will set the link to your support portal.
   */
  this.setAccount = function (account) {
    $freshChatProvider.setAccount(account);
    $freshWidgetProvider.setAccount(account);
  };

  /**
   * @ngdoc function
   * @name sw.freshdesk.$freshDeskProvider#setAccountUrl
   * @methodOf sw.freshdesk.$freshDeskProvider
   *
   * @param {string} url Your account URL
   *
   * @description
   * Set the URL to your FreshDesk support portal.
   */
  this.setAccountUrl = function (url) {
    $freshChatProvider.setAccountUrl(url);
    $freshWidgetProvider.setAccountUrl(url);
  };

  /**
   * @ngdoc function
   * @name sw.freshdesk.$freshDeskProvider#enableChat
   * @methodOf sw.freshdesk.$freshDeskProvider
   *
   * @param {boolean} [enabled=true] Whether to enable FreshChat
   *
   * @description
   * Enable the FreshChat component.
   */
  this.enableChat = function (enabled) {
    chat = angular.isDefined(enabled) ? enabled : true;
  };

  /**
   * @ngdoc function
   * @name sw.freshdesk.$freshDeskProvider#enableWidget
   * @methodOf sw.freshdesk.$freshDeskProvider
   *
   * @param {boolean} [enabled=true] Whether to enable FreshWidget
   *
   * @description
   * Enable the FreshWidget component.
   */
  this.enableWidget = function (enabled) {
    widget = angular.isDefined(enabled) ? enabled : true;
  };

  /**
   * @ngdoc object
   * @name sw.freshdesk.$freshDesk
   *
   * @requires sw.freshdesk-chat.$freshChat
   * @requires sw.freshdesk-widget.$freshWidget
   *
   * @description
   * The wrapper service for the FreshDesk components.
   */
  this.$get = $get;
  $get.$inject = ['$freshChat', '$freshWidget'];
  function $get ($freshChat, $freshWidget) {
    var $freshDesk = {};

    /**
     * @ngdoc function
     * @name sw.freshdesk.$freshDesk#init
     * @methodOf sw.freshdesk.$freshDesk
     *
     * @description
     * Initializes the enabled FreshDesk components.
     */
    $freshDesk.init = function () {
      if (chat)
        $freshChat.init();

      if (widget)
        $freshWidget.init();
    };

    return $freshDesk;
  }
}

/**
 * @ngdoc overview
 * @name sw.freshdesk
 *
 * @description
 *
 * The `sw.freshdesk` module adds integration of {@link http://freshdesk.com FreshDesk} into AngularJS.
 */
angular.module('sw.freshdesk', ['sw.freshdesk-widget', 'sw.freshdesk-chat'])
  .provider('$freshDesk', $freshDeskProvider);
