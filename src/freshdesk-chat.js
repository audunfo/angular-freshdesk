/**
 * @ngdoc object
 * @name sw.freshdesk-chat.$freshChatProvider
 *
 * @description
 * The provider for the `$freshChat` service. Allows boot-time configuration of the FreshChat widget.
 */
$freshChatProvider.$inject = [];
function $freshChatProvider () {
  'use strict';

  var accountUrl,
      clientId,
      clientSecret,
      labels = {},
      secure = false,
      options = {};

  function getScriptUrl () {
    if (secure)
      return 'https://d36mpcpuzc4ztk.cloudfront.net/js/visitor.js';
    else
      return 'http://assets.chat.freshdesk.com/js/visitor.js';
  }

  function getStyleUrl () {
    if (secure)
      return 'https://d36mpcpuzc4ztk.cloudfront.net/css/visitor.css';
    else
      return 'http://assets1.chat.freshdesk.com/css/visitor.css';
  }

  function getSettings () {
    var settings = angular.copy(options);
    settings.fc_id = clientId;
    settings.nodeurl = 'chat.freshdesk.com';
    settings.environment = 'production';

    if (angular.isDefined(clientSecret))
      settings.fc_se = clientSecret;

    angular.extend(settings, labels);

    return settings;
  }

  /**
   * @ngdoc function
   * @name sw.freshdesk-chat.$freshChatProvider#setAccount
   * @methodOf sw.freshdesk-chat.$freshChatProvider
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
   * @name sw.freshdesk-chat.$freshChatProvider#setAccountUrl
   * @methodOf sw.freshdesk-chat.$freshChatProvider
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
   * @name sw.freshdesk-chat.$freshChatProvider#setCredentials
   * @methodOf sw.freshdesk-chat.$freshChatProvider
   *
   * @param {string}  id      The FreshChat client id
   * @param {string} [secret] The FreshChat client secret
   *
   * @description
   * Set the FreshChat credentials.
   */
  this.setCredentials = function (id, secret) {
    clientId = id;
    clientSecret = secret;
  };

  /**
   * @ngdoc object
   * @name sw.freshdesk-chat.$freshChat
   *
   * @requires $location
   * @requires $document
   * @requires $window
   *
   * @property {object} labels The labels used in FreshChat. Allows you to translate / alter the labels.
   *
   * @description
   * The `$freshChat` service is a wrapper to inject the FreshChat widget into the page.
   */
  this.$get = $get;
  $get.$inject = ['$location', '$document', '$window'];
  function $get ($location, $document, $window) {
    var $freshChat = {};

    secure = $location.protocol() === 'https';

    function injectScript () {
      var script = $document[0].createElement('script');

      script.type = 'text/javascript';
      script.async = true;
      script.src = getScriptUrl();

      $document.find('head').append(script);
    }

    function injectStylesheet () {
      var link = $document[0].createElement('link');

      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = getStyleUrl();

      $document.find('head').append(link);
    }

    function injectSettings () {
      var settings = getSettings();

      settings = JSON.stringify(settings);

      $window.freshchat_setting = $window.btoa(settings);
    }

    $freshChat.labels = labels = {
      welcome_message: 'Hi! How can we help you today?',
      thank_message: 'Thank you for chatting with us. If you have additional questions, feel free to ping us!',
      wait_message: 'One of us will be with you right away, please wait.',
      prechat_message: 'We can\'t wait to talk to you. But first, please take a couple of moments to tell us a bit about yourself.',
      agent_joined_msg: '{{agent_name}} has joined the chat',
      agent_left_msg: '{{agent_name}} has left the chat',
      connecting_msg: 'Waiting for an agent',
      non_availability_message: 'We are sorry, all our agents are busy. Please # leave us a message # and we\'ll get back to you right away.',
      minimized_title: 'Chat with helpdesk',
      maximized_title: 'Chat',
      me: 'Me',
      name_label: 'Name',
      mail_label: 'Email',
      phone_label: 'Phone Number',
      text_place: 'Your Message',
      begin_chat: 'Begin chat'
    };

    /**
     * @ngdoc method
     * @name sw.freshdesk-chat.$freshChat#init
     * @methodOf sw.freshdesk-chat.$freshChat
     *
     * @description
     * Inject the FreshChat objects into the DOM.
     *
     * This adds the remote script and stylesheet and sets the `freshchat_setting` data on the `$window`.
     */
    $freshChat.init = function () {
      if (angular.isUndefined(clientId))
        throw new Error('FreshChat client id is not set.');

      injectSettings();
      injectScript();
      injectStylesheet();
    };

    return $freshChat;
  }
}

/**
 * @ngdoc overview
 * @name sw.freshdesk-chat
 *
 * @description
 *
 * This module adds FreshChat support to AngularJS.
 */
angular.module('sw.freshdesk-chat', ['ng'])
  .provider('$freshChat', $freshChatProvider);
