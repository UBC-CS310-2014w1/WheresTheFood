var MemoView = (function() {
  
  var foodtruck = JSON.parse(sessionStorage.getItem(WTFConstants.FoodTruckKey));
  
  return Backbone.View.extend({

    initialize: function() {

      

    },

    resetMemo: function() {
      var txtBox = document.getElementById("txtMemoBox");
      dtMemo = document.getElementById("deleteButton");
      dtMemo.addEventListener("click", function() {
        txtBox.value = '';
      });

    },

    saveMemo: function() {
      var typeMemo = document.getElementById("txtMemoBox");
      btSaveMemo = document.getElementById("saveButton");

      btSaveMemo.addEventListener("click", pushUserMemo(foodtruck.id, txtMemoBox));
      typeMemo.value = '';
    }

  });


})();
