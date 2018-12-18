var budgetController = (function(){
    var Expense =function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income =function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals:{
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            //generate the new ID for the element
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }
            
            
            //determine whether or not it's income or expense
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            //add the new item to the correct array
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        testing: function(){
            console.log(data);
        }
    }


})();

var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }; 
        },
        addListItem: function(obj, type){
            //create html string with placeholder text

            //replace the placeholder text with actual data

            //insert the html into the DOM
        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();
var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function (){
            var DOM = UICtrl.getDOMstrings();
            document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
            document.addEventListener('keypress', function(event){
                if(event.keyCode === 13 || event.which === 13){
                    ctrlAddItem();
                }
            });
    };
    var ctrlAddItem = function(){
        var input, newItem;
        // this will get the input from the data
        input = UICtrl.getInput();
        //This will add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //add the item to the UI

        //calculate the budget

        //display the budget on the UI
    };
    return{
        init: function(){
            console.log('application has started.')
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();