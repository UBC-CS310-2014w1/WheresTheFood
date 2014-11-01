var MemoView = (function() {
  
  var foodtruck = JSON.parse(sessionStorage.getItem(WTFConstants.FoodTruckKey));
  var server = new Server();

  var saveButton = document.getElementById("saveButton");
  var deleteButton = document.getElementById("deleteButton");
  var textBox = document.getElementById("txtMemoBox");

  var updateText = function(text) {
      textBox.value = text;
  };

  return Backbone.View.extend({

    initialize: function() {

      server.getCurrentMemo(foodtruck.id, updateText);
      
      saveButton.addEventListener("click", function() {
          console.log('saving');
          server.pushUserMemo(foodtruck.id, textBox.value);
      });

      deleteButton.addEventListener("click", function() {
          console.log('memo reset');
          textBox.value = '';
          server.pushUserMemo(foodtruck.id, textBox.value);
      });
      
    },
  });

})();
