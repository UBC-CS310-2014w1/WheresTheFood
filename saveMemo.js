var typeMemo = document.getElementById("txtMemoBox");
	btSaveMemo = document.getElementById("saveButton");

btSaveMemo.addEventListener("click", pushUserMemo("happy food", txtMemoBox));
typeMemo.value = '';

