var budgetController = (function(){
    var Expense =function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round((this.value/totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    var Income =function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal= function(type){
        //create a sum variable
        var sum = 0;
        //use forEach to get all the elements and add them
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        deleteItem: function(type, id){
            var ids, index;
            //extracts the ID from the array and puts it into another array
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            //finds the position id inside our new array
            index = ids.indexOf(id);
            //is there is something, then delete
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget: income - expenses
            data.budget = data.totals.inc- data.totals.exp;
            //calculate the % of income that has been spent
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPerc;
        }
    }


})();

var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }; 
        },
        addListItem: function(obj, type){
            var html, newHtml;
            //create html string with placeholder text
            if (type === 'inc'){
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}
            else if (type === 'exp'){
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'}
            //replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)
            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        //This will clear the fields after adding
        clearFields: function(){
            //initialize variables
            var fields, fieldsArr;
            //select the classes from the html document, puts them in a list. 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            // it normally gives us a list, so trick it into an array
            fieldsArr = Array.prototype.slice.call(fields);
            //use forEach to itterate thgouh the entire array
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            //turn the focus back to the description
            fieldsArr[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages: function(percentages){
            var fields;
            fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++){
                    callback(list[i], i)
                };
            };
            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else {
                    current.textContent = '---'
                }
            });
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
            document.querySelector(DOM.container).addEventListener('click', crtlDeleteItem);
    };
    var updateBudget = function(){
        //first Calculate the budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //display the budget on the UI
        UICtrl.displayBudget(budget);
    }
    updatePercentages = function(){
        // calculate percentages
        budgetCtrl.calculatePercentages();
        //read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // update the user interface with the new percentages
        UICtrl.displayPercentages(percentages);
    };
    var ctrlAddItem = function(){
        var input, newItem;
        // this will get the input from the data
        input = UICtrl.getInput();
        //we only want to input data if the fields have data
        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
        //This will add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //clear the fields
        UICtrl.clearFields();
        //calculate  and update the budget
        updateBudget();
        // update the percentages
        updatePercentages();
        }
    };
    var crtlDeleteItem = function(event){
        //get the Id of the element starting from our target and traversing to the whole item
        var itemID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //split the type and Id from eachother
        if (itemID){
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            //delete the item from the UI
            UICtrl.deleteListItem(itemID);
            //update and show the new budget
            updateBudget();
            //update the percentages
            updatePercentages();
        }

    };
    return{
        init: function(){
            console.log('application has started.')
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();