(function (angular) {
  'use strict';

  angular.module('freshdesk', ['ng', 'freshdesk.chat'])
    .provider('FreshDesk', function (FreshDeskChatProvider) {
      var options = {
        account: null,
        product: null,
        feedback: false,
        chat: false,
        secure: false,
        nameField: 'name'
      };

      this.setAccount = function (account) {
        options.account = account;

        FreshDeskChatProvider.setAccount(account);
      };

      this.setProduct = function (product) {
        options.product = product;
      };

      this.setNameField = function (name) {
        options.nameField = name;
      };

      this.enableChat = function (enable) {
        options.chat = angular.isDefined(enable) ? enable : true;
      };

      this.enableFeedback = function (enable) {
        options.feedback = angular.isDefined(enable) ? enable : true;
      };

      function buildQueryString (requester, name) {
        var query = 'helpdesk_ticket[requester]=' + encodeURIComponent(requester);
        query += '&disable[requester]=true';

        if (options.product) {
          query += '&helpdesk_ticket[product]=' + options.product;
        }

        if (name) {
          query += '&helpdesk_ticket[custom_field][' + options.nameField + ']=' + name;
        }

        return query;
      }

      function getWidgetSrc () {
        if (options.secure)
          return 'https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js';
        else
          return 'http://assets.freshdesk.com/widget/freshwidget.js';
      }

      // Service constructor
      this.$get = function ($window, $document, $location, FreshDeskChat) {
        /* global FreshWidget */
        if (!options.account) return {};

        options.secure = $location.protocol() === 'https';

        var body = $document[0].getElementsByTagName('body')[0]
          , settings = {
            widgetType: 'popup',
            buttonType: 'text',
            buttonText: 'Support',
            buttonColor: 'white',
            buttonBg: '#006063',
            alignment: '2',
            offset: '-2000px',
            formHeight: '500px',
            url: 'https://' + options.account + '.freshdesk.com'
          };

        function addWidgetScript () {
          var script = $document[0].createElement('script');

          script.type = 'text/javascript';
          script.async = true;
          script.src = getWidgetSrc();
          script.onload = function () {
            FreshWidget.init('', settings);
          };

          body.appendChild(script);
        }

        function identify (identity, name) {
          if (!options.feedback) throw new Error('Feedback is disabled, not loading the widget.');

          var data = angular.extend({queryString: buildQueryString(identity, name)}, settings);

          FreshWidget.init('', data);
        }

        if (options.feedback) addWidgetScript();
        if (options.chat) FreshDeskChat.inject();

        return {
          identify: identify
        }
      }
    })
})(angular);
