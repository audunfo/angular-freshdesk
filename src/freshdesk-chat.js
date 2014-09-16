(function (angular) {
  'use strict';

  angular.module('freshdesk.chat', ['ng'])
    .provider('FreshDeskChat', function () {
      var options = {
        account: null,
        chatId: null,
        chatKey: null,
        secure: false
      }

      var messages = {
        welcome: 'Hi! How can we help you today?',
        thanks: 'Thank you for chatting with us. If you have additional questions, feel free to ping us!',
        wait: 'One of us will be with you right away, please wait.',
        prechat: 'We can\'t wait to talk to you. But first, please take a couple of moments to tell us a bit about yourself.',
        agent_joined: '{{agent_name}} has joined the chat',
        agent_left: '{{agent_name}} has left the chat',
        connecting: 'Waiting for an agent',
        non_availability: 'We are sorry, all our agents are busy. Please # leave us a message # and we\'ll get back to you right away.'
      }

      var labels = {
        minimized_title: 'Chat with helpdesk',
        maximized_title: 'Chat',
        me: 'Me',
        name: 'Name',
        mail: 'Email',
        phone: 'Phone Number',
        placeholder: 'Your Message',
        begin_chat: 'Begin chat'
      }

      // -- API ---------------------------------------------------------------

      this.messages = messages
      this.labels = labels

      this.setAccount = function (account) {
        options.account = account
      }

      this.setCredentials = function (id, key) {
        options.chatId = id
        options.chatKey = key
      }

      // -- Internals ---------------------------------------------------------

      function getChatScriptSrc () {
        if (options.secure)
          return 'https://d36mpcpuzc4ztk.cloudfront.net/js/visitor.js'
        else
          return 'http://assets.chat.freshdesk.com/js/visitor.js'
      }

      function getChatStyleSrc () {
        if (options.secure)
          return 'https://d36mpcpuzc4ztk.cloudfront.net/css/visitor.css'
        else
          return 'http://assets1.chat.freshdesk.com/css/visitor.css'
      }

      // -- Service -----------------------------------------------------------

      this.$get = function ($window, $document, $location) {
        if (!options.account) return {}

        options.secure = $location.protocol() === 'https'

        var body = $document[0].getElementsByTagName('body')[0]
          , settings = {
          fc_id: options.chatId,
          fc_se: options.chatKey,
          minimized_title: labels.minimized_title,
          maximized_title: labels.maximized_title,
          welcome_message: messages.welcome,
          thank_message: messages.thanks,
          wait_message: messages.wait,
          prechat_message: messages.prechat,
          prechat_form: 0,
          prechat_mail: 0,
          prechat_phone: 0,
          proactive_chat: 0,
          proactive_time: 15,
          show_on_portal: false,
          portal_login_required: true,
          weburl: options.account + '.freshdesk.com',
          nodeurl: 'chat.freshdesk.com',
          debug: 1,
          agent_joined_msg: messages.agent_joined,
          agent_left_msg: messages.agent_left,
          connecting_msg: messages.connecting,
          non_availability_message: messages.non_availability,
          me: labels.me,
          name_label: labels.name,
          mail_label: labels.mail,
          phone_label: labels.phone,
          text_place: labels.placeholder,
          begin_chat: labels.begin_chat,
          color: '#666666',
          offset: '45',
          position: 'Bottom Right',
          ticket_link_option: '0',
          expiry: 1410856910000,
          custom_link_url: '',
          environment: 'production'
        }

        function encodeSettings () {
          var data = JSON.stringify(settings)

          return $window.btoa(data)
        }

        function addChatScript () {
          if (!options.chatId) throw new Error('Cannot load Freshdesk Chat, credentials are missing.')

          var script = $document[0].createElement('script')
            , style = $document[0].createElement('link')

          style.rel = 'stylesheet'
          style.type = 'text/css'
          style.href = getChatStyleSrc()

          body.appendChild(style)

          script.type = 'text/javascript'
          script.async = true
          script.src = getChatScriptSrc()

          body.appendChild(script)

          try {
            $window.freshchat_setting = encodeSettings()
          } catch (error) {
            $window.freshchat_setting = ''
          }
        }

        return {
          inject: addChatScript
        }
      }
    })
})(angular);