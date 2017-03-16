angular.module('app.services', [])

.factory('sharedConn', ['$state', '$ionicPopup', function($state, $ionicPopup) {
    
    var SharedConnObj = {};

    // SharedConnObj.BOSH_SERVICE = 'http://127.0.0.1:7070/http-bind/';  // OpenFire
    SharedConnObj.BOSH_SERVICE = 'http://198.143.186.29:5280/http-bind';  // eJabberd
    SharedConnObj.connection = null;
    SharedConnObj.loggedIn = false;


    // **************** HELPER FUNCTIONS BEGIN ****************** //
    
        SharedConnObj.getConnectObj = function() {
            return SharedConnObj.connection;
        };

        SharedConnObj.isLoggedIn = function() {
            return SharedConnObj.loggedIn;  
        };

        SharedConnObj.getBareJid = function(s) {
            var str = s.substring(0, s.indexOf('/'));
            return str;
        };

    // **************** HELPER FUNCTIONS END ****************** //

    // Login function
    SharedConnObj.login = function(jid, host, pass) {
        SharedConnObj.connection = new Strophe.Connection( SharedConnObj.BOSH_SERVICE, {'keepalive': true});  // Strophe Connection Initialization
        SharedConnObj.connection.connect(jid+'@'+host, pass, SharedConnObj.onConnect);
    };

    // OnConnect XMPP
    SharedConnObj.onConnect = function(status) {
        if (status == Strophe.Status.CONNECTING) {
            console.log('Strophe is connecting');
        } else if (status == Strophe.Status.CONNFAIL) {
            console.log('Strophe failed to connect');
        } else if (status == Strophe.Status.DISCONNECTING) {
            console.log('Strophe is disconnecting');
        } else if (status == Strophe.Status.DISCONNECTED) {
            console.log('Strophe is disconnected');
        } else if (status == Strophe.Status.CONNECTED) {
            
            // Sending Presense to Server 
            SharedConnObj.connection.send($pres().tree());
            SharedConnObj.isLoggedIn = true;

            // Subscription Request Handler
            SharedConnObj.connection.addHandler(SharedConnObj.on_subscription_request, null, "presence", "subscribe");

            $state.go('main.contacts', {}, {location: "replace", reload: true});
        }
    };

    // *********** Helper Functions Begin ************//

        var accepted_map = {};

        // Find jid in accepted_map
        function is_element_map(jid) {
            if(jid in accepted_map) { 
                return true; 
            } else {
                return false;
            }
        }

        // Push jid in accepted_map
        function push_map(jid) {
            accepted_map[jid] = true;
        }

    // *********** Helper Functions End ************//

    SharedConnObj.on_subscription_request = function(stanza) {
        
        console.log(stanza);
            
            if(stanza.getAttribute("type") == "subscribe") { 

                // Friend request is received from Receiver
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Friend Request!',
                    template: stanza.getAttribute("from") + ' Wants Friendship.'
                });
        
            confirmPopup.then(function(res){
                if(res) {
                    console.log('Subscribed Successfully...');
                    SharedConnObj.connection.send($pres({ to: stanza.getAttribute("from"), type: "subscribed" }));
                    push_map( stanza.getAttribute("from") );
                } else {
                    console.log('Subscription Failed ....');
                    SharedConnObj.connection.send($pres({ to: stanza.getAttribute("from"), type: "unsubscribed" }));
                }
            });

            return true;
        }
    };   

    return SharedConnObj;
}])

.factory('Chats', ['sharedConn', '$rootScope', function(sharedConn, $rootScope) {
    
    ChatsObj = {};

    var connection = sharedConn.getConnectObj();

    ChatsObj.roster = [];

    loadRoster = function() {

        var iq = $iq({ type: 'get' }).c('query', { xmlns: 'jabber:iq:roster' });
        
        /*********************************************************/
        // Send roster iq
        connection.sendIQ(iq, /* On recieve roster iq */ function(iq) {
            console.log(iq);
            if(!iq || iq.length == 0) return;

            // jQuery load data after loading the page. This function updates data after jQuery loading            
            $rootScope.$apply(function() {
                $(iq).find("item").each(function() {
                    ChatsObj.roster.push({
                        id: $(this).attr("jid"),
                        name: $(this).attr("name") || $(this).attr("jid"),
                        lastText: 'Available',
                        face: 'img/faisal.png'
                    });
                });
            });
        });
        /*********************************************************/

        /*********************************************************/
        // Setup presnece handler and send initial presence
        connection.addHandler(/* On recieve presence */ function(presence){

            return true;
        }, null, "presence");

        connection.send($pres());
        /*********************************************************/

        /*********************************************************/
        // Setup update roster iq handler
        connection.addHandler(/* On recieve update roster iq */ function(iq) {
            console.log(iq);
            if(!iq || iq.length == 0) return;

            // jQuery load data after loading the page. This function updates data after jQuery loading
            $rootScope.$apply(function() {

                $(iq).find("item").each(function(){

                    // roster update via Client 1 (ie this client) accepting request
                    if($(this).attr("subscription") == "from") {
                        
                    }

                });

            });

        }, "jabber:iq:roster", "iq", "set");
        /*********************************************************/

        return ChatsObj.roster;
    };

    ChatsObj.allRoster = function() {
        loadRoster();
        return ChatsObj.roster;
    };
    
    ChatsObj.addNewRosterContact = function(to_id) {
        console.log(to_id);
        connection.send($pres({ to: to_id, type: "subscribe" }));
    };
    
    return ChatsObj;
}]);