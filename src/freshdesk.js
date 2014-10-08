'use strict';

/**
 * @ngdoc object
 * @name freshdesk.$freshDeskProvider
 *
 * @requires freshdesk.chat.$freshChatProvider
 * @requires freshdesk.widget.$freshWidgetProvider
 *
 * @description
 * Utility service for the different FreshDesk components.
 *
 * Using this provider, you can configure the common settings for all components at once.
 */
$freshDeskProvider.$inject = ['$freshChatProvider', '$freshWidgetProvider'];
function $freshDeskProvider ($freshChatProvider, $freshWidgetProvider) {
  var chat = false, widget = false;

  /**
   * @ngdoc function
   * @name freshdesk.$freshDeskProvider#setAccount
   * @methodOf freshdesk.$freshDeskProvider
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
   * @name freshdesk.$freshDeskProvider#setAccountUrl
   * @methodOf freshdesk.$freshDeskProvider
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
   * @name freshdesk.$freshDeskProvider#enableChat
   * @methodOf freshdesk.$freshDeskProvider
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
   * @name freshdesk.$freshDeskProvider#enableWidget
   * @methodOf freshdesk.$freshDeskProvider
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
   * @name freshdesk.$freshDesk
   *
   * @requires freshdesk.chat.$freshChat
   * @requires freshdesk.widget.$freshWidget
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
     * @name freshdesk.$freshDesk#init
     * @methodOf freshdesk.$freshDesk
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

angular.module('freshdesk', ['freshdesk.widget', 'freshdesk.chat'])
  .provider('$freshDesk', $freshDeskProvider);