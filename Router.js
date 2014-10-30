(function(){
  var Router = Backbone.Router.extend({
    routes: {
      "foodtruckid:/id": "foo" // matches http://example.com/#anything-here
    }
  });

  var router = new Router();
  router.on('route:foodtruckid', function(id){
    console.debug('id ', id);
  });



  Backbone.history.start();
})();
