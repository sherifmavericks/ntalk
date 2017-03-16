angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, sharedConn) {

    // var XMPP_DOMAIN = 'xmppnaxxa';  // OpenFire
    var XMPP_DOMAIN = 'nchat.nuhtek.com';  // eJabberd 

    $scope.login = function(user) {
        sharedConn.login(user.jid, XMPP_DOMAIN, user.pass);
    };

})


.controller('chatsCtrl', function() {

})

.controller('contactsCtrl', function($scope, $state, Chats) {
    
    $scope.add = function(to_id) {
        Chats.addNewRosterContact(to_id);
    };

    $scope.chats = Chats.allRoster();

    /*$scope.remove = function(chat) {
        Chats.removeRoster(chat);
    };

    $scope.chatDetail = function(to_id) {
        ChatDetails.setTo(to_id);
        $state.go('main.chatDetails', {}, {location: "replace", reload: true});
    }; */

    

})

.controller('settingsCtrl', function() {
    
})

.controller('chatDetailsCtrl', function() {

});